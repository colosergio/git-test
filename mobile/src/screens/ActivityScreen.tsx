import { Ionicons } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";

import { ScreenHeader } from "../components/ScreenHeader";
import { ResultModal } from "../components/ResultModal";
import { useChallenges } from "../context/ChallengeContext";
import { useAuth } from "../context/AuthContext";
import { colors, radius, spacing } from "../theme";
import type { ActivityItem, Match } from "../types";

const activityStyle: Record<ActivityItem["type"], { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  welcome: { icon: "sparkles", color: colors.cyan },
  accepted: { icon: "flash", color: colors.primary },
  created: { icon: "add-circle", color: colors.cyan },
  reported: { icon: "checkmark-circle", color: colors.primary },
  win: { icon: "trophy", color: colors.green },
  loss: { icon: "close-circle", color: colors.red },
  draw: { icon: "remove-circle", color: colors.orange },
  disputed: { icon: "warning", color: colors.red },
};

export function ActivityScreen() {
  const { activity, matches } = useChallenges();
  const { user } = useAuth();
  const [reporting, setReporting] = useState<Match | null>(null);
  return (
    <View style={styles.container}>
      <ScreenHeader eyebrow="TU HISTORIAL" title="Actividad reciente" />
      <FlatList
        data={activity}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={matches.length ? <View><Text style={styles.sectionTitle}>PARTIDAS ACTIVAS</Text>{matches.map((match) => { const opponent = match.playerOne.id === user?.id ? match.playerTwo : match.playerOne; const canReport = !match.currentUserReported && match.status !== "completed" && match.status !== "disputed"; return <View key={match.id} style={styles.match}><View style={styles.matchIcon}><Ionicons name="game-controller" size={21} color={colors.primary} /></View><View style={styles.copy}><Text style={styles.title}>Contra {opponent.handle}</Text><Text style={styles.detail}>{match.status === "completed" ? `Finalizado · ${match.result?.playerOneScore} — ${match.result?.playerTwoScore}` : match.status === "disputed" ? "Resultado en revisión" : match.currentUserReported ? "Esperando a tu rival" : "Resultado pendiente"}</Text></View>{canReport ? <TouchableOpacity style={styles.report} onPress={() => setReporting(match)}><Text style={styles.reportText}>Reportar</Text></TouchableOpacity> : <Ionicons name={match.status === "completed" ? "checkmark-circle" : match.status === "disputed" ? "warning" : "time"} size={21} color={match.status === "completed" ? colors.green : match.status === "disputed" ? colors.red : colors.orange} />}</View>; })}<Text style={styles.sectionTitle}>MOVIMIENTOS</Text></View> : null}
        renderItem={({ item }) => {
          const visual = activityStyle[item.type];
          return <View style={styles.row}><View style={[styles.icon, { backgroundColor: `${visual.color}18` }]}><Ionicons name={visual.icon} size={20} color={visual.color} /></View><View style={styles.copy}><Text style={styles.title}>{item.title}</Text><Text style={styles.detail}>{item.detail}</Text></View><Text style={styles.time}>{formatActivityTime(item.occurredAt)}</Text></View>;
        }}
      />
      <ResultModal match={reporting} onClose={() => setReporting(null)} />
    </View>
  );
}

function formatActivityTime(value: string) {
  if (!value.includes("T")) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(date);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg, gap: spacing.sm },
  sectionTitle: { color: colors.textMuted, fontSize: 10, fontWeight: "900", letterSpacing: 1.3, marginTop: spacing.sm, marginBottom: spacing.md },
  match: { minHeight: 72, borderRadius: radius.md, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.primarySoft, flexDirection: "row", alignItems: "center", padding: spacing.md, gap: spacing.md, marginBottom: spacing.sm },
  matchIcon: { width: 42, height: 42, borderRadius: radius.md, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" },
  report: { paddingHorizontal: spacing.md, height: 34, borderRadius: radius.sm, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }, reportText: { color: colors.white, fontSize: 11, fontWeight: "900" },
  row: { minHeight: 72, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", padding: spacing.md, gap: spacing.md },
  icon: { width: 42, height: 42, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  copy: { flex: 1 },
  title: { color: colors.text, fontSize: 13, fontWeight: "800" },
  detail: { color: colors.textMuted, fontSize: 11, marginTop: 4 },
  time: { color: colors.textMuted, fontSize: 9, maxWidth: 58, textAlign: "right" },
});
