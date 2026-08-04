import AsyncStorage from "@react-native-async-storage/async-storage";

import type { ArenaData } from "../types";

const STORAGE_KEY = "@arena/mvp-data-v1";

export async function loadArenaData(): Promise<ArenaData | null> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as ArenaData) : null;
  } catch {
    return null;
  }
}

export async function saveArenaData(data: ArenaData) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
