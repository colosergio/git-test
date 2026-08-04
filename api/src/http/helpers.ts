import type { FastifyReply, FastifyRequest } from "fastify";
import type { ZodType } from "zod";

import type { TokenService } from "../security/tokens.ts";

export function parseBody<T>(schema: ZodType<T>, body: unknown, reply: FastifyReply): T | null {
  const parsed = schema.safeParse(body);
  if (parsed.success) return parsed.data;
  void reply.code(400).send({ error: "validation_error", message: parsed.error.issues[0]?.message ?? "Datos inválidos" });
  return null;
}

export async function requireUser(request: FastifyRequest, reply: FastifyReply, tokens: TokenService) {
  const authorization = request.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    void reply.code(401).send({ error: "unauthorized", message: "Inicia sesión para continuar." });
    return null;
  }
  try {
    return await tokens.verify(authorization.slice(7));
  } catch {
    void reply.code(401).send({ error: "unauthorized", message: "La sesión venció o no es válida." });
    return null;
  }
}

export function normalizeHandle(value: string) {
  const clean = value.trim().replace(/^@+/, "").toLocaleLowerCase("es");
  return `@${clean}`;
}
