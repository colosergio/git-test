import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useChallenges } from "../context/ChallengeContext";
import { colors, radius, spacing } from "../theme";
import type { Match } from "../types";

export function ResultModal({ match, onClose }: { match: Match | null; onClose: () => void }) {
  const { reportResult } = useChallenges();
  const [ownScore, setOwnScore] = useState("");
  const [opponentScore, setOpponentScore] = useState("");
  const [submitting, setSubmitting] = useState(false);
  if (!match) return null;
  const submit = async () => {
    const own = Number(ownScore); const opponent = Number(opponentScore);
    if (!Number.isInteger(own) || !Number.isInteger(opponent) || own < 0 || opponent < 0) { Alert.alert("Marcador inválido", "Ingresa los dos resultados con números enteros."); return; }
    setSubmitting(true);
    try {
      const updated = await reportResult(match.id, own, opponent);
      setOwnScore(""); setOpponentScore(""); onClose();
      const message = updated.status === "completed" ? "El marcador coincidió y la partida quedó confirmada." : updated.status === "disputed" ? "Los reportes no coinciden y el resultado quedó en revisión." : "Esperaremos la confirmación de tu rival.";
      Alert.alert("Resultado enviado", message);
    }
    catch (error) { Alert.alert("No pudimos enviar el resultado", error instanceof Error ? error.message : "Intenta nuevamente."); }
    finally { setSubmitting(false); }
  };
  return <Modal visible transparent animationType="fade" onRequestClose={onClose}><View style={styles.backdrop}><View style={styles.modal}><View style={styles.header}><View><Text style={styles.eyebrow}>CONFIRMAR PARTIDA</Text><Text style={styles.title}>Reportar resultado</Text></View><TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color={colors.text} /></TouchableOpacity></View><Text style={styles.note}>Ingresa el marcador desde tu perspectiva. Tu rival deberá informar el resultado inverso.</Text><View style={styles.scoreRow}><View style={styles.scoreField}><Text style={styles.label}>TÚ</Text><TextInput style={styles.scoreInput} value={ownScore} onChangeText={setOwnScore} keyboardType="number-pad" maxLength={2} /></View><Text style={styles.separator}>—</Text><View style={styles.scoreField}><Text style={styles.label}>RIVAL</Text><TextInput style={styles.scoreInput} value={opponentScore} onChangeText={setOpponentScore} keyboardType="number-pad" maxLength={2} /></View></View><TouchableOpacity style={styles.submit} onPress={submit} disabled={submitting}><Text style={styles.submitText}>{submitting ? "Enviando…" : "Enviar resultado"}</Text></TouchableOpacity></View></View></Modal>;
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.72)", justifyContent: "center", padding: spacing.xl }, modal: { borderRadius: radius.lg, padding: spacing.xl, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, eyebrow: { color: colors.cyan, fontSize: 10, fontWeight: "900", letterSpacing: 1.5 }, title: { color: colors.text, fontSize: 23, fontWeight: "900", marginTop: 4 }, note: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: spacing.md },
  scoreRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.md, marginVertical: spacing.xl }, scoreField: { alignItems: "center" }, label: { color: colors.textMuted, fontSize: 9, fontWeight: "900", marginBottom: spacing.sm }, scoreInput: { width: 84, height: 72, borderRadius: radius.md, borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.background, color: colors.text, textAlign: "center", fontSize: 30, fontWeight: "900" }, separator: { color: colors.textMuted, fontSize: 24 },
  submit: { height: 52, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }, submitText: { color: colors.white, fontWeight: "900" },
});
