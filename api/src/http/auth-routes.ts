import { randomUUID } from "node:crypto";

import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { initialsFor } from "../domain/presenters.ts";
import type { ArenaStore } from "../store/arena-store.ts";
import { hashPassword, verifyPassword } from "../security/password.ts";
import type { TokenService } from "../security/tokens.ts";
import { normalizeHandle, parseBody } from "./helpers.ts";

const registerSchema = z.object({
  email: z.email("Ingresa un email válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres.").max(128),
  displayName: z.string().trim().min(2, "Ingresa tu nombre.").max(60),
  handle: z.string().trim().min(3, "El usuario debe tener al menos 3 caracteres.").max(24).regex(/^@?[a-zA-Z0-9_.]+$/, "Usa solo letras, números, punto o guion bajo."),
});

const loginSchema = z.object({ email: z.email("Ingresa un email válido."), password: z.string().min(1, "Ingresa tu contraseña.") });

export function registerAuthRoutes(app: FastifyInstance, store: ArenaStore, tokens: TokenService) {
  app.post("/v1/auth/register", { config: { rateLimit: { max: 8, timeWindow: "1 minute" } } }, async (request, reply) => {
    const body = parseBody(registerSchema, request.body, reply);
    if (!body) return;
    const email = body.email.trim().toLocaleLowerCase("en");
    const handle = normalizeHandle(body.handle);
    const existing = store.snapshot().users.find((user) => user.email === email || user.handle === handle);
    if (existing) return reply.code(409).send({ error: "account_exists", message: existing.email === email ? "Ese email ya está registrado." : "Ese usuario ya está ocupado." });

    const passwordHash = await hashPassword(body.password);
    const now = new Date().toISOString();
    const user = await store.update((draft) => {
      if (draft.users.some((item) => item.email === email || item.handle === handle)) return null;
      const created = { id: randomUUID(), email, passwordHash, displayName: body.displayName.trim(), handle, level: 1, rating: 5, gamertags: {}, createdAt: now };
      draft.users.push(created);
      draft.activity.push({ id: randomUUID(), userId: created.id, type: "welcome", title: "Bienvenido a Arena", detail: "Completa tu gamertag y crea tu primer reto.", occurredAt: now });
      return created;
    });
    if (!user) return reply.code(409).send({ error: "account_exists", message: "El email o usuario ya fue registrado." });
    return reply.code(201).send({ token: await tokens.issue(user.id), user: { id: user.id, email: user.email, displayName: user.displayName, name: user.displayName, handle: user.handle, initials: initialsFor(user.displayName), level: user.level, rating: user.rating, gamertags: user.gamertags } });
  });

  app.post("/v1/auth/login", { config: { rateLimit: { max: 10, timeWindow: "1 minute" } } }, async (request, reply) => {
    const body = parseBody(loginSchema, request.body, reply);
    if (!body) return;
    const user = store.snapshot().users.find((item) => item.email === body.email.trim().toLocaleLowerCase("en"));
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) return reply.code(401).send({ error: "invalid_credentials", message: "Email o contraseña incorrectos." });
    return { token: await tokens.issue(user.id), user: { id: user.id, email: user.email, displayName: user.displayName, name: user.displayName, handle: user.handle, initials: initialsFor(user.displayName), level: user.level, rating: user.rating, gamertags: user.gamertags } };
  });
}
