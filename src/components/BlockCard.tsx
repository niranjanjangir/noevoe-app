import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../ui/theme";

type Props = {
  title?: string;
  children: ReactNode;
  accent?: "none" | "tip" | "warning" | "success" | "danger";
  testID?: string;
};

const accentColors = {
  none: colors.border,
  tip: colors.primary,
  warning: colors.warning,
  success: colors.success,
  danger: colors.danger,
};

export function BlockCard({ title, children, accent = "none", testID }: Props) {
  return (
    <View style={[styles.card, { borderLeftColor: accentColors[accent] }]} testID={testID}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: colors.textMuted,
  },
});
