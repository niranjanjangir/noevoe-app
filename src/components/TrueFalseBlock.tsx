import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { BlockResult, TrueFalsePayload } from "../types";
import { colors, radius } from "../ui/theme";
import { BlockCard } from "./BlockCard";

type Props = {
  blockId: string;
  payload: TrueFalsePayload;
  result?: BlockResult;
  onResult: (result: BlockResult) => void;
};

export function TrueFalseBlock({ blockId, payload, result, onResult }: Props) {
  const alreadyCorrect = result?.status === "success";
  const [chosen, setChosen] = useState<boolean | null>(alreadyCorrect ? payload.answer : null);

  const answered = chosen !== null;
  const isCorrect = chosen === payload.answer;

  function choose(value: boolean) {
    if (isCorrect) return;
    setChosen(value);
    onResult({
      blockId,
      status: value === payload.answer ? "success" : "incorrect",
      detail: { answer: value },
      at: new Date().toISOString(),
    });
  }

  function optionStyle(value: boolean) {
    if (!answered) return styles.option;
    if (value === payload.answer) return [styles.option, styles.correct];
    if (value === chosen) return [styles.option, styles.wrong];
    return styles.option;
  }

  return (
    <BlockCard title="True or false?" accent="none">
      <Text style={styles.statement}>{payload.statement}</Text>
      <View style={styles.row}>
        <Pressable onPress={() => choose(true)} disabled={isCorrect} accessibilityRole="button" style={optionStyle(true)}>
          <Text style={styles.optionText}>True</Text>
        </Pressable>
        <Pressable onPress={() => choose(false)} disabled={isCorrect} accessibilityRole="button" style={optionStyle(false)}>
          <Text style={styles.optionText}>False</Text>
        </Pressable>
      </View>
      {answered ? (
        <Text style={styles.explanation}>
          {isCorrect ? "Correct. " : "Not quite. "}
          {payload.explanation}
        </Text>
      ) : null}
    </BlockCard>
  );
}

const styles = StyleSheet.create({
  statement: { fontSize: 16, lineHeight: 24, color: colors.text, fontWeight: "500" },
  row: { flexDirection: "row", gap: 8 },
  option: {
    flex: 1,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  correct: { borderColor: colors.success, backgroundColor: "#E9F7EE" },
  wrong: { borderColor: colors.danger, backgroundColor: "#FBEAEA" },
  optionText: { fontSize: 15, fontWeight: "600", color: colors.text },
  explanation: { fontSize: 14, lineHeight: 20, color: colors.textMuted },
});
