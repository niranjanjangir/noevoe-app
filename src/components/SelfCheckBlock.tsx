import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { BlockResult, SelfCheckPayload } from "../types";
import { Button } from "../ui/Button";
import { CheckIcon } from "../ui/icons";
import { colors, radius } from "../ui/theme";
import { BlockCard } from "./BlockCard";

type Props = {
  blockId: string;
  payload: SelfCheckPayload;
  result?: BlockResult;
  onResult: (result: BlockResult) => void;
};

export function SelfCheckBlock({ blockId, payload, result, onResult }: Props) {
  const done = result?.status === "completed";
  const [checked, setChecked] = useState<boolean[]>(payload.checklist.map(() => done));

  const allChecked = checked.every((value) => value);

  function toggle(index: number) {
    if (done) return;
    const next = [...checked];
    next[index] = !next[index];
    setChecked(next);
  }

  function finish() {
    onResult({ blockId, status: "completed", at: new Date().toISOString() });
  }

  return (
    <BlockCard title="Check yourself" accent="none">
      <Text style={styles.prompt}>{payload.prompt}</Text>
      <View style={styles.list}>
        {payload.checklist.map((item, index) => (
          <Pressable key={index} onPress={() => toggle(index)} accessibilityRole="checkbox" accessibilityState={{ checked: checked[index] }} style={styles.row}>
            <View style={[styles.box, checked[index] && styles.boxChecked]}>{checked[index] ? <CheckIcon size={14} color={colors.primaryText} /> : null}</View>
            <Text style={styles.item}>{item}</Text>
          </Pressable>
        ))}
      </View>
      {done ? (
        <View style={styles.done}>
          <CheckIcon color={colors.success} />
          <Text style={styles.doneText}>Done</Text>
        </View>
      ) : <Button label="Done" onPress={finish} disabled={!allChecked} testID="self-check-done" />}
    </BlockCard>
  );
}

const styles = StyleSheet.create({
  prompt: { fontSize: 16, lineHeight: 24, color: colors.text, fontWeight: "500" },
  list: { gap: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  box: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  boxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  item: { flex: 1, fontSize: 15, lineHeight: 22, color: colors.text },
  done: { flexDirection: "row", alignItems: "center", gap: 4, },
  doneText: { fontSize: 15, fontWeight: "600", color: colors.success },
});
