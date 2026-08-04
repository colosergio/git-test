import assert from "node:assert/strict";
import test from "node:test";

import { seedChallenges } from "../src/data/seed.ts";
import { buildChallenge, filterChallenges, validateChallenge } from "../src/domain/challenges.ts";

test("filtra retos por juego y por el nombre visible de la plataforma", () => {
  assert.equal(filterChallenges(seedChallenges, "fc26", "").length, 2);
  assert.deepEqual(
    filterChallenges(seedChallenges, "all", "PlayStation").map((challenge) => challenge.id),
    ["challenge-1", "challenge-2"],
  );
});

test("valida el rango permitido de puntos Arena", () => {
  const base = { gameId: "fc26" as const, platformId: "ps5" as const, mode: "1 vs 1", availability: "Ahora" };
  assert.equal(validateChallenge({ ...base, rewardPoints: 9 }).length, 1);
  assert.equal(validateChallenge({ ...base, rewardPoints: 500 }).length, 0);
});

test("crea un reto abierto, estable y normalizado", () => {
  const now = new Date("2026-08-04T14:00:00.000Z");
  const challenge = buildChallenge(
    { gameId: "nba2k26", platformId: "xbox", mode: " 1 vs 1 ", rewardPoints: 75, availability: " Hoy 20:00 " },
    now,
  );

  assert.equal(challenge.id, "challenge-1785852000000");
  assert.equal(challenge.status, "open");
  assert.equal(challenge.mode, "1 vs 1");
  assert.equal(challenge.availability, "Hoy 20:00");
});
