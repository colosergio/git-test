import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { initialsFor } from "../domain/presenters.ts";
import type { ArenaStore } from "../store/arena-store.ts";
import type { TokenService } from "../security/tokens.ts";
import { normalizeHandle, parseBody, requireUser } from "./helpers.ts";

const profileSchema = z.object({
  displayName: z.string().trim().min(2).max(60).optional(),
  handle: z.string().trim().min(3).max(24).regex(/^@?[a-zA-Z0-9_.]+$/).optional(),
  gamertags: z.object({ psn: z.string().trim().max(32).optional(), xbox: z.string().trim().max(32).optional(), ea: z.string().trim().max(32).optional() }).optional(),
});

function userResponse(user: ReturnType<ArenaStore["snapshot"]>["users"][number]) {
  return { id: user.id, email: user.email, displayName: user.displayName, name: user.displayName, handle: user.handle, initials: initialsFor(user.displayName), level: user.level, rating: user.rating, gamertags: user.gamertags };
}

export function registerProfileRoutes(app: FastifyInstance, store: ArenaStore, tokens: TokenService) {
  app.get("/v1/me", async (request, reply) => {
    const userId = await requireUser(request, reply, tokens);
    if (!userId) return;
    const user = store.snapshot().users.find((item) => item.id === userId);
    if (!user) return reply.code(404).send({ error: "not_found", message: "No encontramos tu perfil." });
    return userResponse(user);
  });

  app.patch("/v1/me", async (request, reply) => {
    const userId = await requireUser(request, reply, tokens);
    if (!userId) return;
    const body = parseBody(profileSchema, request.body, reply);
    if (!body) return;
    const handle = body.handle ? normalizeHandle(body.handle) : undefined;
    const snapshot = store.snapshot();
    if (handle && snapshot.users.some((user) => user.id !== userId && user.handle === handle)) return reply.code(409).send({ error: "handle_taken", message: "Ese usuario ya está ocupado." });
    const updated = await store.update((draft) => {
      const user = draft.users.find((item) => item.id === userId);
      if (!user) return null;
      if (body.displayName) user.displayName = body.displayName.trim();
      if (handle) user.handle = handle;
      if (body.gamertags) user.gamertags = { ...user.gamertags, ...body.gamertags };
      return user;
    });
    if (!updated) return reply.code(404).send({ error: "not_found", message: "No encontramos tu perfil." });
    return userResponse(updated);
  });
}
