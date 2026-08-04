import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import { initialData } from "../data/seed";
import { arenaApi } from "../api/client";
import { loadArenaData, saveArenaData } from "../storage/arenaStorage";
import type { ArenaData, CreateChallengeInput, Match } from "../types";
import { useAuth } from "./AuthContext";

interface ChallengeContextValue extends ArenaData {
  hydrated: boolean;
  refreshing: boolean;
  syncError: string | null;
  refresh: () => Promise<void>;
  createChallenge: (input: CreateChallengeInput) => Promise<void>;
  acceptChallenge: (challengeId: string) => Promise<void>;
  reportResult: (matchId: string, ownScore: number, opponentScore: number) => Promise<Match>;
}

const ChallengeContext = createContext<ChallengeContextValue | null>(null);

export function ChallengeProvider({ children }: PropsWithChildren) {
  const { token } = useAuth();
  const [data, setData] = useState<ArenaData>(initialData);
  const [hydrated, setHydrated] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!token) return;
    setRefreshing(true);
    try {
      const [challenges, matches, activity] = await Promise.all([arenaApi.challenges(token), arenaApi.matches(token), arenaApi.activity(token)]);
      setData({ challenges, matches, activity });
      setSyncError(null);
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : "No pudimos sincronizar Arena.");
      throw error;
    } finally {
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    let active = true;
    loadArenaData().then(async (stored) => {
      if (!active) return;
      if (stored) setData({ ...stored, matches: stored.matches ?? [] });
      setHydrated(true);
      try { await refresh(); } catch { /* La caché mantiene la app utilizable. */ }
    });
    return () => {
      active = false;
    };
  }, [refresh]);

  useEffect(() => {
    if (!hydrated) return;
    void saveArenaData(data);
  }, [data, hydrated]);

  const value = useMemo<ChallengeContextValue>(
    () => ({
      ...data,
      hydrated,
      refreshing,
      syncError,
      refresh,
      createChallenge: async (input) => {
        if (!token) throw new Error("Inicia sesión para crear un reto.");
        await arenaApi.createChallenge(token, input);
        await refresh();
      },
      acceptChallenge: async (challengeId) => {
        if (!token) throw new Error("Inicia sesión para aceptar un reto.");
        await arenaApi.acceptChallenge(token, challengeId);
        await refresh();
      },
      reportResult: async (matchId, ownScore, opponentScore) => {
        if (!token) throw new Error("Inicia sesión para reportar un resultado.");
        const match = await arenaApi.reportResult(token, matchId, { ownScore, opponentScore });
        await refresh();
        return match;
      },
    }),
    [data, hydrated, refresh, refreshing, syncError, token],
  );

  return <ChallengeContext.Provider value={value}>{children}</ChallengeContext.Provider>;
}

export function useChallenges() {
  const context = useContext(ChallengeContext);
  if (!context) throw new Error("useChallenges debe utilizarse dentro de ChallengeProvider");
  return context;
}
