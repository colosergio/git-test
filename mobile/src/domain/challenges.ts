import { games, platforms } from "../data/catalog.ts";
import { currentPlayer } from "../data/seed.ts";
import type { Challenge, CreateChallengeInput, GameId } from "../types.ts";

export type ChallengeFilter = "all" | GameId;

export function filterChallenges(challenges: Challenge[], filter: ChallengeFilter, query: string) {
  const normalized = query.trim().toLocaleLowerCase("es");

  return challenges.filter((challenge) => {
    if (filter !== "all" && challenge.gameId !== filter) return false;
    if (!normalized) return true;

    const searchable = [
      challenge.creator.name,
      challenge.creator.handle,
      challenge.mode,
      challenge.platformId,
      platforms[challenge.platformId],
      challenge.gameId,
      games[challenge.gameId].name,
    ]
      .join(" ")
      .toLocaleLowerCase("es");

    return searchable.includes(normalized);
  });
}

export function validateChallenge(input: CreateChallengeInput) {
  const errors: string[] = [];
  if (!input.mode.trim()) errors.push("El modo es obligatorio.");
  if (!input.availability.trim()) errors.push("Indica cuándo quieres jugar.");
  if (!Number.isFinite(input.rewardPoints) || input.rewardPoints < 10 || input.rewardPoints > 500) {
    errors.push("Los puntos deben estar entre 10 y 500.");
  }
  return errors;
}

export function buildChallenge(input: CreateChallengeInput, now = new Date()): Challenge {
  const errors = validateChallenge(input);
  if (errors.length) throw new Error(errors[0]);

  return {
    id: `challenge-${now.getTime()}`,
    ...input,
    mode: input.mode.trim(),
    availability: input.availability.trim(),
    creator: currentPlayer,
    status: "open",
    createdAt: now.toISOString(),
  };
}
