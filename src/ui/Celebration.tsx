import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";
import { Button } from "./Button";
import { colors, radius, spacing, typography } from "./theme";

type Props = {
  capabilityTitle: string;
  onDone: () => void;
};

export function Celebration({ capabilityTitle, onDone }: Props) {
  return (
    <View style={styles.wrap} testID="celebration">
      <View style={styles.card}>
        <LottieView
          source={require("../../assets/lottie/success.json")}
          autoPlay
          loop={false}
          style={styles.animation}
        />
        <Text style={typography.title}>Capability complete</Text>
        <Text style={[typography.body, styles.center]}>{capabilityTitle}</Text>
        <Text style={[typography.caption, styles.center]}>You did it! On to the next one champ.</Text>
        <Button style={styles.button} label="Back to path" onPress={onDone} testID="celebration-done" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "center", padding: spacing.xl, backgroundColor: colors.background },
  card: {
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.accent,
    backgroundColor: colors.primaryTint,
  },
  center: { textAlign: "center" },
  animation: { width: 140, height: 140 },
  button: {width: "90%"}
});
