import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { findLesson, markLessonFailed, setLessonContent, type SavedCapability, type SavedLesson, type SavedPath } from "../helpers";
import { usePaths } from "../state/PathsContext";
import { isConnectionError, type LessonRequest } from "./client";
import { generateLesson } from "./routes";

type GetPath = () => SavedPath | null;
type Update = (change: (path: SavedPath) => boolean) => Promise<boolean>;

export type GenerateOutcome = "ready" | "failed" | "offline" | "skipped";


export function buildLessonRequest(path: SavedPath, capability: SavedCapability, lesson: SavedLesson): LessonRequest {
  const order = path.capabilities.indexOf(capability) + 1;
  const outlines = capability.lessons.map((l) => ({ id: l.id, title: l.title, objective: l.objective }));

  const request: LessonRequest = {
    hobby: path.hobby,
    goal: path.goal,
    targetLevel: path.targetLevel,
    currentLevel: path.currentLevel,
    capability: {
      id: capability.id,
      title: capability.title,
      description: capability.description,
      order,
      masteryCriteria: capability.masteryCriteria,
      lessons: outlines,
    },
    lessonOutline: { id: lesson.id, title: lesson.title, objective: lesson.objective },
    lessonId: lesson.id,
    capabilityId: capability.id,
  };
  if (path.currentLevelNote) request.currentLevelNote = path.currentLevelNote;
  return request;
}

const inFlight = new Set<string>();

export async function generateAndSave(lessonId: string, getPath: GetPath, update: Update): Promise<GenerateOutcome> {
  const path = getPath();
  if (!path) return "skipped";
  const found = findLesson(path, lessonId);
  if (!found) return "skipped";
  if (found.lesson.generationStatus === "ready") return "ready";
  if (inFlight.has(lessonId)) return "skipped";

  inFlight.add(lessonId);
  try {
    const content = await generateLesson(buildLessonRequest(path, found.capability, found.lesson));
    const saved = await update((p) => setLessonContent(p, lessonId, content));
    return saved ? "ready" : "failed";
  } catch (err) {
    if (isConnectionError(err)) return "offline";
    await update((p) => markLessonFailed(p, lessonId));
    return "failed";
  } finally {
    inFlight.delete(lessonId);
  }
}

function firstPendingLessonId(path: SavedPath): string | null {
  for (const capability of path.capabilities) {
    for (const lesson of capability.lessons) {
      if (lesson.generationStatus === "pending" && !inFlight.has(lesson.id)) return lesson.id;
    }
  }
  return null;
}

let runningForPathId: string | null = null;

export async function pregenerateLessons(pathId: string, getPath: GetPath, update: Update): Promise<"done" | "offline" | "busy"> {
  if (runningForPathId) return "busy";
  runningForPathId = pathId;
  try {
    while (true) {
      const path = getPath();
      if (!path || path.id !== pathId) return "done";
      const lessonId = firstPendingLessonId(path);
      if (!lessonId) return "done";
      const outcome = await generateAndSave(lessonId, getPath, update);
      if (outcome === "offline") return "offline";
    }
  } finally {
    runningForPathId = null;
  }
}

/** Starts background generation for the active path and resumes it when the app comes back to the foreground. */
export function usePregenerate(): { paused: boolean; start: () => void } {
  const { activePath, getActivePath, updateActivePath } = usePaths();
  const [paused, setPaused] = useState(false);
  const pathId = activePath?.id ?? null;
  const hasPending = activePath ? firstPendingLessonId(activePath) !== null : false;

  async function start() {
    if (!pathId) return;
    const result = await pregenerateLessons(pathId, getActivePath, updateActivePath);
    if (result !== "busy") setPaused(result === "offline");
  }

  useEffect(() => {
    if (pathId && hasPending) start();
  }, [pathId, hasPending]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") start();
    });
    return () => subscription.remove();
  }, [pathId]);

  return { paused: paused && hasPending, start };
}

export function generationProgress(path: SavedPath): { ready: number; failed: number; total: number } {
  let ready = 0;
  let failed = 0;
  let total = 0;
  for (const capability of path.capabilities) {
    for (const lesson of capability.lessons) {
      total++;
      if (lesson.generationStatus === "ready") ready++;
      if (lesson.generationStatus === "failed") failed++;
    }
  }
  return { ready, failed, total };
}
