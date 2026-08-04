import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";

export function LoadingScreen() {
  return <View style={styles.container}><View style={styles.brand}><Text style={styles.mark}>A</Text></View><Text style={styles.name}>ARENA</Text><ActivityIndicator color={colors.primary} style={styles.loader} /></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
  brand: { width: 64, height: 64, borderRadius: 22, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  mark: { color: colors.white, fontSize: 34, fontWeight: "900" },
  name: { color: colors.text, fontSize: 18, fontWeight: "900", letterSpacing: 4, marginTop: spacing.md },
  loader: { marginTop: spacing.xl },
});
