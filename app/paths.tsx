import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { loadPath, type SavedPath } from "../src/helpers";
import { usePaths } from "../src/state/PathsContext";
import { Button } from "../src/ui/Button";
import { PathCard } from "../src/ui/PathCard";
import { colors, spacing, typography } from "../src/ui/theme";

export default function PathsScreen() {
  const router = useRouter();
  const { index, activePath, switchPath, deletePath } = usePaths();
  const [paths, setPaths] = useState<SavedPath[]>([]);

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

  function confirmDelete(path: SavedPath) {
    Alert.alert("Delete this path?", `"${path.hobby}" and all its progress will be removed from this device.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deletePath(path.id) },
    ]);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={typography.title}>Your paths</Text>
      {paths.length == 0 && <Text style={typography.caption}>No paths yet.</Text>}
      {paths.map((path) => (
        <PathCard
          key={path.id}
          path={path}
          active={path.id === index.activePathId}
          onPress={() => open(path)}
          onLongPress={() => confirmDelete(path)}
        />
      ))}
      {paths.length > 0 && <Text style={styles.hint}>Long press a path to delete it.</Text>}
      <View style={styles.footer}>
        <Button label="Start a new path" onPress={() => router.push("/onboarding")} testID="new-path" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.xl, gap: spacing.md, backgroundColor: colors.background, flexGrow: 1 },
  hint: { ...typography.caption, color: colors.textFaint },
  footer: { marginTop: "auto", paddingTop: spacing.lg, gap: spacing.sm },
});
