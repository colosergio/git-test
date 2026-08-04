import { Ionicons } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { ScreenHeader } from "../components/ScreenHeader";
import { leaderboard } from "../data/seed";
import { colors, radius, spacing } from "../theme";

export function RankingScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader eyebrow="TEMPORADA 01" title="Ranking Arena" />
      <Text style={styles.subtitle}>Los competidores con mejor rendimiento.</Text>
      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.handle}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <View style={[styles.row, index < 3 && styles.topRow]}>
            <Text style={[styles.position, index === 0 && styles.first]}>#{index + 1}</Text>
            <View style={styles.avatar}><Text style={styles.initials}>{item.initials}</Text></View>
            <View style={styles.player}><Text style={styles.name}>{item.name}</Text><Text style={styles.handle}>{item.handle} · Nivel {item.level}</Text></View>
            <View style={styles.metric}><Text style={styles.wins}>{item.wins}</Text><Text style={styles.metricLabel}>VICTORIAS</Text></View>
            <View style={styles.rating}><Ionicons name="star" size={13} color={colors.orange} /><Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text></View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  subtitle: { color: colors.textMuted, fontSize: 13, paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.sm },
  row: { minHeight: 76, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: "row", alignItems: "center", gap: spacing.sm },
  topRow: { backgroundColor: colors.surfaceRaised },
  position: { width: 28, color: colors.textMuted, fontWeight: "900", fontSize: 13 },
  first: { color: colors.orange },
  avatar: { width: 40, height: 40, borderRadius: radius.pill, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" },
  initials: { color: colors.text, fontWeight: "900", fontSize: 12 },
  player: { flex: 1 },
  name: { color: colors.text, fontSize: 13, fontWeight: "800" },
  handle: { color: colors.textMuted, fontSize: 10, marginTop: 3 },
  metric: { alignItems: "flex-end" },
  wins: { color: colors.text, fontSize: 15, fontWeight: "900" },
  metricLabel: { color: colors.textMuted, fontSize: 7, fontWeight: "800", marginTop: 2 },
  rating: { flexDirection: "row", alignItems: "center", gap: 3, width: 38, justifyContent: "flex-end" },
  ratingText: { color: colors.text, fontSize: 11, fontWeight: "800" },
});
