import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import { sendReport } from "../api/routes";
import { colors } from "../ui/theme";
import { BlockCard } from "./BlockCard";

type Props = {
  type: string;
  message?: string;
  reportUnknown?: boolean;
  lessonId?: string;
};

export function UnsupportedBlock({ type, message, reportUnknown = false, lessonId }: Props) {
  useEffect(() => {
    if (!reportUnknown) return;
    sendReport({
      kind: "unknown_block_type",
      blockType: type,
      lessonId,
      message: `App cannot render block type "${type}".`,
      at: new Date().toISOString(),
    });
  }, [type]);

  return (
    <BlockCard testID="unsupported-block">
      <Text style={styles.text}>{message ?? "Sorry. This part of the lesson can't be shown in this version of the app."}</Text>
    </BlockCard>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 15, color: colors.textMuted },
  type: { fontSize: 12, color: colors.textFaint },
});
