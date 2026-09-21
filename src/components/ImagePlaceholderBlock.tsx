import { StyleSheet, Text, View } from "react-native";
import type { ImagePayload } from "../types";
import { colors, radius } from "../ui/theme";
import { BlockCard } from "./BlockCard";

type Props = {
  payload: ImagePayload;
};

export function ImagePlaceholderBlock({ payload }: Props) {
  return (
    <BlockCard title="Picture">
      <View style={styles.box}>
        <Text style={styles.alt}>{payload.alt}</Text>
      </View>
      {payload.caption ? <Text style={styles.caption}>{payload.caption}</Text> : null}
    </BlockCard>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  alt: { fontSize: 14, color: colors.textMuted, textAlign: "center", fontStyle: "italic" },
  caption: { fontSize: 13, color: colors.textMuted },
});
