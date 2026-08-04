import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { ScreenHeader } from "../components/ScreenHeader";
import { useAuth } from "../context/AuthContext";
import { colors, radius, spacing } from "../theme";

export function ProfileScreen() {
  const { user, updateProfile, logout } = useAuth();
  const [form, setForm] = useState({ displayName: "", handle: "", psn: "", xbox: "", ea: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({ displayName: user.displayName, handle: user.handle, psn: user.gamertags.psn ?? "", xbox: user.gamertags.xbox ?? "", ea: user.gamertags.ea ?? "" });
  }, [user]);
  if (!user) return null;

  const save = async () => {
    setSaving(true);
    try { await updateProfile({ displayName: form.displayName, handle: form.handle, gamertags: { psn: form.psn, xbox: form.xbox, ea: form.ea } }); Alert.alert("Perfil actualizado", "Tus datos ya están sincronizados."); }
    catch (error) { Alert.alert("No pudimos guardar", error instanceof Error ? error.message : "Intenta nuevamente."); }
    finally { setSaving(false); }
  };

  return <ScrollView style={styles.container} contentContainerStyle={styles.content}><ScreenHeader eyebrow="TU IDENTIDAD GAMER" title="Perfil Arena" showProfile /><View style={styles.card}><View style={styles.avatar}><Text style={styles.initials}>{user.initials}</Text></View><Text style={styles.name}>{user.displayName}</Text><Text style={styles.handle}>{user.handle}</Text><View style={styles.metrics}><Metric label="NIVEL" value={String(user.level)} /><Metric label="REPUTACIÓN" value={`★ ${user.rating.toFixed(1)}`} /></View></View><Text style={styles.sectionTitle}>Datos públicos</Text><ProfileField label="Nombre visible" value={form.displayName} onChangeText={(displayName) => setForm((value) => ({ ...value, displayName }))} /><ProfileField label="Usuario" value={form.handle} onChangeText={(handle) => setForm((value) => ({ ...value, handle }))} /><Text style={styles.sectionTitle}>Gamertags</Text><ProfileField label="PlayStation Network" value={form.psn} onChangeText={(psn) => setForm((value) => ({ ...value, psn }))} /><ProfileField label="Xbox" value={form.xbox} onChangeText={(xbox) => setForm((value) => ({ ...value, xbox }))} /><ProfileField label="EA ID" value={form.ea} onChangeText={(ea) => setForm((value) => ({ ...value, ea }))} /><TouchableOpacity style={styles.save} onPress={save} disabled={saving}><Text style={styles.saveText}>{saving ? "Guardando…" : "Guardar perfil"}</Text><Ionicons name="cloud-done-outline" size={19} color={colors.white} /></TouchableOpacity><TouchableOpacity style={styles.logout} onPress={() => void logout()}><Ionicons name="log-out-outline" size={19} color={colors.red} /><Text style={styles.logoutText}>Cerrar sesión</Text></TouchableOpacity></ScrollView>;
}

function ProfileField({ label, value, onChangeText }: { label: string; value: string; onChangeText: (value: string) => void }) { return <View style={styles.fieldWrap}><Text style={styles.label}>{label}</Text><TextInput style={styles.input} value={value} onChangeText={onChangeText} autoCapitalize="none" /></View>; }
function Metric({ label, value }: { label: string; value: string }) { return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>; }

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background }, content: { paddingBottom: 40 },
  card: { margin: spacing.lg, padding: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center" },
  avatar: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }, initials: { color: colors.white, fontSize: 24, fontWeight: "900" },
  name: { color: colors.text, fontSize: 20, fontWeight: "900", marginTop: spacing.md }, handle: { color: colors.textMuted, marginTop: 3 },
  metrics: { flexDirection: "row", marginTop: spacing.xl }, metric: { minWidth: 110, alignItems: "center", borderLeftWidth: 1, borderLeftColor: colors.border }, metricValue: { color: colors.text, fontSize: 17, fontWeight: "900" }, metricLabel: { color: colors.textMuted, fontSize: 8, fontWeight: "800", marginTop: 3 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: "900", marginHorizontal: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.sm },
  fieldWrap: { marginHorizontal: spacing.lg, marginBottom: spacing.md }, label: { color: colors.textMuted, fontSize: 11, fontWeight: "700", marginBottom: 6 }, input: { height: 50, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, color: colors.text, paddingHorizontal: spacing.md },
  save: { margin: spacing.lg, height: 52, borderRadius: radius.md, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm }, saveText: { color: colors.white, fontWeight: "900" },
  logout: { marginHorizontal: spacing.lg, height: 48, borderRadius: radius.md, borderWidth: 1, borderColor: "rgba(255,107,122,0.3)", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm }, logoutText: { color: colors.red, fontWeight: "800" },
});
