export const challenges = [
  { id: 1, game: "EA SPORTS FC 26", player: "Nico Rojas", handle: "@nr7", initials: "NR", level: 42, rating: 4.9, mode: "1 vs 1", platform: "PS5", points: 50, time: "Ahora", banner: "linear-gradient(135deg,#184264,#249e81)", avatar: "linear-gradient(135deg,#23668c,#31b8aa)" },
  { id: 2, game: "NBA 2K26", player: "Maya Torres", handle: "@mayat", initials: "MT", level: 37, rating: 4.8, mode: "1 vs 1", platform: "PS5", points: 80, time: "En 10 min", banner: "linear-gradient(135deg,#683424,#d36f32)", avatar: "linear-gradient(135deg,#a44963,#f2826a)" },
  { id: 3, game: "Rocket League", player: "Fede Silva", handle: "@fedex", initials: "FS", level: 51, rating: 5.0, mode: "2 vs 2", platform: "Crossplay", points: 40, time: "Ahora", banner: "linear-gradient(135deg,#323c83,#8b4aca)", avatar: "linear-gradient(135deg,#593c9b,#9e6de7)" },
  { id: 4, game: "EA SPORTS FC 26", player: "Sofi Díaz", handle: "@sofid", initials: "SD", level: 31, rating: 4.7, mode: "1 vs 1", platform: "Xbox", points: 30, time: "En 15 min", banner: "linear-gradient(135deg,#15504e,#25a786)", avatar: "linear-gradient(135deg,#4167a4,#5c9ddb)" },
  { id: 5, game: "NBA 2K26", player: "Tomás Rey", handle: "@tomasrey", initials: "TR", level: 45, rating: 4.9, mode: "1 vs 1", platform: "PS5", points: 100, time: "Ahora", banner: "linear-gradient(135deg,#713d26,#c47d36)", avatar: "linear-gradient(135deg,#7b493f,#c57a66)" },
  { id: 6, game: "Rocket League", player: "Ana Vega", handle: "@anav", initials: "AV", level: 39, rating: 4.8, mode: "2 vs 2", platform: "PC", points: 60, time: "En 5 min", banner: "linear-gradient(135deg,#27397e,#7448b8)", avatar: "linear-gradient(135deg,#804c99,#da6db3)" }
];

export const leaderboard = [
  { name: "Lautaro King", handle: "@lautiking", initials: "LK", wins: 148, rating: 5.0, avatar: "linear-gradient(135deg,#8b5d2c,#ecaf55)" },
  { name: "Maya Torres", handle: "@mayat", initials: "MT", wins: 136, rating: 4.9, avatar: "linear-gradient(135deg,#a44963,#f2826a)" },
  { name: "Fede Silva", handle: "@fedex", initials: "FS", wins: 129, rating: 5.0, avatar: "linear-gradient(135deg,#593c9b,#9e6de7)" },
  { name: "Nico Rojas", handle: "@nr7", initials: "NR", wins: 121, rating: 4.9, avatar: "linear-gradient(135deg,#23668c,#31b8aa)" },
  { name: "Leo Méndez", handle: "@leo10", initials: "LM", wins: 116, rating: 4.9, avatar: "linear-gradient(135deg,#513ca8,#825cff)" }
];

export const activity = [
  { result: "Victoria", game: "EA SPORTS FC 26", opponent: "@juampi9", date: "Hoy, 18:42", mode: "1 vs 1", score: "3 — 1" },
  { result: "Victoria", game: "Rocket League", opponent: "@celes", date: "Ayer, 22:10", mode: "2 vs 2", score: "5 — 3" },
  { result: "Derrota", game: "NBA 2K26", opponent: "@max23", date: "2 ago, 20:05", mode: "1 vs 1", score: "71 — 78" },
  { result: "Victoria", game: "EA SPORTS FC 26", opponent: "@mati10", date: "1 ago, 19:31", mode: "1 vs 1", score: "2 — 0" }
];

export function filterChallenges(items, game = "Todos", query = "") {
  const normalizedQuery = query.trim().toLocaleLowerCase("es");
  return items.filter(item => {
    const matchesGame = game === "Todos" || item.game === game;
    const searchable = `${item.game} ${item.player} ${item.handle} ${item.platform}`.toLocaleLowerCase("es");
    return matchesGame && (!normalizedQuery || searchable.includes(normalizedQuery));
  });
}

export function createChallenge(formData) {
  return {
    id: Date.now(), game: formData.game, player: "Leo Méndez", handle: "@leo10", initials: "LM",
    level: 34, rating: 4.9, mode: formData.mode, platform: formData.platform,
    points: Number(formData.points), time: formData.time,
    banner: "linear-gradient(135deg,#403681,#855cec)", avatar: "linear-gradient(135deg,#513ca8,#825cff)"
  };
}
