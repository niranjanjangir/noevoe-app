import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { BackHandler, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  capabilityProgress,
  restoreCapability,
  restoreLesson,
  retireCapability,
  retireLesson,
  type SavedCapability,
  type SavedLesson,
} from "../../src/helpers";
import { usePaths } from "../../src/state/PathsContext";
import { Button } from "../../src/ui/Button";
import { ConfirmModal } from "../../src/ui/confirmModal";
import { LessonRow } from "../../src/ui/LessonRow";
import { colors, radius, spacing, typography } from "../../src/ui/theme";

export default function CapabilityScreen() {
  const router = useRouter();
  const { id, lessonId } = useLocalSearchParams<{ id: string; lessonId?: string }>();
  const { activePath, updateActivePath } = usePaths();
  const [confirmation, setConfirmation] = useState<{
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
  } | null>(null);

  const capability = findCapability(activePath?.capabilities ?? [], id ?? "");
  const openedLesson = useRef<string | null>(null);

  useEffect(() => {
    if (!capability || !lessonId || openedLesson.current === lessonId) return;
    openedLesson.current = lessonId;
    router.push(`/lesson/${lessonId}`);
  }, [capability, lessonId, router]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      router.dismissTo(`/path`);
      return true;
    });

    return () => subscription.remove();
  }, [router]);

  if (!capability) {
    return (
      <View style={styles.centered}>
        <Text style={typography.heading}>This capability is no longer here.</Text>
        <Button label="Back to path" kind="secondary" onPress={() => router.replace("/path")} />
      </View>
    );
  }

  const retired = capability.status === "RETIRED";
  const completed = capability.status === "COMPLETED";
  const progress = capabilityProgress(capability);

  function lessonMenu(lesson: SavedLesson) {
    if (lesson.status === "COMPLETED") return;
    if (lesson.status === "RETIRED") {
      updateActivePath((p) => restoreLesson(p, lesson.id));
      return;
    }
    setConfirmation({
      title: "Retire this lesson?",
      message: "Retiring skips this lesson. You can restore it later. Have fun with the others!",
      confirmText: "Retire lesson",
      onConfirm: () => updateActivePath((p) => retireLesson(p, lesson.id)),
    });
  }

  function confirmRetireCapability() {
    const capabilityId = capability!.id;
    setConfirmation({
      title: "Retire this capability?",
      message: "Retiring skips this capability. You can restore it later. Have fun with the others!",
      confirmText: "Retire",
      onConfirm: () => updateActivePath((p) => retireCapability(p, capabilityId)),
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[typography.title, retired && styles.struck]}>{capability.title}</Text>
      {retired && <Text style={styles.retiredNote}>Retired. Lessons here do not count towards your progress.</Text>}
      <Text style={typography.body}>{capability.description}</Text>

      <View style={styles.criterionSection}>
        <Text style={typography.body}>You'll be able to…</Text>
        {capability.masteryCriteria.map((criterion) => (
          <View key={criterion} style={styles.criterionItem}>
            <View style={styles.criterionBullet} />
            <Text style={[typography.caption, styles.criterionText]}>{criterion}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={typography.heading}>
          Lessons ({progress.done} / {progress.total} done)
        </Text>
        {capability.lessons.map((lesson, i) => (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            number={i + 1}
            isLast={i === capability.lessons.length - 1}
            onPress={() => router.push(`/lesson/${lesson.id}`)}
            onLongPress={() => lessonMenu(lesson)}
            onRestore={() => updateActivePath((p) => restoreLesson(p, lesson.id))}
          />
        ))}
        <Text style={styles.hint}>Long press a lesson to retire it.</Text>
      </View>

      <View style={styles.footer}>
        {retired && (
          <Button label="Restore this capability" onPress={() => updateActivePath((p) => restoreCapability(p, capability.id))} testID="restore-capability" />
        )}
        {!retired && !completed && (
          <Button label="Retire this capability" kind="secondary" onPress={confirmRetireCapability} testID="retire-capability" />
        )}
      </View>
      <ConfirmModal
        visible={confirmation !== null}
        title={confirmation?.title ?? ""}
        message={confirmation?.message ?? ""}
        confirmText={confirmation?.confirmText}
        type="default"
        onConfirm={() => {
          confirmation?.onConfirm();
          setConfirmation(null);
        }}
        onCancel={() => setConfirmation(null)}
      />
    </ScrollView>
  );
}

function findCapability(capabilities: SavedCapability[], id: string): SavedCapability | null {
  for (const capability of capabilities) {
    if (capability.id === id) return capability;
  }
  return null;
}

const styles = StyleSheet.create({
  container: { padding: spacing.xl, gap: spacing.lg, backgroundColor: colors.background, flexGrow: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.lg, padding: spacing.xl, backgroundColor: colors.background },
  criterionSection: { borderWidth: 1, borderColor: colors.primaryPressed, borderRadius: radius.sm, padding: spacing.md },
  criterionItem: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  criterionBullet: { width: 4, height: 4, borderRadius: 3, backgroundColor: colors.text, marginTop: 6 },
  criterionText: { flex: 1 },
  section: { gap: spacing.sm },
  struck: { textDecorationLine: "line-through", color: colors.retired },
  retiredNote: { ...typography.caption, color: colors.warning },
  hint: { ...typography.caption, color: colors.textFaint },
  footer: { marginTop: "auto", paddingTop: spacing.lg },
});
