import { Pressable, StyleSheet, Text, View } from "react-native";
import { pathProgress, type SavedPath } from "../helpers";
import { colors, radius, spacing, typography } from "./theme";

type Props = {
  path: SavedPath;
  active: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

export function PathCard({ path, active, onPress, onLongPress }: Props) {
  const progress = pathProgress(path);
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      testID={`path-card-${path.id}`}
      style={({ pressed }) => [styles.card, active && styles.active, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <Text style={typography.heading}>{path.hobby}</Text>
        <View style={styles.badgeContainer}>
          {active && <Text style={styles.badge}>Last visited</Text>}
          {progress.completed === progress.active && <Text style={styles.badge}>Completed</Text>}
        </View>
      </View>
      <Text style={typography.caption}>{path.goal}</Text>
      <Text style={styles.progress}>
        {progress.completed} / {progress.active} capabilities
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  active: { borderColor: colors.accent },
  pressed: { backgroundColor: colors.surfaceMuted },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  badgeContainer:{flexDirection: "row", gap: 8,},
  badge: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primaryText,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 999,
  },
  progress: { ...typography.caption, color: colors.accent, fontWeight: "600" },
});
