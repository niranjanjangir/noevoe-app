import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { BlockResult, MultipleChoicePayload } from "../types";
import { colors, radius } from "../ui/theme";
import { BlockCard } from "./BlockCard";

type Props = {
  blockId: string;
  payload: MultipleChoicePayload;
  result?: BlockResult;
  onResult: (result: BlockResult) => void;
};

export function MultipleChoiceBlock({ blockId, payload, result, onResult }: Props) {
  const alreadyCorrect = result?.status === "success";
  const [chosenId, setChosenId] = useState<string | null>(alreadyCorrect ? payload.correctOptionId : null);
  const [attempts, setAttempts] = useState(result?.attempts ?? 0);

  const answered = chosenId !== null;
  const isCorrect = chosenId === payload.correctOptionId;

  function choose(optionId: string) {
    if (isCorrect) return;
    const nextAttempts = attempts + 1;
    setChosenId(optionId);
    setAttempts(nextAttempts);
    onResult({
      blockId,
      status: optionId === payload.correctOptionId ? "success" : "incorrect",
      attempts: nextAttempts,
      detail: { optionId },
      at: new Date().toISOString(),
    });
  }

  return (
    <BlockCard title="Quick check" accent="none">
      <Text style={styles.question}>{payload.question}</Text>
      <View style={styles.options}>
        {payload.options.map((option) => {
          const isChosen = option.id === chosenId;
          const showCorrect = answered && option.id === payload.correctOptionId;
          const showWrong = isChosen && !isCorrect;
          return (
            <Pressable
              key={option.id}
              onPress={() => choose(option.id)}
              disabled={isCorrect}
              accessibilityRole="button"
              style={[styles.option, showCorrect && styles.correct, showWrong && styles.wrong]}
            >
              <Text style={styles.optionText}>{option.text}</Text>
            </Pressable>
          );
        })}
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
  question: { fontSize: 16, lineHeight: 24, color: colors.text, fontWeight: "500" },
  options: { gap: 8 },
  option: {
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  correct: { borderColor: colors.success, backgroundColor: "#E9F7EE" },
  wrong: { borderColor: colors.danger, backgroundColor: "#FBEAEA" },
  optionText: { fontSize: 15, color: colors.text },
  explanation: { fontSize: 14, lineHeight: 20, color: colors.textMuted },
});
