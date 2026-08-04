import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useChallenges } from "../context/ChallengeContext";
import { gameOptions, platformOptions } from "../data/catalog";
import { validateChallenge } from "../domain/challenges";
import { colors, radius, spacing } from "../theme";
import type { CreateChallengeInput, GameId, PlatformId } from "../types";

const initialForm: CreateChallengeInput = {
  gameId: "fc26",
  platformId: "ps5",
  mode: "1 vs 1",
  rewardPoints: 50,
  availability: "Disponible ahora",
};

interface CreateChallengeModalProps {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateChallengeModal({ visible, onClose, onCreated }: CreateChallengeModalProps) {
  const { createChallenge } = useChallenges();
  const [form, setForm] = useState<CreateChallengeInput>(initialForm);

  const submit = () => {
    const errors = validateChallenge(form);
    if (errors.length) {
      Alert.alert("Revisa el reto", errors[0]);
      return;
    }
    createChallenge(form);
    setForm(initialForm);
    onCreated();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View><Text style={styles.eyebrow}>NUEVO MATCH</Text><Text style={styles.title}>Crear un reto</Text></View>
            <TouchableOpacity style={styles.close} onPress={onClose} accessibilityLabel="Cerrar"><Ionicons name="close" size={24} color={colors.text} /></TouchableOpacity>
          </View>
          <View style={styles.notice}><Ionicons name="shield-checkmark-outline" size={20} color={colors.cyan} /><Text style={styles.noticeText}>Beta free-to-play. Los puntos Arena no tienen valor monetario.</Text></View>

          <FieldLabel>Juego</FieldLabel>
          <View style={styles.optionGrid}>
            {gameOptions.map(([id, game]) => <Choice key={id} label={game.shortName} selected={form.gameId === id} onPress={() => setForm((value) => ({ ...value, gameId: id as GameId }))} />)}
          </View>

          <FieldLabel>Plataforma</FieldLabel>
          <View style={styles.optionGrid}>
            {platformOptions.slice(0, 3).map(([id, label]) => <Choice key={id} label={label} selected={form.platformId === id} onPress={() => setForm((value) => ({ ...value, platformId: id as PlatformId }))} />)}
          </View>

          <FieldLabel>Modo</FieldLabel>
          <View style={styles.optionGrid}>
            {["1 vs 1", "2 vs 2"].map((mode) => <Choice key={mode} label={mode} selected={form.mode === mode} onPress={() => setForm((value) => ({ ...value, mode }))} />)}
          </View>

          <FieldLabel>Puntos Arena</FieldLabel>
          <TextInput
            value={String(form.rewardPoints)}
            onChangeText={(value) => setForm((current) => ({ ...current, rewardPoints: Number(value.replace(/\D/g, "")) }))}
            style={styles.input}
            keyboardType="number-pad"
            placeholder="Entre 10 y 500"
            placeholderTextColor={colors.textMuted}
          />

          <FieldLabel>¿Cuándo quieres jugar?</FieldLabel>
          <TextInput
            value={form.availability}
            onChangeText={(availability) => setForm((current) => ({ ...current, availability }))}
            style={styles.input}
            maxLength={40}
            placeholder="Ej.: Hoy a las 20:00"
            placeholderTextColor={colors.textMuted}
          />

          <TouchableOpacity style={styles.submit} onPress={submit} accessibilityRole="button">
            <Text style={styles.submitText}>Publicar reto</Text><Ionicons name="arrow-forward" size={19} color={colors.white} />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function FieldLabel({ children }: { children: string }) {
  return <Text style={styles.label}>{children}</Text>;
}

function Choice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return <TouchableOpacity style={[styles.choice, selected && styles.selectedChoice]} onPress={onPress}><Text style={[styles.choiceText, selected && styles.selectedChoiceText]}>{label}</Text>{selected ? <Ionicons name="checkmark-circle" size={17} color={colors.primary} /> : null}</TouchableOpacity>;
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: 48 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.xl },
  eyebrow: { color: colors.cyan, fontSize: 11, fontWeight: "900", letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 28, fontWeight: "900", marginTop: 3 },
  close: { width: 42, height: 42, borderRadius: radius.pill, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  notice: { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.md, backgroundColor: "rgba(49,199,197,0.08)", borderRadius: radius.md, borderWidth: 1, borderColor: "rgba(49,199,197,0.2)", marginBottom: spacing.xl },
  noticeText: { flex: 1, color: colors.textMuted, fontSize: 12, lineHeight: 18 },
  label: { color: colors.text, fontSize: 13, fontWeight: "800", marginBottom: spacing.sm, marginTop: spacing.lg },
  optionGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  choice: { minHeight: 44, paddingHorizontal: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: "row", alignItems: "center", gap: 6 },
  selectedChoice: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  choiceText: { color: colors.textMuted, fontSize: 12, fontWeight: "700" },
  selectedChoiceText: { color: colors.text },
  input: { height: 50, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, color: colors.text, paddingHorizontal: spacing.lg, fontSize: 15 },
  submit: { height: 54, borderRadius: radius.md, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, marginTop: spacing.xxl },
  submitText: { color: colors.white, fontSize: 15, fontWeight: "900" },
});
