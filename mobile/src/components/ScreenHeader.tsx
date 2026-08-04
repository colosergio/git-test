import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "../context/AuthContext";
import { colors, radius, spacing } from "../theme";

interface ScreenHeaderProps {
  eyebrow?: string;
  title: string;
  showProfile?: boolean;
}

export function ScreenHeader({ eyebrow, title, showProfile = false }: ScreenHeaderProps) {
  const { user } = useAuth();
  return (
    <View style={styles.header}>
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      {showProfile ? (
        <TouchableOpacity style={styles.profile} accessibilityRole="button" accessibilityLabel="Abrir perfil">
          <Text style={styles.initials}>{user?.initials ?? "A"}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.notification} accessibilityRole="button" accessibilityLabel="Notificaciones">
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
          <View style={styles.dot} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md },
  copy: { flex: 1 },
  eyebrow: { color: colors.cyan, fontSize: 11, fontWeight: "800", letterSpacing: 1.6, marginBottom: spacing.xs },
  title: { color: colors.text, fontSize: 27, fontWeight: "800", letterSpacing: -0.7 },
  profile: { width: 42, height: 42, borderRadius: radius.pill, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  initials: { color: colors.white, fontSize: 14, fontWeight: "800" },
  notification: { width: 42, height: 42, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  dot: { position: "absolute", right: 10, top: 9, width: 7, height: 7, borderRadius: 4, backgroundColor: colors.red, borderWidth: 1, borderColor: colors.surface },
});
