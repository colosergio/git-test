import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { CreateChallengeModal } from "./src/components/CreateChallengeModal";
import { TabBar } from "./src/components/TabBar";
import { ChallengeProvider } from "./src/context/ChallengeContext";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { ActivityScreen } from "./src/screens/ActivityScreen";
import { ChallengesScreen } from "./src/screens/ChallengesScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { RankingScreen } from "./src/screens/RankingScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { AuthScreen } from "./src/screens/AuthScreen";
import { LoadingScreen } from "./src/screens/LoadingScreen";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { colors } from "./src/theme";
import type { RootTab } from "./src/types";

function ArenaApp() {
  const [tab, setTab] = useState<RootTab>("home");
  const [creating, setCreating] = useState(false);

  const content = {
    home: <HomeScreen onCreate={() => setCreating(true)} onExplore={() => setTab("challenges")} />,
    challenges: <ChallengesScreen onCreate={() => setCreating(true)} />,
    ranking: <RankingScreen />,
    activity: <ActivityScreen />,
    profile: <ProfileScreen />,
  } satisfies Record<RootTab, React.ReactNode>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.content}>{content[tab]}</View>
      <TabBar activeTab={tab} onChange={setTab} />
      <CreateChallengeModal
        visible={creating}
        onClose={() => setCreating(false)}
        onCreated={() => {
          setCreating(false);
          setTab("challenges");
        }}
      />
    </SafeAreaView>
  );
}

const ONBOARDING_KEY = "@arena/onboarding-complete-v1";

function AppGate() {
  const { loading, user } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  useEffect(() => { AsyncStorage.getItem(ONBOARDING_KEY).then((value) => setOnboardingComplete(value === "true")); }, []);
  if (loading || onboardingComplete === null) return <LoadingScreen />;
  if (!onboardingComplete) return <OnboardingScreen onComplete={async () => { await AsyncStorage.setItem(ONBOARDING_KEY, "true"); setOnboardingComplete(true); }} />;
  if (!user) return <AuthScreen />;
  return (
    <ChallengeProvider>
      <ArenaApp />
    </ChallengeProvider>
  );
}

export default function App() {
  return <AuthProvider><AppGate /></AuthProvider>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
});
