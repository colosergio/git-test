import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors, radius, spacing } from "../theme";

const slides: { icon: keyof typeof Ionicons.glyphMap; eyebrow: string; title: string; description: string; color: string }[] = [
  { icon: "game-controller", eyebrow: "COMPETENCIA REAL", title: "Encuentra rivales que sí quieren jugar.", description: "Crea o acepta retos por juego, plataforma, nivel y disponibilidad.", color: colors.primary },
  { icon: "shield-checkmark", eyebrow: "FAIR PLAY", title: "Reglas claras antes de empezar.", description: "Cada reto define el modo, los puntos y cómo se confirmará el resultado.", color: colors.cyan },
  { icon: "trophy", eyebrow: "CONSTRUYE REPUTACIÓN", title: "Cada partida mejora tu perfil Arena.", description: "Reporta resultados, sube en el ranking y encuentra mejores rivales.", color: colors.orange },
];

export function OnboardingScreen({ onComplete }: { onComplete: () => Promise<void> }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index] ?? slides[0]!;
  const next = () => index === slides.length - 1 ? void onComplete() : setIndex((value) => value + 1);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.top}><View style={styles.brand}><Text style={styles.brandMark}>A</Text><Text style={styles.brandName}>ARENA</Text></View><TouchableOpacity onPress={() => void onComplete()}><Text style={styles.skip}>Saltar</Text></TouchableOpacity></View>
      <View style={styles.visual}><View style={[styles.glow, { backgroundColor: `${slide.color}22` }]} /><View style={[styles.iconWrap, { backgroundColor: `${slide.color}18`, borderColor: `${slide.color}55` }]}><Ionicons name={slide.icon} size={76} color={slide.color} /></View></View>
      <View style={styles.copy}><Text style={[styles.eyebrow, { color: slide.color }]}>{slide.eyebrow}</Text><Text style={styles.title}>{slide.title}</Text><Text style={styles.description}>{slide.description}</Text></View>
      <View style={styles.footer}><View style={styles.dots}>{slides.map((_, itemIndex) => <View key={itemIndex} style={[styles.dot, itemIndex === index && styles.activeDot]} />)}</View><TouchableOpacity style={styles.next} onPress={next}><Text style={styles.nextText}>{index === slides.length - 1 ? "Entrar a Arena" : "Continuar"}</Text><Ionicons name="arrow-forward" size={20} color={colors.white} /></TouchableOpacity></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, padding: spacing.xl },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brand: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  brandMark: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.primary, color: colors.white, textAlign: "center", lineHeight: 34, fontSize: 18, fontWeight: "900" },
  brandName: { color: colors.text, fontSize: 15, fontWeight: "900", letterSpacing: 2.5 },
  skip: { color: colors.textMuted, fontSize: 12, fontWeight: "800" },
  visual: { flex: 1, alignItems: "center", justifyContent: "center" },
  glow: { position: "absolute", width: 300, height: 300, borderRadius: 150 },
  iconWrap: { width: 170, height: 170, borderRadius: 56, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  copy: { minHeight: 220 },
  eyebrow: { fontSize: 11, fontWeight: "900", letterSpacing: 1.8 },
  title: { color: colors.text, fontSize: 33, lineHeight: 38, fontWeight: "900", letterSpacing: -1, marginTop: spacing.sm },
  description: { color: colors.textMuted, fontSize: 15, lineHeight: 23, marginTop: spacing.md },
  footer: { gap: spacing.xl },
  dots: { flexDirection: "row", gap: 7 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  activeDot: { width: 26, backgroundColor: colors.primary },
  next: { height: 56, borderRadius: radius.md, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm },
  nextText: { color: colors.white, fontSize: 15, fontWeight: "900" },
});
