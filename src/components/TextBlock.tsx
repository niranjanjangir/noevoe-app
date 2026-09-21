import { StyleSheet, Text, View } from "react-native";
import type { TextPayload } from "../types";
import { colors } from "../ui/theme";
import { BlockCard } from "./BlockCard";

type Props = {
  payload: TextPayload;
};

export function TextBlock({ payload }: Props) {
  const paragraphs = payload.markdown.split(/\n\s*\n/);
  const title = payload.emphasis === "tip" ? "Tip" : payload.emphasis === "warning" ? "Watch out" : undefined;

  return (
    <BlockCard title={title} accent={payload.emphasis}>
      {paragraphs.map((paragraph, index) => (
        <Paragraph key={index} text={paragraph.trim()} />
      ))}
    </BlockCard>
  );
}

function Paragraph({ text }: { text: string }) {
  const normalizedText = text.replace(/^#{1,6}\s+/gm, "");
  const lines = normalizedText.split("\n");
  const isBulletList = lines.every((line) => line.trim().startsWith("- "));

  if (isBulletList) {
    return (
      <View style={styles.list}>
        {lines.map((line, index) => (
          <View key={index} style={styles.bulletRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.body}>{withBold(line.trim().slice(2))}</Text>
          </View>
        ))}
      </View>
    );
  }
  return <Text style={styles.body}>{withBold(normalizedText)}</Text>;
}

function withBold(text: string) {
  const parts = text.split("**");
  return parts.map((part, index) => {
    const isBold = index % 2 === 1;
    return isBold ? (
      <Text key={index} style={styles.bold}>
        {part}
      </Text>
    ) : (
      part
    );
  });
}

const styles = StyleSheet.create({
  body: { fontSize: 16, lineHeight: 24, color: colors.text, flex: 1 },
  bold: { fontWeight: "700" },
  list: { gap: 6 },
  bulletRow: { flexDirection: "row", gap: 8 },
  bullet: { fontSize: 16, lineHeight: 24, color: colors.accent },
});
