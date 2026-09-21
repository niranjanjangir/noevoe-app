import { Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import type { VideoPayload } from "../types";
import { colors, radius } from "../ui/theme";
import { BlockCard } from "./BlockCard";

type Props = {
  payload: VideoPayload;
};

const YOUTUBE_PATTERNS = [
  /^https:\/\/(?:www\.|m\.)?youtube\.com\/watch\?(?:.*&)?v=([A-Za-z0-9_-]{11})(?:[&#].*)?$/,
  /^https:\/\/(?:www\.)?youtube\.com\/shorts\/([A-Za-z0-9_-]{11})(?:[?#].*)?$/,
  /^https:\/\/youtu\.be\/([A-Za-z0-9_-]{11})(?:[?#].*)?$/,
];

export function extractYouTubeId(url: string): string | null {
  for (const regExp of YOUTUBE_PATTERNS) {
    const match = regExp.exec(url.trim());
    if (match?.[1]) return match[1];
  }
  return null;
}

export function VideoBlock({ payload }: Props) {
  const id = extractYouTubeId(payload.url);
  const thumbnail = id ? "https://img.youtube.com/vi/" + id + "/hqdefault.jpg" : null;

  return (
    <BlockCard title="Watch">
      <Pressable onPress={() => Linking.openURL(payload.url)} accessibilityRole="link" style={styles.card}>
        {thumbnail ? <Image source={{ uri: thumbnail }} style={styles.thumb} /> : <View style={[styles.thumb, styles.thumbFallback]} />}
        <View style={styles.play}>
          <Text style={styles.playText}>▶</Text>
        </View>
      </Pressable>
      <Text style={styles.title}>{payload.title}</Text>
      <Text style={styles.why}>{payload.whyUseful}</Text>
      <Text style={styles.hint}>Opens in YouTube</Text>
    </BlockCard>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.md, overflow: "hidden", position: "relative" },
  thumb: { width: "100%", aspectRatio: 16 / 9, backgroundColor: colors.surfaceMuted },
  thumbFallback: { backgroundColor: colors.border },
  play: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -24,
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  playText: { color: colors.primaryText, fontSize: 18, marginLeft: 3 },
  title: { fontSize: 16, fontWeight: "600", color: colors.text },
  why: { fontSize: 14, lineHeight: 20, color: colors.textMuted },
  hint: { fontSize: 12, color: colors.textFaint },
});
