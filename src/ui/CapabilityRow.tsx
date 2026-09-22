import { Pressable, StyleSheet, Text, View } from "react-native";
import { capabilityProgress, retireCapability, type SavedCapability } from "../helpers";
import { Button } from "./Button";
import { CheckIcon, RetiredIcon } from "./icons";
import { colors, radius, spacing, typography } from "./theme";
import { useEffect } from "react";
import { usePaths } from "../state/PathsContext";


export type RowState = "done" | "current" | "upcoming" | "retired";

type Props = {
  capability: SavedCapability;
  state: RowState;
  index: number;
  isLast: boolean;
  nextLessonTitle?: string;
  onPress: () => void;
  onContinue?: () => void;
  onRestore?: () => void;
};

function StatusIcon({ state }: { state: RowState }) {
  if (state === "done") {
    return <CheckIcon />;
  }
  if (state === "retired") {
    return <RetiredIcon />;
  }
  return null;
}

export function CapabilityRow({ capability, state, index, isLast, nextLessonTitle, onPress, onContinue, onRestore }: Props) {
  const progress = capabilityProgress(capability);
  const isCurrent = state === "current";
  const isRetired = state === "retired";
  const { updateActivePath } = usePaths();

  useEffect(()=>{
    if(isCurrent && !nextLessonTitle) {
      updateActivePath((p) => retireCapability(p, capability.id))
    }
  },[isCurrent, nextLessonTitle, updateActivePath, capability.id])

  return (
    <View style={styles.timelineItem}>
      <View style={styles.markerColumn}>
        <View style={[styles.marker, state === "done" && styles.markerDone, isCurrent && styles.markerCurrent, isRetired && styles.markerRetired]}>
          <StatusIcon state={state} />
        </View>
        {index === 1 && !isLast && <View style={styles.connector} />}
        {index > 1 && <View style={[styles.connector, styles.connectorFromTop, isLast && styles.connectorToCenter]} />}
      </View>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        testID={`capability-row-${capability.id}`}
        style={({ pressed }) => [styles.row, isCurrent && styles.current, isRetired && styles.retired, pressed && styles.pressed]}
      >
        <View style={styles.main}>
          <Text style={[styles.index, isRetired && styles.indexRetired]}>{index}</Text>
          <View style={styles.text}>
            <Text style={[typography.heading, isRetired && styles.struck, state === "upcoming" && styles.quiet]}>{capability.title}</Text>
            {!isRetired && <Text style={typography.caption}>{progress.done} / {progress.total} lessons</Text>}
            {isCurrent && nextLessonTitle && <Text style={typography.caption}>Next: {nextLessonTitle}</Text>}
            {isCurrent && !nextLessonTitle && <Text style={typography.caption}>No lessons left. Restore one or retire this capability.</Text>}
            {isRetired && <Text style={typography.caption}>Retired</Text>}
          </View>
          {isRetired && onRestore && (
            <Pressable onPress={onRestore} accessibilityRole="button" testID={`restore-${capability.id}`} hitSlop={8}>
              <Text style={styles.link}>Restore</Text>
            </Pressable>
          )}
        </View>
        {isCurrent && onContinue && (
          <View style={styles.continueRow}>
            <Button label="Continue" onPress={onContinue} testID="continue" style={styles.continueButton} />
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  timelineItem: { flexDirection: "row", gap: spacing.md, },
  markerColumn: { width: 24, alignItems: "center", justifyContent: "center", position: "relative" },
  marker: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: colors.textFaint, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", zIndex: 1 },
  markerDone: { borderColor: colors.success, backgroundColor: colors.success },
  markerCurrent: { borderColor: colors.accent, backgroundColor: colors.primaryTint },
  markerRetired: { borderColor: colors.retired, backgroundColor: colors.surfaceMuted },
  connector: { position: "absolute", top: "50%", bottom: -spacing.sm, width: 1, borderLeftWidth: 1, borderStyle: "dotted", borderColor: colors.textFaint },
  connectorFromTop: { top: 0 },
  connectorToCenter: { bottom: "50%" },
  row: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.md,
  },
  current: { borderColor: colors.accent, borderWidth: 1.5, backgroundColor: colors.primaryTint },
  retired: { backgroundColor: colors.surfaceMuted },
  pressed: { opacity: 0.85 },
  main: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  index: { width: 24, fontSize: 22, lineHeight: 26, fontWeight: "700", color: colors.textMuted, textAlign: "center" },
  indexRetired: { color: colors.retired },
  text: { flex: 1, gap: spacing.xs },
  struck: { textDecorationLine: "line-through", color: colors.retired },
  quiet: { color: colors.textMuted, fontWeight: "500" },
  link: { color: colors.accent, fontWeight: "600" },
  continueRow: { flexDirection: "row", alignSelf: "stretch", justifyContent: "center", width: "100%" },
  continueButton: { width: "100%" },
});
