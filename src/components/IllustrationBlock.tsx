import { StyleSheet, Text, View } from "react-native";
import type { IllustrationPayload } from "../types";
import { colors, radius } from "../ui/theme";
import { BlockCard } from "./BlockCard";

type Props = {
  payload: IllustrationPayload;
};

export function IllustrationBlock({ payload }: Props) {
  return (
    <BlockCard title="Diagram">
      <Text style={styles.title}>{payload.title}</Text>
      <View style={payload.layout === "compare" ? styles.compareRow : styles.column}>
        {payload.labels.map((item, index) => (
          <View key={index} style={[styles.item, payload.layout === "compare" && styles.compareItem]}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{payload.layout === "steps" ? String(index + 1) : item.label.slice(0, 1)}</Text>
            </View>
            <View style={styles.itemText}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>
      {payload.caption ? <Text style={styles.caption}>{payload.caption}</Text> : null}
    </BlockCard>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 17, fontWeight: "600", color: colors.text },
  column: { gap: 10 },
  compareRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  item: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: colors.primaryTint,
    borderRadius: radius.md,
    padding: 12,
  },
  compareItem: { flexBasis: "47%", flexDirection: "column" },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontWeight: "700", color: colors.primaryText },
  itemText: { flex: 1, gap: 2 },
  label: { fontSize: 15, fontWeight: "600", color: colors.text },
  description: { fontSize: 14, lineHeight: 20, color: colors.textMuted },
  caption: { fontSize: 13, color: colors.textMuted, fontStyle: "italic" },
});
