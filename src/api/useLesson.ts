import { useEffect, useState } from "react";
import type { Lesson } from "../types";
import { findLesson, type SavedLesson } from "../helpers";
import { usePaths } from "../state/PathsContext";
import { generateAndSave, type GenerateOutcome } from "./pregenerate";

export type LessonLoad = {
  saved: SavedLesson | null;
  content: Lesson | null;
  loading: boolean;
  failed: boolean;
  errorMessage: string | null;
  retry: () => void;
};

const OFFLINE_MESSAGE = "You seem to be offline. Connect to the internet and try again. Lessons already prepared still work.";
const FAILED_MESSAGE = "The lesson could not be generated. Please try again.";

export function useLesson(lessonId: string): LessonLoad {
  const { activePath, getActivePath, updateActivePath } = usePaths();
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<GenerateOutcome | null>(null);

  const found = activePath ? findLesson(activePath, lessonId) : null;
  const saved = found ? found.lesson : null;
  const content = saved?.content ?? null;
  const status = saved?.generationStatus ?? null;

  useEffect(() => {
    if (status === null || status === "ready") return;
    // A failed lesson is only fetched again after the user presses retry.
    if (status === "failed" && attempt === 0) return;
    setBusy(true);
    setOutcome(null);
    generateAndSave(lessonId, getActivePath, updateActivePath).then((result) => {
      setOutcome(result);
      setBusy(false);
    });
  }, [lessonId, status, attempt]);

  function retry() {
    setAttempt(attempt + 1);
  }

  const offline = outcome === "offline";
  const failed = !busy && content === null && (status === "failed" || offline);
  let errorMessage: string | null = null;
  if (failed) errorMessage = offline ? OFFLINE_MESSAGE : FAILED_MESSAGE;

  return {
    saved,
    content,
    loading: saved !== null && content === null && !failed,
    failed,
    errorMessage,
    retry,
  };
}
