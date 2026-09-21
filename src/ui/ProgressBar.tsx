import { StyleSheet, View } from "react-native";
import { colors } from "./theme";

export function ProgressBar({ ratio }: { ratio: number }) {
  const percent = Math.round(Math.min(1, Math.max(0, ratio)) * 100);
  return (
    <View style={styles.track} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: percent }}>
      <View style={[styles.fill, { width: `${percent}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: "hidden" },
  fill: { height: "100%", backgroundColor: colors.primary },
});
