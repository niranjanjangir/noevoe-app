import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ReactNode } from "react";
import { colors, radius, spacing, typography } from "./theme";

type Props = {
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
  icon?: ReactNode;
  testID?: string;
};

export function LevelCard({ title, description, selected, onPress, icon, testID }: Props) {
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[styles.card, selected && styles.selected]}
    >
      <View style={[styles.dot, selected && styles.dotSelected]} />
      {icon && <View style={styles.icon}>{icon}</View>}
      <View style={styles.text}>
        <Text style={typography.heading}>{title}</Text>
        <Text style={typography.caption}>{description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selected: {
    borderColor: colors.accent,
    backgroundColor: colors.primaryTint,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.border,
  },
  dotSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.primary,
  },
  icon: { width: 34, height: 34, alignItems: "center", justifyContent: "center" },
  text: { flex: 1, gap: spacing.xs },
});
