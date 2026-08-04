import assert from "node:assert/strict";
import test from "node:test";

import { buildApp } from "../src/app.ts";
import { MemoryArenaStore } from "../src/store/arena-store.ts";

const secret = "test-secret-with-at-least-thirty-two-characters";

async function register(app: Awaited<ReturnType<typeof buildApp>>, suffix: string) {
  const response = await app.inject({ method: "POST", url: "/v1/auth/register", payload: { email: `${suffix}@example.com`, password: "Password123!", displayName: `Player ${suffix}`, handle: suffix } });
  assert.equal(response.statusCode, 201, response.body);
  return response.json<{ token: string; user: { id: string } }>();
}

test("registra, autentica y actualiza un perfil", async (t) => {
  const app = await buildApp({ store: new MemoryArenaStore(), jwtSecret: secret });
  t.after(() => app.close());
  const account = await register(app, "sergio");
  const update = await app.inject({ method: "PATCH", url: "/v1/me", headers: { authorization: `Bearer ${account.token}` }, payload: { gamertags: { psn: "SergioFC" } } });
  assert.equal(update.statusCode, 200);
  assert.equal(update.json().gamertags.psn, "SergioFC");
});

test("sincroniza un reto y completa un resultado cuando ambos reportes coinciden", async (t) => {
  const app = await buildApp({ store: new MemoryArenaStore(), jwtSecret: secret });
  t.after(() => app.close());
  const creator = await register(app, "creator");
  const rival = await register(app, "rival");

  const created = await app.inject({ method: "POST", url: "/v1/challenges", headers: { authorization: `Bearer ${creator.token}` }, payload: { gameId: "fc26", platformId: "ps5", mode: "1 vs 1", rewardPoints: 50, availability: "Ahora" } });
  assert.equal(created.statusCode, 201, created.body);
  const challengeId = created.json().id as string;

  const accepted = await app.inject({ method: "POST", url: `/v1/challenges/${challengeId}/accept`, headers: { authorization: `Bearer ${rival.token}` } });
  assert.equal(accepted.statusCode, 200, accepted.body);
  const matchId = accepted.json().match.id as string;

  const first = await app.inject({ method: "POST", url: `/v1/matches/${matchId}/report-result`, headers: { authorization: `Bearer ${creator.token}` }, payload: { ownScore: 3, opponentScore: 1 } });
  assert.equal(first.json().status, "awaiting_opponent");
  const second = await app.inject({ method: "POST", url: `/v1/matches/${matchId}/report-result`, headers: { authorization: `Bearer ${rival.token}` }, payload: { ownScore: 1, opponentScore: 3 } });
  assert.equal(second.json().status, "completed");
  assert.equal(second.json().result.playerOneScore, 3);
  assert.equal(second.json().result.winnerId, creator.user.id);
});

test("envía a disputa los reportes incompatibles", async (t) => {
  const app = await buildApp({ store: new MemoryArenaStore(), jwtSecret: secret });
  t.after(() => app.close());
  const creator = await register(app, "alpha");
  const rival = await register(app, "beta");
  const created = await app.inject({ method: "POST", url: "/v1/challenges", headers: { authorization: `Bearer ${creator.token}` }, payload: { gameId: "nba2k26", platformId: "xbox", mode: "1 vs 1", rewardPoints: 30, availability: "Ahora" } });
  const accepted = await app.inject({ method: "POST", url: `/v1/challenges/${created.json().id}/accept`, headers: { authorization: `Bearer ${rival.token}` } });
  const matchId = accepted.json().match.id as string;
  await app.inject({ method: "POST", url: `/v1/matches/${matchId}/report-result`, headers: { authorization: `Bearer ${creator.token}` }, payload: { ownScore: 2, opponentScore: 0 } });
  const conflict = await app.inject({ method: "POST", url: `/v1/matches/${matchId}/report-result`, headers: { authorization: `Bearer ${rival.token}` }, payload: { ownScore: 3, opponentScore: 1 } });
  assert.equal(conflict.json().status, "disputed");
});
