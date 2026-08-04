import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import { games } from "../data/catalog";
import { initialData } from "../data/seed";
import { buildChallenge } from "../domain/challenges";
import { loadArenaData, saveArenaData } from "../storage/arenaStorage";
import type { ActivityItem, ArenaData, CreateChallengeInput } from "../types";

interface ChallengeContextValue extends ArenaData {
  hydrated: boolean;
  createChallenge: (input: CreateChallengeInput) => void;
  acceptChallenge: (challengeId: string) => void;
}

const ChallengeContext = createContext<ChallengeContextValue | null>(null);

export function ChallengeProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<ArenaData>(initialData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    loadArenaData().then((stored) => {
      if (!active) return;
      if (stored) setData(stored);
      setHydrated(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    void saveArenaData(data);
  }, [data, hydrated]);

  const value = useMemo<ChallengeContextValue>(
    () => ({
      ...data,
      hydrated,
      createChallenge: (input) => {
        const challenge = buildChallenge(input);
        const activity: ActivityItem = {
          id: `activity-${Date.now()}`,
          type: "created",
          title: `Creaste un reto de ${games[challenge.gameId].shortName}`,
          detail: `${challenge.mode} · ${challenge.rewardPoints} puntos`,
          occurredAt: "Ahora",
        };
        setData((current) => ({
          challenges: [challenge, ...current.challenges],
          activity: [activity, ...current.activity],
        }));
      },
      acceptChallenge: (challengeId) => {
        setData((current) => {
          const challenge = current.challenges.find((item) => item.id === challengeId);
          if (!challenge || challenge.status !== "open") return current;
          const activity: ActivityItem = {
            id: `activity-${Date.now()}`,
            type: "accepted",
            title: `Aceptaste el reto de ${challenge.creator.handle}`,
            detail: `${games[challenge.gameId].shortName} · ${challenge.rewardPoints} puntos`,
            occurredAt: "Ahora",
          };
          return {
            challenges: current.challenges.map((item) =>
              item.id === challengeId ? { ...item, status: "accepted" as const } : item,
            ),
            activity: [activity, ...current.activity],
          };
        });
      },
    }),
    [data, hydrated],
  );

  return <ChallengeContext.Provider value={value}>{children}</ChallengeContext.Provider>;
}

export function useChallenges() {
  const context = useContext(ChallengeContext);
  if (!context) throw new Error("useChallenges debe utilizarse dentro de ChallengeProvider");
  return context;
}
