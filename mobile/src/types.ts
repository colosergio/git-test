export type RootTab = "home" | "challenges" | "ranking" | "activity";

export type GameId = "fc26" | "nba2k26" | "rocket-league";
export type PlatformId = "ps5" | "xbox" | "pc" | "crossplay";
export type ChallengeStatus = "open" | "accepted" | "completed" | "cancelled";

export interface Player {
  name: string;
  handle: string;
  initials: string;
  level: number;
  rating: number;
}

export interface Challenge {
  id: string;
  gameId: GameId;
  platformId: PlatformId;
  mode: string;
  rewardPoints: number;
  availability: string;
  creator: Player;
  status: ChallengeStatus;
  createdAt: string;
}

export interface CreateChallengeInput {
  gameId: GameId;
  platformId: PlatformId;
  mode: string;
  rewardPoints: number;
  availability: string;
}

export interface ActivityItem {
  id: string;
  type: "accepted" | "created" | "win" | "loss";
  title: string;
  detail: string;
  occurredAt: string;
}

export interface ArenaData {
  challenges: Challenge[];
  activity: ActivityItem[];
}
