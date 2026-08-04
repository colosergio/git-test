import { Platform } from "react-native";

import type { ActivityItem, Challenge, CreateChallengeInput, Gamertags, Match, UserProfile } from "../types";

const defaultHost = Platform.OS === "android" ? "10.0.2.2" : "localhost";
export const apiBaseUrl = (process.env.EXPO_PUBLIC_API_URL ?? `http://${defaultHost}:3333/v1`).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    });
  } catch {
    throw new ApiError("No pudimos conectar con Arena. Verifica que la API esté ejecutándose.", 0);
  }
  const payload = (await response.json().catch(() => ({}))) as { message?: string };
  if (!response.ok) throw new ApiError(payload.message ?? "Ocurrió un error inesperado.", response.status);
  return payload as T;
}

export interface AuthResponse { token: string; user: UserProfile }

export const arenaApi = {
  register: (input: { email: string; password: string; displayName: string; handle: string }) => request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(input) }),
  login: (input: { email: string; password: string }) => request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(input) }),
  me: (token: string) => request<UserProfile>("/me", {}, token),
  updateProfile: (token: string, input: { displayName?: string; handle?: string; gamertags?: Gamertags }) => request<UserProfile>("/me", { method: "PATCH", body: JSON.stringify(input) }, token),
  challenges: (token: string) => request<Challenge[]>("/challenges", {}, token),
  createChallenge: (token: string, input: CreateChallengeInput) => request<Challenge>("/challenges", { method: "POST", body: JSON.stringify(input) }, token),
  acceptChallenge: (token: string, id: string) => request<{ challenge: Challenge; match: Match }>(`/challenges/${id}/accept`, { method: "POST" }, token),
  matches: (token: string) => request<Match[]>("/matches", {}, token),
  reportResult: (token: string, id: string, input: { ownScore: number; opponentScore: number }) => request<Match>(`/matches/${id}/report-result`, { method: "POST", body: JSON.stringify(input) }, token),
  activity: (token: string) => request<ActivityItem[]>("/activity", {}, token),
};
