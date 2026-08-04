import { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { CreateChallengeModal } from "./src/components/CreateChallengeModal";
import { TabBar } from "./src/components/TabBar";
import { ChallengeProvider } from "./src/context/ChallengeContext";
import { ActivityScreen } from "./src/screens/ActivityScreen";
import { ChallengesScreen } from "./src/screens/ChallengesScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { RankingScreen } from "./src/screens/RankingScreen";
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

export default function App() {
  return (
    <ChallengeProvider>
      <ArenaApp />
    </ChallengeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
});
