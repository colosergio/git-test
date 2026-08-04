import { Ionicons } from "@expo/vector-icons";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";

import { games, platforms } from "../data/catalog";
import { colors, radius, spacing } from "../theme";
import type { Challenge } from "../types";
import { useAuth } from "../context/AuthContext";

interface ChallengeCardProps {
  challenge: Challenge;
  onAccept: (id: string) => Promise<void>;
  compact?: boolean;
}

export function ChallengeCard({ challenge, onAccept, compact = false }: ChallengeCardProps) {
  const { user } = useAuth();
  const [accepting, setAccepting] = useState(false);
  const game = games[challenge.gameId];
  const accepted = challenge.status === "accepted";
  const ownChallenge = challenge.creator.id === user?.id;

  const accept = async () => {
    setAccepting(true);
    try { await onAccept(challenge.id); } catch (error) { Alert.alert("No pudimos aceptar el reto", error instanceof Error ? error.message : "Intenta nuevamente."); } finally { setAccepting(false); }
  };

  return (
    <View style={[styles.card, compact && styles.compactCard]}>
      <View style={[styles.gameBand, { backgroundColor: game.color }]}>
        <Ionicons name={game.icon as keyof typeof Ionicons.glyphMap} size={22} color={colors.white} />
        <Text style={styles.gameName}>{game.name}</Text>
        <Text style={styles.points}>{challenge.rewardPoints} PTS</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.playerRow}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{challenge.creator.initials}</Text></View>
          <View style={styles.playerCopy}>
            <Text style={styles.playerName}>{challenge.creator.name}</Text>
            <Text style={styles.handle}>{challenge.creator.handle} · Nivel {challenge.creator.level}</Text>
          </View>
          <View style={styles.rating}><Ionicons name="star" size={13} color={colors.orange} /><Text style={styles.ratingText}>{challenge.creator.rating.toFixed(1)}</Text></View>
        </View>
        <View style={styles.metaRow}>
          <Meta label="MODO" value={challenge.mode} />
          <Meta label="PLATAFORMA" value={platforms[challenge.platformId]} />
        </View>
        <TouchableOpacity
          style={[styles.button, accepted && styles.acceptedButton]}
          disabled={accepted || ownChallenge || accepting}
          onPress={accept}
          accessibilityRole="button"
          accessibilityLabel={accepted ? "Reto aceptado" : `Aceptar reto de ${challenge.creator.name}`}
        >
          <Text style={[styles.buttonText, accepted && styles.acceptedButtonText]}>{ownChallenge ? "Tu reto publicado" : accepting ? "Aceptando…" : accepted ? "Reto aceptado" : challenge.availability}</Text>
          <Ionicons name={ownChallenge ? "person-circle-outline" : accepted ? "checkmark-circle" : "arrow-forward"} size={18} color={accepted ? colors.green : colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return <View style={styles.meta}><Text style={styles.metaLabel}>{label}</Text><Text style={styles.metaValue} numberOfLines={1}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: "hidden", marginBottom: spacing.md },
  compactCard: { width: 312, marginRight: spacing.md },
  gameBand: { minHeight: 58, paddingHorizontal: spacing.lg, flexDirection: "row", alignItems: "center", gap: spacing.sm },
  gameName: { flex: 1, color: colors.white, fontSize: 14, fontWeight: "800" },
  points: { color: colors.white, fontSize: 12, fontWeight: "900", backgroundColor: "rgba(0,0,0,0.2)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill },
  body: { padding: spacing.lg },
  playerRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 40, height: 40, borderRadius: radius.pill, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center", marginRight: spacing.sm },
  avatarText: { color: colors.text, fontWeight: "900", fontSize: 12 },
  playerCopy: { flex: 1 },
  playerName: { color: colors.text, fontSize: 14, fontWeight: "800" },
  handle: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  rating: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { color: colors.text, fontWeight: "700", fontSize: 12 },
  metaRow: { flexDirection: "row", gap: spacing.lg, marginVertical: spacing.lg },
  meta: { flex: 1 },
  metaLabel: { color: colors.textMuted, fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  metaValue: { color: colors.text, fontSize: 13, fontWeight: "700", marginTop: 4 },
  button: { height: 44, paddingHorizontal: spacing.lg, borderRadius: radius.md, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  acceptedButton: { backgroundColor: "rgba(67, 212, 158, 0.1)", borderWidth: 1, borderColor: "rgba(67, 212, 158, 0.35)" },
  buttonText: { color: colors.white, fontSize: 13, fontWeight: "800" },
  acceptedButtonText: { color: colors.green },
});
