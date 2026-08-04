import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { ApiError, apiBaseUrl } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { colors, radius, spacing } from "../theme";

export function AuthScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [form, setForm] = useState({ displayName: "", handle: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      if (mode === "register") await register(form);
      else await login({ email: form.email, password: form.password });
    } catch (reason) {
      setError(reason instanceof ApiError || reason instanceof Error ? reason.message : "No pudimos iniciar sesión.");
    } finally { setSubmitting(false); }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.brand}><Text style={styles.brandMark}>A</Text><Text style={styles.brandName}>ARENA</Text></View>
          <Text style={styles.eyebrow}>{mode === "register" ? "CREA TU PERFIL" : "BIENVENIDO DE NUEVO"}</Text>
          <Text style={styles.title}>{mode === "register" ? "Entra a competir." : "Vuelve a la Arena."}</Text>
          <Text style={styles.subtitle}>{mode === "register" ? "Tu reputación empieza con el primer reto." : "Tus retos y resultados están sincronizados."}</Text>

          {mode === "register" ? <><Field icon="person-outline" placeholder="Nombre visible" value={form.displayName} onChangeText={(displayName) => setForm((value) => ({ ...value, displayName }))} /><Field icon="at-outline" placeholder="Usuario, ej. sergio10" value={form.handle} onChangeText={(handle) => setForm((value) => ({ ...value, handle }))} autoCapitalize="none" /></> : null}
          <Field icon="mail-outline" placeholder="Email" value={form.email} onChangeText={(email) => setForm((value) => ({ ...value, email }))} keyboardType="email-address" autoCapitalize="none" />
          <View style={styles.field}><Ionicons name="lock-closed-outline" size={19} color={colors.textMuted} /><TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor={colors.textMuted} value={form.password} onChangeText={(password) => setForm((value) => ({ ...value, password }))} secureTextEntry={!showPassword} autoCapitalize="none" /><TouchableOpacity onPress={() => setShowPassword((value) => !value)}><Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={colors.textMuted} /></TouchableOpacity></View>
          {error ? <View style={styles.error}><Ionicons name="alert-circle" size={18} color={colors.red} /><Text style={styles.errorText}>{error}</Text></View> : null}
          <TouchableOpacity style={styles.submit} onPress={submit} disabled={submitting}><Text style={styles.submitText}>{submitting ? "Conectando…" : mode === "register" ? "Crear cuenta" : "Iniciar sesión"}</Text><Ionicons name="arrow-forward" size={19} color={colors.white} /></TouchableOpacity>
          <TouchableOpacity style={styles.switchButton} onPress={() => { setMode((value) => value === "register" ? "login" : "register"); setError(null); }}><Text style={styles.switchText}>{mode === "register" ? "¿Ya tienes cuenta? " : "¿Todavía no tienes cuenta? "}<Text style={styles.switchStrong}>{mode === "register" ? "Inicia sesión" : "Regístrate"}</Text></Text></TouchableOpacity>
          <Text style={styles.connection}>API: {apiBaseUrl}</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field(props: { icon: keyof typeof Ionicons.glyphMap; placeholder: string; value: string; onChangeText: (value: string) => void; keyboardType?: "default" | "email-address"; autoCapitalize?: "none" | "sentences" }) {
  return <View style={styles.field}><Ionicons name={props.icon} size={19} color={colors.textMuted} /><TextInput style={styles.input} placeholder={props.placeholder} placeholderTextColor={colors.textMuted} value={props.value} onChangeText={props.onChangeText} keyboardType={props.keyboardType} autoCapitalize={props.autoCapitalize} /></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, flex: { flex: 1 }, content: { flexGrow: 1, padding: spacing.xl, justifyContent: "center" },
  brand: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: 48 },
  brandMark: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.primary, color: colors.white, textAlign: "center", lineHeight: 42, fontSize: 23, fontWeight: "900" },
  brandName: { color: colors.text, fontSize: 18, fontWeight: "900", letterSpacing: 3 },
  eyebrow: { color: colors.cyan, fontSize: 11, fontWeight: "900", letterSpacing: 1.6 },
  title: { color: colors.text, fontSize: 34, fontWeight: "900", letterSpacing: -1, marginTop: spacing.sm },
  subtitle: { color: colors.textMuted, fontSize: 14, lineHeight: 21, marginTop: spacing.sm, marginBottom: spacing.xl },
  field: { height: 52, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.md, gap: spacing.sm, marginBottom: spacing.md },
  input: { flex: 1, color: colors.text, fontSize: 14 },
  error: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: "rgba(255,107,122,0.1)", padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.md },
  errorText: { flex: 1, color: colors.red, fontSize: 12, lineHeight: 17 },
  submit: { height: 54, borderRadius: radius.md, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, marginTop: spacing.sm },
  submitText: { color: colors.white, fontSize: 15, fontWeight: "900" },
  switchButton: { alignItems: "center", padding: spacing.lg }, switchText: { color: colors.textMuted, fontSize: 13 }, switchStrong: { color: colors.primary, fontWeight: "900" },
  connection: { color: colors.border, fontSize: 9, textAlign: "center", marginTop: spacing.xl },
});
