import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import { ApiError, arenaApi } from "../api/client";
import { profileStorage, tokenStorage } from "../storage/tokenStorage";
import type { Gamertags, UserProfile } from "../types";

interface AuthContextValue {
  loading: boolean;
  token: string | null;
  user: UserProfile | null;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: { email: string; password: string; displayName: string; handle: string }) => Promise<void>;
  updateProfile: (input: { displayName?: string; handle?: string; gamertags?: Gamertags }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([tokenStorage.get(), profileStorage.get()]).then(async ([storedToken, cachedProfile]) => {
      if (!active) return;
      if (!storedToken) {
        setLoading(false);
        return;
      }
      setToken(storedToken);
      if (cachedProfile) setUser(cachedProfile);
      try {
        const profile = await arenaApi.me(storedToken);
        if (active) {
          setUser(profile);
          await profileStorage.set(profile);
        }
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          await Promise.all([tokenStorage.remove(), profileStorage.remove()]);
          if (active) { setToken(null); setUser(null); }
        }
      } finally {
        if (active) setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  const establishSession = async (response: Awaited<ReturnType<typeof arenaApi.login>>) => {
    await Promise.all([tokenStorage.set(response.token), profileStorage.set(response.user)]);
    setToken(response.token);
    setUser(response.user);
  };

  const value = useMemo<AuthContextValue>(() => ({
    loading,
    token,
    user,
    login: async (input) => establishSession(await arenaApi.login(input)),
    register: async (input) => establishSession(await arenaApi.register(input)),
    updateProfile: async (input) => {
      if (!token) throw new Error("La sesión no está disponible.");
      const profile = await arenaApi.updateProfile(token, input);
      await profileStorage.set(profile);
      setUser(profile);
    },
    logout: async () => {
      await Promise.all([tokenStorage.remove(), profileStorage.remove()]);
      setToken(null);
      setUser(null);
    },
  }), [loading, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  return context;
}
