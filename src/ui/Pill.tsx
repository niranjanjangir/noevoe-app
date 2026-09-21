import { Pressable, StyleSheet, Text } from "react-native";
import { colors, spacing } from "./theme";

type Props = {
  label: string;
  onPress: () => void;
};

export function Pill({ label, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.pill, pressed && styles.pressed]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pressed: { backgroundColor: colors.primaryTint },
  label: { fontSize: 14, color: colors.text },
});
