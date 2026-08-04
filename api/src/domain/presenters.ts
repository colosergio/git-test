import type { ArenaState, ChallengeRecord, ChallengeResponse, MatchRecord, MatchResponse, PublicProfile, User } from "./types.ts";

export function initialsFor(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function publicProfile(user: User, includeGamertags = false): PublicProfile {
  return {
    id: user.id,
    name: user.displayName,
    handle: user.handle,
    initials: initialsFor(user.displayName),
    level: user.level,
    rating: user.rating,
    ...(includeGamertags ? { gamertags: user.gamertags } : {}),
  };
}

export function challengeResponse(state: ArenaState, challenge: ChallengeRecord): ChallengeResponse {
  const creator = state.users.find((user) => user.id === challenge.creatorId);
  if (!creator) throw new Error(`Challenge ${challenge.id} has no creator`);
  const { creatorId: _creatorId, ...rest } = challenge;
  return { ...rest, creator: publicProfile(creator) };
}

export function matchResponse(state: ArenaState, match: MatchRecord, currentUserId: string): MatchResponse {
  const playerOne = state.users.find((user) => user.id === match.playerOneId);
  const playerTwo = state.users.find((user) => user.id === match.playerTwoId);
  if (!playerOne || !playerTwo) throw new Error(`Match ${match.id} has an invalid participant`);
  const { playerOneId: _playerOneId, playerTwoId: _playerTwoId, reports, ...rest } = match;
  return {
    ...rest,
    playerOne: publicProfile(playerOne),
    playerTwo: publicProfile(playerTwo),
    currentUserReported: reports.some((report) => report.userId === currentUserId),
  };
}
