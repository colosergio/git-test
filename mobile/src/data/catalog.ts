import type { GameId, PlatformId } from "../types";

export const games: Record<GameId, { name: string; shortName: string; icon: string; color: string }> = {
  fc26: { name: "EA SPORTS FC 26", shortName: "FC 26", icon: "football", color: "#2BBF9B" },
  nba2k26: { name: "NBA 2K26", shortName: "NBA 2K", icon: "basketball", color: "#F27A43" },
  "rocket-league": { name: "Rocket League", shortName: "Rocket", icon: "rocket", color: "#6B7CFF" },
};

export const platforms: Record<PlatformId, string> = {
  ps5: "PlayStation 5",
  xbox: "Xbox Series",
  pc: "PC",
  crossplay: "Crossplay",
};

export const gameOptions = Object.entries(games) as [GameId, (typeof games)[GameId]][];
export const platformOptions = Object.entries(platforms) as [PlatformId, string][];
