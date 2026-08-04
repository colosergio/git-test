import { randomUUID } from "node:crypto";

import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { challengeResponse, matchResponse } from "../domain/presenters.ts";
import type { ArenaStore } from "../store/arena-store.ts";
import type { TokenService } from "../security/tokens.ts";
import { parseBody, requireUser } from "./helpers.ts";

const createSchema = z.object({
  gameId: z.enum(["fc26", "nba2k26", "rocket-league"]),
  platformId: z.enum(["ps5", "xbox", "pc", "crossplay"]),
  mode: z.string().trim().min(1).max(30),
  rewardPoints: z.number().int().min(10).max(500),
  availability: z.string().trim().min(2).max(40),
});

const idParams = z.object({ id: z.string().min(1) });

export function registerChallengeRoutes(app: FastifyInstance, store: ArenaStore, tokens: TokenService) {
  app.get("/v1/challenges", async (request, reply) => {
    const userId = await requireUser(request, reply, tokens);
    if (!userId) return;
    const state = store.snapshot();
    return state.challenges
      .filter((challenge) => challenge.status === "open" || challenge.creatorId === userId || challenge.acceptedBy === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((challenge) => challengeResponse(state, challenge));
  });

  app.post("/v1/challenges", async (request, reply) => {
    const userId = await requireUser(request, reply, tokens);
    if (!userId) return;
    const body = parseBody(createSchema, request.body, reply);
    if (!body) return;
    const now = new Date().toISOString();
    const challenge = await store.update((draft) => {
      const created = { id: randomUUID(), creatorId: userId, ...body, mode: body.mode.trim(), availability: body.availability.trim(), status: "open" as const, createdAt: now };
      draft.challenges.push(created);
      draft.activity.push({ id: randomUUID(), userId, type: "created", title: "Creaste un nuevo reto", detail: `${body.mode} · ${body.rewardPoints} puntos`, occurredAt: now });
      return created;
    });
    return reply.code(201).send(challengeResponse(store.snapshot(), challenge));
  });

  app.post("/v1/challenges/:id/accept", async (request, reply) => {
    const userId = await requireUser(request, reply, tokens);
    if (!userId) return;
    const params = idParams.safeParse(request.params);
    if (!params.success) return reply.code(400).send({ error: "validation_error", message: "Reto inválido." });
    const now = new Date().toISOString();
    const result = await store.update((draft) => {
      const challenge = draft.challenges.find((item) => item.id === params.data.id);
      if (!challenge) return { error: "not_found" as const };
      if (challenge.creatorId === userId) return { error: "own_challenge" as const };
      if (challenge.status !== "open") return { error: "unavailable" as const };
      const match = { id: randomUUID(), challengeId: challenge.id, playerOneId: challenge.creatorId, playerTwoId: userId, status: "awaiting_results" as const, reports: [], createdAt: now, updatedAt: now };
      challenge.status = "accepted";
      challenge.acceptedBy = userId;
      challenge.matchId = match.id;
      draft.matches.push(match);
      draft.activity.push(
        { id: randomUUID(), userId, type: "accepted", title: "Aceptaste un reto", detail: `${challenge.mode} · ${challenge.rewardPoints} puntos`, occurredAt: now },
        { id: randomUUID(), userId: challenge.creatorId, type: "accepted", title: "Aceptaron tu reto", detail: `${challenge.mode} · ${challenge.rewardPoints} puntos`, occurredAt: now },
      );
      return { challenge, match };
    });
    if ("error" in result && result.error) {
      const messages = { not_found: "No encontramos ese reto.", own_challenge: "No puedes aceptar tu propio reto.", unavailable: "El reto ya no está disponible." };
      return reply.code(result.error === "not_found" ? 404 : 409).send({ error: result.error, message: messages[result.error] });
    }
    const state = store.snapshot();
    return { challenge: challengeResponse(state, result.challenge), match: matchResponse(state, result.match, userId) };
  });
}
