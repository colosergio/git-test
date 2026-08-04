import { randomUUID } from "node:crypto";

import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { matchResponse } from "../domain/presenters.ts";
import type { ActivityType, MatchRecord, MatchStatus } from "../domain/types.ts";
import type { ArenaStore } from "../store/arena-store.ts";
import type { TokenService } from "../security/tokens.ts";
import { parseBody, requireUser } from "./helpers.ts";

const resultSchema = z.object({ ownScore: z.number().int().min(0).max(99), opponentScore: z.number().int().min(0).max(99) });
const idParams = z.object({ id: z.string().min(1) });

function settle(match: MatchRecord, now: string): MatchStatus {
  if (match.reports.length < 2) {
    match.status = "awaiting_opponent";
    return match.status;
  }
  const playerOneReport = match.reports.find((report) => report.userId === match.playerOneId);
  const playerTwoReport = match.reports.find((report) => report.userId === match.playerTwoId);
  if (!playerOneReport || !playerTwoReport) return match.status;
  const compatible = playerOneReport.ownScore === playerTwoReport.opponentScore && playerOneReport.opponentScore === playerTwoReport.ownScore;
  if (!compatible) {
    match.status = "disputed";
    return match.status;
  }
  const winnerId = playerOneReport.ownScore === playerOneReport.opponentScore ? undefined : playerOneReport.ownScore > playerOneReport.opponentScore ? match.playerOneId : match.playerTwoId;
  match.status = "completed";
  match.result = { playerOneScore: playerOneReport.ownScore, playerTwoScore: playerOneReport.opponentScore, ...(winnerId ? { winnerId } : {}), completedAt: now };
  return match.status;
}

export function registerMatchRoutes(app: FastifyInstance, store: ArenaStore, tokens: TokenService) {
  app.get("/v1/matches", async (request, reply) => {
    const userId = await requireUser(request, reply, tokens);
    if (!userId) return;
    const state = store.snapshot();
    return state.matches
      .filter((match) => match.playerOneId === userId || match.playerTwoId === userId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map((match) => matchResponse(state, match, userId));
  });

  app.post("/v1/matches/:id/report-result", async (request, reply) => {
    const userId = await requireUser(request, reply, tokens);
    if (!userId) return;
    const params = idParams.safeParse(request.params);
    const body = parseBody(resultSchema, request.body, reply);
    if (!params.success || !body) return;
    const now = new Date().toISOString();
    const outcome = await store.update((draft) => {
      const match = draft.matches.find((item) => item.id === params.data.id);
      if (!match) return { error: "not_found" as const };
      if (match.playerOneId !== userId && match.playerTwoId !== userId) return { error: "forbidden" as const };
      if (match.status === "completed") return { error: "completed" as const };
      match.reports = match.reports.filter((report) => report.userId !== userId);
      match.reports.push({ userId, ...body, reportedAt: now });
      match.updatedAt = now;
      const settledStatus = settle(match, now);
      const challenge = draft.challenges.find((item) => item.id === match.challengeId);
      if (challenge && settledStatus === "completed") challenge.status = "completed";
      draft.activity.push({ id: randomUUID(), userId, type: "reported", title: "Reportaste el resultado", detail: `${body.ownScore} — ${body.opponentScore}`, occurredAt: now });
      if (settledStatus === "completed" && match.result) {
        for (const participantId of [match.playerOneId, match.playerTwoId]) {
          const type: ActivityType = !match.result.winnerId ? "draw" : match.result.winnerId === participantId ? "win" : "loss";
          draft.activity.push({ id: randomUUID(), userId: participantId, type, title: type === "win" ? "Victoria confirmada" : type === "loss" ? "Resultado confirmado" : "Empate confirmado", detail: `${match.result.playerOneScore} — ${match.result.playerTwoScore}`, occurredAt: now });
        }
      } else if (settledStatus === "disputed") {
        for (const participantId of [match.playerOneId, match.playerTwoId]) draft.activity.push({ id: randomUUID(), userId: participantId, type: "disputed", title: "Resultado en revisión", detail: "Los reportes no coinciden.", occurredAt: now });
      }
      return { match };
    });
    if ("error" in outcome) {
      const status = outcome.error === "not_found" ? 404 : outcome.error === "forbidden" ? 403 : 409;
      const message = outcome.error === "not_found" ? "No encontramos ese match." : outcome.error === "forbidden" ? "No participas en ese match." : "El resultado ya fue confirmado.";
      return reply.code(status).send({ error: outcome.error, message });
    }
    return matchResponse(store.snapshot(), outcome.match, userId);
  });

  app.get("/v1/activity", async (request, reply) => {
    const userId = await requireUser(request, reply, tokens);
    if (!userId) return;
    return store.snapshot().activity.filter((item) => item.userId === userId).sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  });
}
