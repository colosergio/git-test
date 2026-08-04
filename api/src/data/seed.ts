import type { ArenaState, ChallengeRecord, User } from "../domain/types.ts";

const createdAt = "2026-08-04T12:00:00.000Z";

const botUsers: User[] = [
  { id: "bot-nico", email: "nico@arena.local", passwordHash: "!", displayName: "Nico Rojas", handle: "@nr7", level: 42, rating: 4.9, gamertags: { psn: "NicoR7" }, createdAt },
  { id: "bot-maya", email: "maya@arena.local", passwordHash: "!", displayName: "Maya Torres", handle: "@mayat", level: 37, rating: 4.8, gamertags: { psn: "MayaBuckets" }, createdAt },
  { id: "bot-fede", email: "fede@arena.local", passwordHash: "!", displayName: "Fede Silva", handle: "@fedex", level: 51, rating: 5, gamertags: { ea: "FedexRL" }, createdAt },
  { id: "bot-sofi", email: "sofi@arena.local", passwordHash: "!", displayName: "Sofi Díaz", handle: "@sofid", level: 31, rating: 4.7, gamertags: { xbox: "SofiD" }, createdAt },
];

const seedChallenges: ChallengeRecord[] = [
  { id: "challenge-1", creatorId: "bot-nico", gameId: "fc26", platformId: "ps5", mode: "1 vs 1", rewardPoints: 50, availability: "Disponible ahora", status: "open", createdAt: "2026-08-04T12:20:00.000Z" },
  { id: "challenge-2", creatorId: "bot-maya", gameId: "nba2k26", platformId: "ps5", mode: "1 vs 1", rewardPoints: 80, availability: "En 10 minutos", status: "open", createdAt: "2026-08-04T12:10:00.000Z" },
  { id: "challenge-3", creatorId: "bot-fede", gameId: "rocket-league", platformId: "crossplay", mode: "2 vs 2", rewardPoints: 40, availability: "Disponible ahora", status: "open", createdAt: "2026-08-04T11:55:00.000Z" },
  { id: "challenge-4", creatorId: "bot-sofi", gameId: "fc26", platformId: "xbox", mode: "1 vs 1", rewardPoints: 30, availability: "En 15 minutos", status: "open", createdAt: "2026-08-04T11:40:00.000Z" },
];

export function createInitialState(): ArenaState {
  return { users: structuredClone(botUsers), challenges: structuredClone(seedChallenges), matches: [], activity: [] };
}
