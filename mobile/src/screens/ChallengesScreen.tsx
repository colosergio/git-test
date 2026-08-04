import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { ChallengeCard } from "../components/ChallengeCard";
import { ScreenHeader } from "../components/ScreenHeader";
import { useChallenges } from "../context/ChallengeContext";
import { gameOptions } from "../data/catalog";
import { filterChallenges, type ChallengeFilter } from "../domain/challenges";
import { colors, radius, spacing } from "../theme";

export function ChallengesScreen({ onCreate }: { onCreate: () => void }) {
  const { challenges, acceptChallenge } = useChallenges();
  const [filter, setFilter] = useState<ChallengeFilter>("all");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => filterChallenges(challenges, filter, query), [challenges, filter, query]);

  return (
    <View style={styles.container}>
      <ScreenHeader eyebrow="MATCHMAKING" title="Retos disponibles" />
      <View style={styles.toolbar}>
        <View style={styles.search}><Ionicons name="search" size={18} color={colors.textMuted} /><TextInput value={query} onChangeText={setQuery} style={styles.searchInput} placeholder="Jugador, juego o plataforma" placeholderTextColor={colors.textMuted} /></View>
        <TouchableOpacity style={styles.addButton} onPress={onCreate} accessibilityLabel="Crear reto"><Ionicons name="add" size={24} color={colors.white} /></TouchableOpacity>
      </View>
      <View>
        <FlatList
          horizontal
          data={[{ id: "all" as const, label: "Todos" }, ...gameOptions.map(([id, game]) => ({ id, label: game.shortName }))]}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
          renderItem={({ item }) => <TouchableOpacity style={[styles.filter, filter === item.id && styles.activeFilter]} onPress={() => setFilter(item.id)}><Text style={[styles.filterText, filter === item.id && styles.activeFilterText]}>{item.label}</Text></TouchableOpacity>}
        />
      </View>
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, !visible.length && styles.emptyList]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ChallengeCard challenge={item} onAccept={acceptChallenge} />}
        ListEmptyComponent={<View style={styles.empty}><Ionicons name="search-outline" size={34} color={colors.textMuted} /><Text style={styles.emptyTitle}>No encontramos retos</Text><Text style={styles.emptyText}>Prueba otro juego o crea tu propio desafío.</Text></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  toolbar: { flexDirection: "row", gap: spacing.sm, paddingHorizontal: spacing.lg, marginTop: spacing.sm },
  search: { flex: 1, height: 46, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.md, gap: spacing.sm },
  searchInput: { flex: 1, color: colors.text, fontSize: 13 },
  addButton: { width: 46, height: 46, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  filters: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm },
  filter: { paddingHorizontal: spacing.md, height: 36, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, justifyContent: "center" },
  activeFilter: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  filterText: { color: colors.textMuted, fontSize: 12, fontWeight: "700" },
  activeFilterText: { color: colors.text },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  emptyList: { flexGrow: 1 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 80 },
  emptyTitle: { color: colors.text, fontSize: 17, fontWeight: "900", marginTop: spacing.md },
  emptyText: { color: colors.textMuted, fontSize: 13, marginTop: spacing.xs },
});
