import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ChallengeCard } from "../components/ChallengeCard";
import { ScreenHeader } from "../components/ScreenHeader";
import { useChallenges } from "../context/ChallengeContext";
import { colors, radius, spacing } from "../theme";

interface HomeScreenProps {
  onCreate: () => void;
  onExplore: () => void;
}

export function HomeScreen({ onCreate, onExplore }: HomeScreenProps) {
  const { challenges, acceptChallenge } = useChallenges();
  const openChallenges = challenges.filter((challenge) => challenge.status === "open");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ScreenHeader eyebrow="ARENA BETA" title="Hola, Leo" showProfile />
      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>COMPITE · DEMUESTRA · SUBE</Text>
        <Text style={styles.heroTitle}>Tu próximo rival ya está esperando.</Text>
        <Text style={styles.heroText}>Crea retos, compite y construye tu reputación.</Text>
        <View style={styles.heroActions}>
          <TouchableOpacity style={styles.primaryButton} onPress={onCreate}><Ionicons name="add" size={20} color={colors.white} /><Text style={styles.primaryText}>Crear reto</Text></TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={onExplore}><Text style={styles.secondaryText}>Explorar</Text></TouchableOpacity>
        </View>
        <View style={styles.heroOrb} />
      </View>

      <View style={styles.stats}>
        <Stat icon="flame" color={colors.orange} label="Racha" value="4 victorias" />
        <Stat icon="star" color={colors.cyan} label="Reputación" value="4.9" />
        <Stat icon="trophy" color={colors.primary} label="Ranking" value="#1,284" />
      </View>

      <View style={styles.heading}><View><Text style={styles.sectionEyebrow}>MATCHMAKING</Text><Text style={styles.sectionTitle}>Retos destacados</Text></View><TouchableOpacity onPress={onExplore}><Text style={styles.link}>Ver todos</Text></TouchableOpacity></View>
      {openChallenges.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {openChallenges.slice(0, 3).map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} onAccept={acceptChallenge} compact />)}
        </ScrollView>
      ) : <Text style={styles.empty}>No hay retos abiertos por el momento.</Text>}
    </ScrollView>
  );
}

function Stat({ icon, color, label, value }: { icon: keyof typeof Ionicons.glyphMap; color: string; label: string; value: string }) {
  return <View style={styles.stat}><View style={[styles.statIcon, { backgroundColor: `${color}20` }]}><Ionicons name={icon} size={18} color={color} /></View><Text style={styles.statLabel}>{label}</Text><Text style={styles.statValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xl },
  hero: { margin: spacing.lg, padding: spacing.xl, minHeight: 250, borderRadius: radius.lg, backgroundColor: "#322468", overflow: "hidden", justifyContent: "center" },
  heroEyebrow: { color: colors.cyan, fontSize: 10, fontWeight: "900", letterSpacing: 1.5, zIndex: 1 },
  heroTitle: { color: colors.white, fontSize: 31, lineHeight: 35, fontWeight: "900", letterSpacing: -1, maxWidth: 310, marginTop: spacing.sm, zIndex: 1 },
  heroText: { color: "#D1C9F1", fontSize: 14, lineHeight: 20, maxWidth: 270, marginTop: spacing.sm, zIndex: 1 },
  heroActions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xl, zIndex: 1 },
  primaryButton: { height: 46, paddingHorizontal: spacing.lg, borderRadius: radius.md, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", gap: 5 },
  primaryText: { color: colors.white, fontWeight: "900", fontSize: 13 },
  secondaryButton: { height: 46, paddingHorizontal: spacing.lg, borderRadius: radius.md, backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  secondaryText: { color: colors.white, fontWeight: "800", fontSize: 13 },
  heroOrb: { position: "absolute", width: 210, height: 210, borderRadius: 105, backgroundColor: "rgba(49,199,197,0.2)", right: -80, top: -50 },
  stats: { flexDirection: "row", gap: spacing.sm, paddingHorizontal: spacing.lg, marginBottom: spacing.xl },
  stat: { flex: 1, minHeight: 112, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  statIcon: { width: 32, height: 32, borderRadius: radius.sm, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  statLabel: { color: colors.textMuted, fontSize: 10, fontWeight: "700" },
  statValue: { color: colors.text, fontSize: 13, fontWeight: "900", marginTop: 3 },
  heading: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  sectionEyebrow: { color: colors.cyan, fontSize: 10, fontWeight: "900", letterSpacing: 1.3 },
  sectionTitle: { color: colors.text, fontSize: 21, fontWeight: "900", marginTop: 3 },
  link: { color: colors.primary, fontSize: 12, fontWeight: "800" },
  horizontalList: { paddingLeft: spacing.lg, paddingRight: spacing.xs },
  empty: { color: colors.textMuted, paddingHorizontal: spacing.lg },
});
