import { StyleSheet, Text, View } from "react-native";
import type { BlockResult, PracticePayload } from "../types";
import { Button } from "../ui/Button";
import { CheckIcon } from "../ui/icons";
import { colors } from "../ui/theme";
import { BlockCard } from "./BlockCard";

type Props = {
  blockId: string;
  payload: PracticePayload;
  result?: BlockResult;
  onResult: (result: BlockResult) => void;
};

export function PracticeBlock({ blockId, payload, result, onResult }: Props) {
  const done = result?.status === "completed";

  const details: string[] = [];
  if (payload.durationMinutes) details.push("About " + payload.durationMinutes + " min");
  if (payload.repetitions) details.push(payload.repetitions + (payload.repetitions === 1 ? " time" : " times"));

  function markDone() {
    onResult({ blockId, status: "completed", at: new Date().toISOString() });
  }

  return (
    <BlockCard title="Try it" accent={"tip"}>
      <Text style={styles.instruction}>{payload.instruction}</Text>
      {details.length > 0 ? <Text style={styles.details}>{details.join(" · ")}</Text> : null}
      <View style={styles.criterion}>
        <Text style={styles.criterionLabel}>You did it when</Text>
        <Text style={styles.criterionText}>{payload.successCriterion}</Text>
      </View>
      {done ? (
        <View style={styles.done}>
          <CheckIcon color={colors.success} />
          <Text style={styles.doneText}>Done</Text>
        </View>
      ) : <Button label="I did this" onPress={markDone} testID={"practice-done-" + blockId} />}
    </BlockCard>
  );
}

const styles = StyleSheet.create({
  instruction: { fontSize: 16, lineHeight: 24, color: colors.text },
  details: { fontSize: 13, color: colors.textMuted },
  criterion: { gap: 2 },
  criterionLabel: { fontSize: 12, fontWeight: "600", color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.5 },
  criterionText: { fontSize: 15, lineHeight: 22, color: colors.text },
  done: { flexDirection: "row", alignItems: "center", gap: 4 },
  doneText: { fontSize: 15, fontWeight: "600", color: colors.success },
});
