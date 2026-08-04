import { Ionicons } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { ScreenHeader } from "../components/ScreenHeader";
import { useChallenges } from "../context/ChallengeContext";
import { colors, radius, spacing } from "../theme";
import type { ActivityItem } from "../types";

const activityStyle: Record<ActivityItem["type"], { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  accepted: { icon: "flash", color: colors.primary },
  created: { icon: "add-circle", color: colors.cyan },
  win: { icon: "trophy", color: colors.green },
  loss: { icon: "close-circle", color: colors.red },
};

export function ActivityScreen() {
  const { activity } = useChallenges();
  return (
    <View style={styles.container}>
      <ScreenHeader eyebrow="TU HISTORIAL" title="Actividad reciente" />
      <FlatList
        data={activity}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const visual = activityStyle[item.type];
          return <View style={styles.row}><View style={[styles.icon, { backgroundColor: `${visual.color}18` }]}><Ionicons name={visual.icon} size={20} color={visual.color} /></View><View style={styles.copy}><Text style={styles.title}>{item.title}</Text><Text style={styles.detail}>{item.detail}</Text></View><Text style={styles.time}>{item.occurredAt}</Text></View>;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg, gap: spacing.sm },
  row: { minHeight: 72, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", padding: spacing.md, gap: spacing.md },
  icon: { width: 42, height: 42, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  copy: { flex: 1 },
  title: { color: colors.text, fontSize: 13, fontWeight: "800" },
  detail: { color: colors.textMuted, fontSize: 11, marginTop: 4 },
  time: { color: colors.textMuted, fontSize: 9, maxWidth: 58, textAlign: "right" },
});
