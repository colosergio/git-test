import type { ArenaData, Challenge, Player } from "../types";

export const currentPlayer: Player = {
  name: "Leo Méndez",
  handle: "@leo10",
  initials: "LM",
  level: 34,
  rating: 4.9,
};

export const seedChallenges: Challenge[] = [
  {
    id: "challenge-1",
    gameId: "fc26",
    platformId: "ps5",
    mode: "1 vs 1",
    rewardPoints: 50,
    availability: "Disponible ahora",
    creator: { name: "Nico Rojas", handle: "@nr7", initials: "NR", level: 42, rating: 4.9 },
    status: "open",
    createdAt: "2026-08-04T12:20:00.000Z",
  },
  {
    id: "challenge-2",
    gameId: "nba2k26",
    platformId: "ps5",
    mode: "1 vs 1",
    rewardPoints: 80,
    availability: "En 10 minutos",
    creator: { name: "Maya Torres", handle: "@mayat", initials: "MT", level: 37, rating: 4.8 },
    status: "open",
    createdAt: "2026-08-04T12:10:00.000Z",
  },
  {
    id: "challenge-3",
    gameId: "rocket-league",
    platformId: "crossplay",
    mode: "2 vs 2",
    rewardPoints: 40,
    availability: "Disponible ahora",
    creator: { name: "Fede Silva", handle: "@fedex", initials: "FS", level: 51, rating: 5 },
    status: "open",
    createdAt: "2026-08-04T11:55:00.000Z",
  },
  {
    id: "challenge-4",
    gameId: "fc26",
    platformId: "xbox",
    mode: "1 vs 1",
    rewardPoints: 30,
    availability: "En 15 minutos",
    creator: { name: "Sofi Díaz", handle: "@sofid", initials: "SD", level: 31, rating: 4.7 },
    status: "open",
    createdAt: "2026-08-04T11:40:00.000Z",
  },
];

export const initialData: ArenaData = {
  challenges: seedChallenges,
  activity: [
    { id: "activity-1", type: "win", title: "Victoria contra @juampi9", detail: "FC 26 · 3 — 1", occurredAt: "Hoy, 18:42" },
    { id: "activity-2", type: "win", title: "Victoria contra @celes", detail: "Rocket League · 5 — 3", occurredAt: "Ayer, 22:10" },
    { id: "activity-3", type: "loss", title: "Derrota contra @max23", detail: "NBA 2K26 · 71 — 78", occurredAt: "2 ago, 20:05" },
  ],
};

export const leaderboard = [
  { ...currentPlayer, name: "Lautaro King", handle: "@lautiking", initials: "LK", wins: 148, rating: 5 },
  { name: "Maya Torres", handle: "@mayat", initials: "MT", level: 37, wins: 136, rating: 4.9 },
  { name: "Fede Silva", handle: "@fedex", initials: "FS", level: 51, wins: 129, rating: 5 },
  { name: "Nico Rojas", handle: "@nr7", initials: "NR", level: 42, wins: 121, rating: 4.9 },
  { ...currentPlayer, wins: 116 },
];
