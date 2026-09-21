import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, BackHandler, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ApiClientError, errorMessage as displayErrorMessage } from "../src/api/client";
import {
  CURRENT_LEVELS,
  CURRENT_LEVEL_LABELS,
  TARGET_LEVELS,
  TARGET_LEVEL_LABELS,
  type CurrentLevel,
  type OnboardingInput,
  type TargetLevel,
} from "../src/types";
import { usePaths } from "../src/state/PathsContext";
import { Button } from "../src/ui/Button";
import { ErrorCard } from "../src/ui/ErrorCard";
import { LevelCard } from "../src/ui/LevelCard";
import { Pill } from "../src/ui/Pill";
import {
  AdvancedHobbyistIcon,
  BackIcon,
  BasicKnowledgeIcon,
  ComfortableHobbyistIcon,
  CompleteBeginnerIcon,
  EnjoyBasicsIcon,
  LearningArtworkIcon,
  SomeExperienceIcon,
} from "../src/ui/icons";
import { colors, radius, spacing, typography } from "../src/ui/theme";
import { generateCurriculum } from "@/src/api/routes";

const EXAMPLES = ["Guitar", "Chess", "Photography", "Baking", "Watercolour", "Gardening"];
const STEP_COUNT = 3;

export default function OnboardingScreen() {
  const router = useRouter();
  const { createPath, findDuplicatePath } = usePaths();

  const [step, setStep] = useState(1);
  const [hobby, setHobby] = useState("");
  const [targetLevel, setTargetLevel] = useState<TargetLevel | null>(null);
  const [currentLevel, setCurrentLevel] = useState<CurrentLevel | null>(null);
  const [note, setNote] = useState("");

  const [generating, setGenerating] = useState(false);
  const [rejectedReason, setRejectedReason] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (generating || step <= 1) return false;
      setStep((currentStep) => currentStep - 1);
      return true;
    });

    return () => subscription.remove();
  }, [generating, step]);

  const hobbyOk = hobby.trim().length >= 3;

  function goBack() {
    if (step > 1) {
      setStep((currentStep) => currentStep - 1);
      return;
    }
    router.back();
  }

  function updateHobby(value: string) {
    setHobby(value);
    setRejectedReason(null);
  }

  function buildInput(): OnboardingInput | null {
    if (!hobbyOk || !targetLevel || !currentLevel) return null;
    const input: OnboardingInput = { hobbyDescription: hobby.trim(), targetLevel, currentLevel };
    if (note.trim().length > 0) input.currentLevelNote = note.trim();
    return input;
  }

  async function generate() {
    const input = buildInput();
    if (!input) return;

    const duplicatePath = await findDuplicatePath(input);
    if (duplicatePath) {
      setRejectedReason("You already have a path with these choices.");
      setStep(1);
      return;
    }

    setGenerating(true);
    setErrorMessage(null);
    setRejectedReason(null);
    try {
      const curriculum = await generateCurriculum(input);
      const path = await createPath(curriculum, input);
      if (!path) {
        setErrorMessage("Your path was created but could not be saved on this device.");
        return;
      }
      router.push("/path");
    } catch (err) {
      if (err instanceof ApiClientError && err.code === "rejected") {
        setRejectedReason(err.message);
        setStep(1);
      } else {
        setErrorMessage(displayErrorMessage(err));
      }
    } finally {
      setGenerating(false);
    }
  }

  if (generating) {
    return (
      <View style={styles.centered} testID="onboarding-loading">
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={typography.heading}>Building your path…</Text>
        <Text style={typography.caption}>This usually takes under a minute.</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.centered}>
        <ErrorCard message={errorMessage} onRetry={generate} secondaryLabel="Back" onSecondary={() => setErrorMessage(null)} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Pressable onPress={goBack} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back">
              <BackIcon />
            </Pressable>
          ),
        }}
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <StepProgress step={step} />
          {step === 1 && <OnboardingArtwork />}

          {step === 1 && (
            <View style={styles.section}>
              <Text style={typography.title}>What do you want to learn?</Text>
              <TextInput
                value={hobby}
                onChangeText={updateHobby}
                placeholder="e.g. photography, so I can take good pictures on travel"
                placeholderTextColor={colors.textFaint}
                multiline
                scrollEnabled
                style={styles.input}
                testID="hobby-input"
              />
              {rejectedReason && <Text style={styles.rejected}>Previous request could not be completed: {rejectedReason}</Text>}
              <View style={styles.pills}>
                {EXAMPLES.map((example) => (
                  <Pill key={example} label={example} onPress={() => updateHobby(example)} />
                ))}
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.section}>
              <Text style={typography.title}>How far do you want to go?</Text>
              {TARGET_LEVELS.map((level) => (
                <LevelCard
                  key={level}
                  title={TARGET_LEVEL_LABELS[level].title}
                  description={TARGET_LEVEL_LABELS[level].description}
                  selected={targetLevel === level}
                  onPress={() => setTargetLevel(level)}
                  icon={<LevelIcon kind={level} />}
                  testID={`target-${level}`}
                />
              ))}
            </View>
          )}

          {step === 3 && (
            <View style={styles.section}>
              <Text style={typography.title}>Where are you now?</Text>
              {CURRENT_LEVELS.map((level) => (
                <LevelCard
                  key={level}
                  title={CURRENT_LEVEL_LABELS[level].title}
                  description={CURRENT_LEVEL_LABELS[level].description}
                  selected={currentLevel === level}
                  onPress={() => setCurrentLevel(level)}
                  icon={<LevelIcon kind={level} />}
                  testID={`current-${level}`}
                />
              ))}
              <Text style={styles.noteLabel}>Anything else we should know? (optional)</Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="e.g. For chess: I know basic moves, but struggle in a match"
                placeholderTextColor={colors.textFaint}
                multiline
                scrollEnabled
                maxLength={300}
                style={styles.input}
                testID="note-input"
              />
            </View>
          )}

          <View style={styles.buttons}>
            {step > 1 && <Button label="Back" kind="secondary" onPress={goBack} />}
            {step === 1 && <Button label="Next" onPress={() => setStep(2)} disabled={!hobbyOk} testID="next-1" />}
            {step === 2 && <Button label="Next" onPress={() => setStep(3)} disabled={!targetLevel} testID="next-2" />}
            {step === 3 && <Button label="Build my path" onPress={generate} disabled={!currentLevel} testID="generate" />}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

function StepProgress({ step }: { step: number }) {
  return (
    <View style={styles.progressBlock} accessibilityLabel={`Step ${step} of ${STEP_COUNT}`}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>Step</Text>
        <Text style={styles.progressCount}>{step} / {STEP_COUNT}</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${(step / STEP_COUNT) * 100}%` }]} />
      </View>
    </View>
  );
}

function OnboardingArtwork() {
  return (
    <View style={styles.artworkBlock}>
      <LearningArtworkIcon />
    </View>
  );
}

function LevelIcon({ kind }: { kind: TargetLevel | CurrentLevel }) {
  switch (kind) {
    case "complete_beginner":
      return <CompleteBeginnerIcon />;
    case "basic_knowledge":
      return <BasicKnowledgeIcon />;
    case "some_experience":
      return <SomeExperienceIcon />;
    case "enjoy_basics":
      return <EnjoyBasicsIcon />;
    case "comfortable_hobbyist":
      return <ComfortableHobbyistIcon />;
    default:
      return <AdvancedHobbyistIcon />;
  }
}

const styles = StyleSheet.create({
  keyboardAvoidingView: { flex: 1 },
  container: { padding: spacing.xl, gap: spacing.sm, backgroundColor: colors.background, flexGrow: 1 },
  centered: { flex: 1, padding: spacing.xl, justifyContent: "center", alignItems: "center", gap: spacing.md, backgroundColor: colors.background },
  section: { gap: spacing.md },
  input: {
    ...typography.body,
    height: 88,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    textAlignVertical: "top",
  },
  rejected: { ...typography.caption, color: colors.danger },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  noteLabel: { ...typography.caption, marginTop: spacing.sm },
  buttons: { width: "100%", gap: spacing.sm, marginTop: "auto" },
  progressBlock: { gap: spacing.sm },
  progressHeader: { flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 8 },
  progressLabel: { ...typography.caption, fontWeight: "700", color: colors.text },
  progressCount: { ...typography.caption, color: colors.accent, fontWeight: "700" },
  progressTrack: { height: 8, overflow: "hidden", borderRadius: radius.sm, backgroundColor: colors.border },
  progressFill: { height: "100%", borderRadius: radius.sm, backgroundColor: colors.primary },
  artworkBlock: { alignItems: "center", width: "100%", maxWidth: 420, gap: spacing.sm, marginTop: -spacing.xxl },
  artworkCaption: { ...typography.heading, textAlign: "center", color: colors.textMuted },
});
