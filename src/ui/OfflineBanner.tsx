import { StyleSheet, Text, View } from "react-native";
import { useRecentlyOffline } from "../api/offline";
import { colors, spacing } from "./theme";

export function OfflineBanner() {
  const offline = useRecentlyOffline();
  if (!offline) return null;
  return (
    <View style={styles.banner} testID="offline-banner">
      <Text style={styles.text}>You're offline. Saved lessons still work.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { borderWidth: 1.5, borderColor: colors.primary, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: 8 },
  text: { color: colors.primaryText, fontWeight: "600", textAlign: "center" },
});
