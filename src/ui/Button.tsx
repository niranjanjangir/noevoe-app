import { type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { colors, radius, spacing } from "./theme";

type Props = {
  label: string;
  onPress: () => void;
  kind?: "primary" | "secondary";
  disabled?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  icon?: ReactNode;
};

export function Button({ label, onPress, kind = "primary", disabled = false, testID, style, icon }: Props) {
  const isPrimary = kind === "primary";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        style,
        disabled && styles.disabled,
      ]}
    >
      {({ pressed }) => (
        <>
          <View style={[styles.depth, isPrimary ? styles.primaryDepth : styles.secondaryDepth]} />
          <View
            style={[
              styles.face,
              isPrimary ? styles.primary : styles.secondary,
              pressed && styles.facePressed,
            ]}
          >
            <View style={styles.content}>
              {icon}
              <Text style={[styles.label, isPrimary ? styles.primaryLabel : styles.secondaryLabel]}>{label}</Text>
            </View>
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    position: "relative",
    paddingBottom: 4,
  },
  depth: {
    ...StyleSheet.absoluteFill,
    top: 4,
    borderRadius: radius.md,
  },
  face: {
    width: "100%",
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  facePressed: { transform: [{ translateY: 3 }] },
  primary: { backgroundColor: colors.primary },
  primaryDepth: { backgroundColor: colors.accent },
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  secondaryDepth: { backgroundColor: colors.textFaint },
  disabled: { opacity: 0.45 },
  content: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  label: { fontSize: 16, fontWeight: "600" },
  primaryLabel: { color: colors.primaryText },
  secondaryLabel: { color: colors.text },
});
