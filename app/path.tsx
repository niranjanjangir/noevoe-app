import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { BackHandler, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { usePregenerate } from "../src/api/pregenerate";
import { nextLessonIn, pathProgress, restoreCapability, type SavedCapability, type SavedPath } from "../src/helpers";
import { usePaths } from "../src/state/PathsContext";
import { Button } from "../src/ui/Button";
import { CapabilityRow, type RowState } from "../src/ui/CapabilityRow";
import { OfflineBanner } from "../src/ui/OfflineBanner";
import { ProgressBar } from "../src/ui/ProgressBar";
import { colors, spacing, typography } from "../src/ui/theme";

export default function PathScreen() {
  const router = useRouter();
  const { activePath, updateActivePath, saveError, reload } = usePaths();
  const [refreshing, setRefreshing] = useState(false);
  const pregeneration = usePregenerate();

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      router.dismissTo("/paths");
      return true;
    });

    return () => subscription.remove();
  }, [router]);

  if (!activePath) {
    return (
      <View style={styles.empty}>
        <Text style={typography.heading}>No path yet</Text>
        <Button label="Start a path" onPress={() => router.replace("/onboarding")} />
      </View>
    );
  }

  const path = activePath;
  const progress = pathProgress(path);

  async function refresh() {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  }

  function rowState(capability: SavedCapability): RowState {
    if (capability.status === "RETIRED") return "retired";
    if (capability.status === "COMPLETED") return "done";
    if (progress.currentCapability?.id === capability.id) return "current";
    return "upcoming";
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.accent} />}
    >
      <OfflineBanner />
      <View style={styles.headerRow}>
        <Text style={styles.eyebrow}>Your {path.hobby} path</Text>
        <Pressable onPress={() => router.dismissTo("/paths")} accessibilityRole="button" testID="all-paths" hitSlop={8}>
          <Text style={styles.link}>All paths</Text>
        </Pressable>
      </View>
      <Text style={styles.goalQuote}>
        "{path.goal}"
      </Text>

      <View style={styles.progressBlock}>
        <Text style={typography.caption}>
          Progress: {progress.completed} / {progress.active} capabilities achieved
        </Text>
        <ProgressBar ratio={progress.ratio} />
      </View>

      {saveError && <Text style={styles.error}>{saveError}</Text>}

      <View style={styles.rows}>
        {path.capabilities.map((capability, index) => {
          const state = rowState(capability);
          const next = state === "current" ? nextLessonIn(capability) : null;
          return (
            <CapabilityRow
              key={capability.id}
              capability={capability}
              state={state}
              index={index + 1}
              isLast={index === path.capabilities.length - 1}
              nextLessonTitle={next?.title}
              onPress={() => router.push(`/capability/${capability.id}`)}
              onContinue={next ? () => router.push(`/capability/${capability.id}?lessonId=${next.id}`) : undefined}
              onRestore={() => updateActivePath((p) => restoreCapability(p, capability.id))}
            />
          );
        })}
      </View>

      {progress.currentCapability === null && progress.active > 0 && (
        <View style={styles.finishedRow}>
          <LottieView
            source={require("../assets/lottie/success.json")}
            autoPlay
            loop={true}
            style={styles.finishedAnimation}
          />
          <Text style={styles.finished}>You have completed every capability on this path!</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.xl, gap: spacing.lg, backgroundColor: colors.background, flexGrow: 1 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.lg, padding: spacing.xl, backgroundColor: colors.background },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  eyebrow: { ...typography.caption, textTransform: "uppercase", letterSpacing: 1, fontWeight: "700", color: colors.accent },
  link: { color: colors.accent, fontWeight: "600" },
  goalQuote: { ...typography.body, fontStyle: "italic", borderLeftWidth: 3, borderLeftColor: colors.border, paddingLeft: spacing.md },
  progressBlock: { gap: spacing.sm, marginVertical: spacing.sm },
  pausedRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  pausedText: { flex: 1, color: colors.warning },
  error: { ...typography.caption, color: colors.danger },
  rows: { gap: spacing.sm },
  finishedRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, marginTop: spacing.lg },
  finishedAnimation: { width: 32, height: 32 },
  finished: { ...typography.body, flex: 1 },
});
