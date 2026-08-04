export type GameId = "fc26" | "nba2k26" | "rocket-league";
export type PlatformId = "ps5" | "xbox" | "pc" | "crossplay";
export type ChallengeStatus = "open" | "accepted" | "completed" | "cancelled";
export type MatchStatus = "awaiting_results" | "awaiting_opponent" | "completed" | "disputed";

export interface Gamertags {
  psn?: string;
  xbox?: string;
  ea?: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  handle: string;
  level: number;
  rating: number;
  gamertags: Gamertags;
  createdAt: string;
}

export interface PublicProfile {
  id: string;
  name: string;
  handle: string;
  initials: string;
  level: number;
  rating: number;
  gamertags?: Gamertags;
}

export interface ChallengeRecord {
  id: string;
  creatorId: string;
  acceptedBy?: string;
  matchId?: string;
  gameId: GameId;
  platformId: PlatformId;
  mode: string;
  rewardPoints: number;
  availability: string;
  status: ChallengeStatus;
  createdAt: string;
}

export interface ResultReport {
  userId: string;
  ownScore: number;
  opponentScore: number;
  reportedAt: string;
}

export interface MatchResult {
  playerOneScore: number;
  playerTwoScore: number;
  winnerId?: string;
  completedAt: string;
}

export interface MatchRecord {
  id: string;
  challengeId: string;
  playerOneId: string;
  playerTwoId: string;
  status: MatchStatus;
  reports: ResultReport[];
  result?: MatchResult;
  createdAt: string;
  updatedAt: string;
}

export type ActivityType = "welcome" | "created" | "accepted" | "reported" | "win" | "loss" | "draw" | "disputed";

export interface ActivityRecord {
  id: string;
  userId: string;
  type: ActivityType;
  title: string;
  detail: string;
  occurredAt: string;
}

export interface ArenaState {
  users: User[];
  challenges: ChallengeRecord[];
  matches: MatchRecord[];
  activity: ActivityRecord[];
}

export interface ChallengeResponse extends Omit<ChallengeRecord, "creatorId"> {
  creator: PublicProfile;
}

export interface MatchResponse extends Omit<MatchRecord, "playerOneId" | "playerTwoId" | "reports"> {
  playerOne: PublicProfile;
  playerTwo: PublicProfile;
  currentUserReported: boolean;
}
