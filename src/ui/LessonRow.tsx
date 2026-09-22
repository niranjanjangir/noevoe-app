import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRef } from "react";
import type { LessonStatus, SavedLesson } from "../helpers";
import { AbandonedIcon, CheckIcon, InProgressIcon, RetiredIcon } from "./icons";
import { colors, radius, spacing, typography } from "./theme";

type Props = {
  lesson: SavedLesson;
  number: number;
  isLast: boolean;
  onPress: () => void;
  onLongPress: () => void;
  onRestore: () => void;
};

function StatusIcon({ status }: { status: LessonStatus }) {
  if (status === "COMPLETED") {
    return <CheckIcon />;
  }
  if (status === "RETIRED") {
    return <RetiredIcon />;
  }
  if (status === "IN_PROGRESS") {
    return <InProgressIcon />;
  }
  if (status === "ABANDONED") {
    return <AbandonedIcon />;
  }
  return null;
}

function contentTag(lesson: SavedLesson): string {
  if (lesson.generationStatus === "ready") return "Saved";
  if (lesson.generationStatus === "failed") return "Not prepared";
  return "Preparing…";
}

export function LessonRow({ lesson, number, isLast, onPress, onLongPress, onRestore }: Props) {
  const retired = lesson.status === "RETIRED";
  return (
    <View style={styles.timelineItem}>
      <View style={styles.markerColumn}>
        <View style={[styles.marker, lesson.status === "COMPLETED" && styles.markerDone, lesson.status === "IN_PROGRESS" && styles.markerCurrent, retired && styles.markerRetired]}>
          <StatusIcon status={lesson.status} />
        </View>
        {number === 1 && !isLast && <View style={styles.connector} />}
        {number > 1 && <View style={[styles.connector, styles.connectorFromTop, isLast && styles.connectorToCenter]} />}
      </View>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        accessibilityRole="button"
        testID={`lesson-row-${lesson.id}`}
        style={({ pressed }) => [styles.row, retired && styles.retired, pressed && styles.pressed]}
      >
        <Text style={[styles.index, retired && styles.indexRetired]}>{number}</Text>
        <View style={styles.text}>
          <Text style={[typography.body, styles.title, retired && styles.struck]}>{lesson.title}</Text>
          <Text style={typography.caption}>{retired ? "Retired" : contentTag(lesson)}</Text>
        </View>
        {retired && (
          <Pressable onPress={onRestore} accessibilityRole="button" testID={`restore-lesson-${lesson.id}`} hitSlop={8}>
            <Text style={styles.link}>Restore</Text>
          </Pressable>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  timelineItem: { flexDirection: "row", gap: spacing.md },
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
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  retired: { backgroundColor: colors.surfaceMuted },
  pressed: { opacity: 0.85 },
  index: { width: 24, fontSize: 20, lineHeight: 24, fontWeight: "700", color: colors.textMuted, textAlign: "center" },
  indexRetired: { color: colors.retired },
  text: { flex: 1 },
  title: { fontWeight: "500" },
  struck: { textDecorationLine: "line-through", color: colors.retired },
  link: { color: colors.accent, fontWeight: "600" },
});
