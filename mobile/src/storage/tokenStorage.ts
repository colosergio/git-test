import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { UserProfile } from "../types";

const TOKEN_KEY = "arena-access-token";
const PROFILE_KEY = "@arena/profile-cache-v1";

export const tokenStorage = {
  get: () => Platform.OS === "web" ? AsyncStorage.getItem(TOKEN_KEY) : SecureStore.getItemAsync(TOKEN_KEY),
  set: (token: string) => Platform.OS === "web" ? AsyncStorage.setItem(TOKEN_KEY, token) : SecureStore.setItemAsync(TOKEN_KEY, token, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY }),
  remove: () => Platform.OS === "web" ? AsyncStorage.removeItem(TOKEN_KEY) : SecureStore.deleteItemAsync(TOKEN_KEY),
};

export const profileStorage = {
  async get() {
    const value = await AsyncStorage.getItem(PROFILE_KEY);
    return value ? JSON.parse(value) as UserProfile : null;
  },
  set: (profile: UserProfile) => AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile)),
  remove: () => AsyncStorage.removeItem(PROFILE_KEY),
};
