import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLesson } from "../../src/api/useLesson";

import type { BlockResult } from "../../src/types";
import { abandonLesson, completeLesson, findLesson, isLessonComplete, recordBlockResult, startLesson } from "../../src/helpers";
import { usePaths } from "../../src/state/PathsContext";
import { Button } from "../../src/ui/Button";
import { Celebration } from "../../src/ui/Celebration";
import { ErrorCard } from "../../src/ui/ErrorCard";
import { OfflineBanner } from "../../src/ui/OfflineBanner";
import { CheckIcon } from "../../src/ui/icons";
import { colors, spacing, typography } from "../../src/ui/theme";
import { BlockView } from "@/src/components/registry";

export default function LessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lessonId = id ?? "";
  const { activePath, getActivePath, updateActivePath } = usePaths();
  const { saved, content, loading, failed, errorMessage, retry } = useLesson(lessonId);
  const [celebrating, setCelebrating] = useState<string | null>(null);

  const found = activePath ? findLesson(activePath, lessonId) : null;
  const capability = found?.capability ?? null;

  useEffect(() => {
    if (!content || !saved) return;
    if (saved.status === "NOT_STARTED" || saved.status === "ABANDONED") {
      updateActivePath((p) => startLesson(p, lessonId));
    }
  }, [content !== null]);

  // Leaving while still in progress marks the lesson abandoned. Progress is kept.
  useEffect(() => {
    return () => {
      const path = getActivePath();
      const current = path ? findLesson(path, lessonId) : null;
      if (current && current.lesson.status === "IN_PROGRESS") {
        updateActivePath((p) => abandonLesson(p, lessonId));
      }
    };
  }, []);

  function onResult(result: BlockResult) {
    updateActivePath((p) => recordBlockResult(p, lessonId, result));
  }

  async function complete() {
    const before = capability?.status;
    const isUpdated = await updateActivePath((p) => completeLesson(p, lessonId));
    if (!isUpdated) return;
    const after = getActivePath();
    const currCapability = after ? findLesson(after, lessonId)?.capability : null;
    if (currCapability && currCapability.status === "COMPLETED" && before !== "COMPLETED") {
      setCelebrating(currCapability.title);
    } else {
      router.back();
    }
  }

  if (celebrating) {
    return <Celebration capabilityTitle={celebrating} onDone={() => router.replace("/path")} />;
  }

  if (!saved) {
    return (
      <View style={styles.centered}>
        <Text style={typography.heading}>This lesson is no longer here.</Text>
        <Button label="Back to path" kind="secondary" onPress={() => router.replace("/path")} />
      </View>
    );
  }

  if (failed) {
    return (
      <View style={styles.centered}>
        <ErrorCard
          title="Could not prepare this lesson"
          message={errorMessage ?? "The lesson could not be generated. Please try again."}
          onRetry={retry}
          secondaryLabel="Back"
          onSecondary={() => router.back()}
        />
      </View>
    );
  }

  if (loading || !content) {
    return (
      <View style={styles.centered} testID="lesson-loading">
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={typography.heading}>Preparing your lesson…</Text>
      </View>
    );
  }

  const blocks = [...content.blocks].sort((a, b) => a.order - b.order);
  const lessonNumber = capability ? capability.lessons.indexOf(saved) + 1 : 0;
  const canComplete = saved.status !== "COMPLETED" && isLessonComplete(saved);

  return (
    <View style={styles.screen}>
      <OfflineBanner />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={typography.title}>{content.title}</Text>
        <Text style={typography.caption}>
          {content.estimatedMinutes} min
          {capability ? ` · Lesson ${lessonNumber} of ${capability.lessons.length} in ${capability.title}` : ""}
        </Text>
        <Text style={typography.body}>{content.objective}</Text>

        {blocks.map((block) => (
          <BlockView key={block.id} block={block} result={saved.results[block.id]} onResult={onResult} lessonId={lessonId} />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        {saved.status === "COMPLETED" ? (
          <Button label="Lesson completed" icon={<CheckIcon size={16} color={colors.success} />} kind="secondary" onPress={() => router.back()} testID="complete-lesson" />
        ) : (
          <>
            <Button style={styles.completeButton} label="Complete lesson" onPress={complete} disabled={!canComplete} testID="complete-lesson" />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.xl, gap: spacing.xl, paddingBottom: spacing.xxl },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.md, padding: spacing.xl, backgroundColor: colors.background },
  hint: { ...typography.caption, textAlign: "center", marginTop: spacing.sm },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    width: "95%",
    alignSelf: "center",
  },
  completeButton:{
    marginBottom: 10,
  }
});
