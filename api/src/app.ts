import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";

import { registerAuthRoutes } from "./http/auth-routes.ts";
import { registerChallengeRoutes } from "./http/challenge-routes.ts";
import { registerMatchRoutes } from "./http/match-routes.ts";
import { registerProfileRoutes } from "./http/profile-routes.ts";
import { createTokenService } from "./security/tokens.ts";
import type { ArenaStore } from "./store/arena-store.ts";

export async function buildApp(options: { store: ArenaStore; jwtSecret: string; logger?: boolean }) {
  const app = Fastify({ logger: options.logger ?? false });
  await app.register(cors, { origin: true });
  await app.register(rateLimit, { max: 120, timeWindow: "1 minute" });
  const tokens = createTokenService(options.jwtSecret);

  app.get("/health", async () => ({ status: "ok", service: "arena-api" }));
  registerAuthRoutes(app, options.store, tokens);
  registerProfileRoutes(app, options.store, tokens);
  registerChallengeRoutes(app, options.store, tokens);
  registerMatchRoutes(app, options.store, tokens);

  return app;
}
