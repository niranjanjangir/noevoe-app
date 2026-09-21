import { StyleSheet, Text, View } from "react-native";
import { Button } from "./Button";
import { colors, radius, spacing, typography } from "./theme";

type Props = {
  title?: string;
  message: string;
  onRetry?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

export function ErrorCard({ title = "Something went wrong", message, onRetry, secondaryLabel, onSecondary }: Props) {
  return (
    <View style={styles.card} testID="error-card">
      <Text style={typography.heading}>{title}</Text>
      <Text style={typography.body}>{message}</Text>
      <View style={styles.buttons}>
        {onRetry && <Button label="Try again" onPress={onRetry} testID="error-retry" />}
        {onSecondary && secondaryLabel && <Button label={secondaryLabel} onPress={onSecondary} kind="secondary" />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
    backgroundColor: colors.surface,
  },
  buttons: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" },
});
