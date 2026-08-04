import test from "node:test";
import assert from "node:assert/strict";
import { challenges, createChallenge, filterChallenges } from "../data.js";

test("filterChallenges filtra por juego", () => {
  const result = filterChallenges(challenges, "NBA 2K26");
  assert.equal(result.length, 2);
  assert.ok(result.every(item => item.game === "NBA 2K26"));
});

test("filterChallenges busca sin distinguir mayúsculas", () => {
  const result = filterChallenges(challenges, "Todos", "NICO");
  assert.deepEqual(result.map(item => item.player), ["Nico Rojas"]);
});

test("createChallenge normaliza puntos a número y usa el perfil actual", () => {
  const result = createChallenge({ game: "Rocket League", platform: "PC", mode: "2 vs 2", points: "75", time: "Ahora" });
  assert.equal(result.points, 75);
  assert.equal(result.handle, "@leo10");
  assert.equal(result.game, "Rocket League");
});
