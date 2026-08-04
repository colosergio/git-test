export type RootTab = "home" | "challenges" | "ranking" | "activity" | "profile";

export type GameId = "fc26" | "nba2k26" | "rocket-league";
export type PlatformId = "ps5" | "xbox" | "pc" | "crossplay";
export type ChallengeStatus = "open" | "accepted" | "completed" | "cancelled";

export interface Player {
  id: string;
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
  acceptedBy?: string;
  matchId?: string;
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
  type: "welcome" | "accepted" | "created" | "reported" | "win" | "loss" | "draw" | "disputed";
  title: string;
  detail: string;
  occurredAt: string;
}

export interface ArenaData {
  challenges: Challenge[];
  matches: Match[];
  activity: ActivityItem[];
}

export interface Gamertags {
  psn?: string;
  xbox?: string;
  ea?: string;
}

export interface UserProfile extends Player {
  email: string;
  displayName: string;
  gamertags: Gamertags;
}

export type MatchStatus = "awaiting_results" | "awaiting_opponent" | "completed" | "disputed";

export interface MatchResult {
  playerOneScore: number;
  playerTwoScore: number;
  winnerId?: string;
  completedAt: string;
}

export interface Match {
  id: string;
  challengeId: string;
  playerOne: Player;
  playerTwo: Player;
  status: MatchStatus;
  currentUserReported: boolean;
  result?: MatchResult;
  createdAt: string;
  updatedAt: string;
}
