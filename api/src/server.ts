import { resolve } from "node:path";

import { buildApp } from "./app.ts";
import { FileArenaStore } from "./store/arena-store.ts";

const port = Number(process.env.ARENA_API_PORT ?? 3333);
const host = process.env.ARENA_API_HOST ?? "0.0.0.0";
const dataFile = resolve(process.env.ARENA_DATA_FILE ?? "./data/arena.json");
const configuredJwtSecret = process.env.ARENA_JWT_SECRET;
const jwtSecret = configuredJwtSecret ?? "arena-development-secret-change-before-production";
const logger = process.env.ARENA_API_LOGGER !== "false";

if (process.env.NODE_ENV === "production" && (!configuredJwtSecret || configuredJwtSecret.length < 32)) throw new Error("ARENA_JWT_SECRET must contain at least 32 characters in production");

const store = await FileArenaStore.create(dataFile);
const app = await buildApp({ store, jwtSecret, logger });

try {
  await app.listen({ port, host });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
