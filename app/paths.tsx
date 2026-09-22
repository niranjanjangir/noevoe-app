import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { BackHandler, ScrollView, StyleSheet, Text, View } from "react-native";
import { loadPath, type SavedPath } from "../src/helpers";
import { usePaths } from "../src/state/PathsContext";
import { Button } from "../src/ui/Button";
import { ConfirmModal } from "../src/ui/confirmModal";
import { PathCard } from "../src/ui/PathCard";
import { colors, spacing, typography } from "../src/ui/theme";

export default function PathsScreen() {
  const router = useRouter();
  const { index, activePath, switchPath, deletePath } = usePaths();
  const [paths, setPaths] = useState<SavedPath[]>([]);
  const [pathToDelete, setPathToDelete] = useState<SavedPath | null>(null);

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      BackHandler.exitApp();
      return true;
    });

    return () => subscription.remove();
  }, []);

  const idsKey = index.pathIds.join(",");
  useEffect(() => {
    loadAll();
  }, [idsKey, activePath]);

  async function loadAll() {
    const loaded: SavedPath[] = [];
    for (const id of index.pathIds) {
      const path = await loadPath(id);
      if (path) loaded.push(path);
    }
    setPaths(loaded);
  }

  async function open(path: SavedPath) {
    const ok = await switchPath(path.id);
    if (ok) router.push("/path");
  }

  return (
    <>
      <Stack.Screen options={{ headerBackVisible: false }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={typography.title}>Your paths</Text>
        {paths.length == 0 && <Text style={typography.caption}>No paths yet.</Text>}
        {paths.map((path) => (
          <PathCard
            key={path.id}
            path={path}
            active={path.id === index.activePathId}
            onPress={() => open(path)}
            onLongPress={() => setPathToDelete(path)}
          />
        ))}
        {paths.length > 0 && <Text style={styles.hint}>Long press a path to delete it.</Text>}
        <View style={styles.footer}>
          <Button label="Start a new path" onPress={() => router.push("/onboarding")} testID="new-path" />
        </View>
      </ScrollView>
      <ConfirmModal
        visible={pathToDelete !== null}
        title="Delete this path?"
        message={pathToDelete ? "This path and all its progress will be removed from this device." : ""}
        confirmText="Delete"
        type="danger"
        onConfirm={() => {
          if (pathToDelete) deletePath(pathToDelete.id);
          setPathToDelete(null);
        }}
        onCancel={() => setPathToDelete(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.xl, gap: spacing.md, backgroundColor: colors.background, flexGrow: 1 },
  hint: { ...typography.caption, color: colors.textFaint },
  footer: { marginTop: "auto", paddingTop: spacing.lg, gap: spacing.sm },
});
