import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { usePaths } from "../src/state/PathsContext";
import { colors, spacing, typography } from "../src/ui/theme";

export default function IndexScreen() {
  const { loading, activePath } = usePaths();

  if (loading) {
    return (
      <View style={styles.container} testID="index-screen">
        <Text style={typography.title}>noevoe - Learn Hobby</Text>
        <Text style={styles.subtitle}>Learn a hobby for pure enjoyment!</Text>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return <Redirect href={activePath ? "/paths" : "/onboarding"} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: "center",
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
});
