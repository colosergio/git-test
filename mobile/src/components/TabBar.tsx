import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors, spacing } from "../theme";
import type { RootTab } from "../types";

const tabs: { id: RootTab; label: string; icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "home", label: "Inicio", icon: "home-outline", activeIcon: "home" },
  { id: "challenges", label: "Retos", icon: "flash-outline", activeIcon: "flash" },
  { id: "ranking", label: "Ranking", icon: "trophy-outline", activeIcon: "trophy" },
  { id: "activity", label: "Actividad", icon: "time-outline", activeIcon: "time" },
];

interface TabBarProps {
  activeTab: RootTab;
  onChange: (tab: RootTab) => void;
}

export function TabBar({ activeTab, onChange }: TabBarProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onChange(tab.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Ionicons name={active ? tab.activeIcon : tab.icon} size={21} color={active ? colors.primary : colors.textMuted} />
            <Text style={[styles.label, active && styles.activeLabel]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", minHeight: 68, paddingTop: spacing.sm, paddingBottom: spacing.md, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  tab: { flex: 1, alignItems: "center", gap: 3 },
  label: { color: colors.textMuted, fontSize: 11, fontWeight: "600" },
  activeLabel: { color: colors.primary, fontWeight: "800" },
});
