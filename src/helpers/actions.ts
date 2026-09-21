import type { BlockResult, Curriculum, Lesson, OnboardingInput } from "../types";
import type { SavedCapability, SavedLesson, SavedPath } from "./types";

function findCapability(path: SavedPath, capabilityId: string): SavedCapability | null {
  for (const capability of path.capabilities) {
    if (capability.id === capabilityId) return capability;
  }
  return null;
}

export function findLesson(path: SavedPath, lessonId: string): { capability: SavedCapability; lesson: SavedLesson } | null {
  for (const capability of path.capabilities) {
    for (const lesson of capability.lessons) {
      if (lesson.id === lessonId) return { capability, lesson };
    }
  }
  return null;
}

export function createPathFromCurriculum(curriculum: Curriculum, input: OnboardingInput): SavedPath {
  const sorted = [...curriculum.capabilities].sort((a, b) => a.order - b.order);
  const capabilities: SavedCapability[] = [];

  for (const cap of sorted) {
    const lessons: SavedLesson[] = [];
    for (const outline of cap.lessons) {
      lessons.push({
        id: newId("lesson"),
        title: outline.title,
        objective: outline.objective,
        status: "NOT_STARTED",
        generationStatus: "pending",
        results: {},
      });
    }
    capabilities.push({
      id: newId("cap"),
      title: cap.title,
      description: cap.description,
      masteryCriteria: cap.masteryCriteria,
      status: "NOT_STARTED",
      lessons,
    });
  }

  const path: SavedPath = {
    id: newId("path"),
    hobby: curriculum.hobby,
    hobbyDescription: input.hobbyDescription,
    goal: curriculum.goal,
    targetLevel: input.targetLevel,
    currentLevel: input.currentLevel,
    currentLevelNote: input.currentLevelNote,
    capabilities,
    createdAt: now(),
  };
  return path;
}

export function setLessonContent(path: SavedPath, lessonId: string, content: Lesson): boolean {
  const found = findLesson(path, lessonId);
  if (!found) return false;
  found.lesson.content = content;
  found.lesson.generationStatus = "ready";
  return true;
}

export function markLessonFailed(path: SavedPath, lessonId: string): boolean {
  const found = findLesson(path, lessonId);
  if (!found) return false;
  if (found.lesson.generationStatus === "ready") return false;
  found.lesson.generationStatus = "failed";
  return true;
}

export function startLesson(path: SavedPath, lessonId: string): boolean {
  const found = findLesson(path, lessonId);
  if (!found) return false;
  const { capability, lesson } = found;
  if (lesson.status === "COMPLETED" || lesson.status === "RETIRED") return false;

  lesson.status = "IN_PROGRESS";
  if (capability.status === "NOT_STARTED") capability.status = "IN_PROGRESS";
  return true;
}

export function recordBlockResult(path: SavedPath, lessonId: string, result: BlockResult): boolean {
  const found = findLesson(path, lessonId);
  if (!found) return false;
  found.lesson.results[result.blockId] = result;
  return true;
}

export function isLessonComplete(lesson: SavedLesson): boolean {
  if (!lesson.content) return false;
  for (const blockId of lesson.content.completionCriteria.requiredBlockIds) {
    const result = lesson.results[blockId];
    if (!result) return false;
    if (result.status !== "success" && result.status !== "completed") return false;
  }
  return true;
}

export function completeLesson(path: SavedPath, lessonId: string): boolean {
  const found = findLesson(path, lessonId);
  if (!found) return false;
  const { capability, lesson } = found;
  if (lesson.status === "COMPLETED" || lesson.status === "RETIRED") return false;

  lesson.status = "COMPLETED";

  if (allActiveLessonsDone(capability)) {
    capability.status = "COMPLETED";
  }
  return true;
}

function allActiveLessonsDone(capability: SavedCapability): boolean {
  let completedCount = 0;
  for (const lesson of capability.lessons) {
    if (lesson.status === "RETIRED") continue;
    if (lesson.status !== "COMPLETED") return false;
    completedCount++;
  }
  return completedCount > 0;
}

export function abandonLesson(path: SavedPath, lessonId: string): boolean {
  const found = findLesson(path, lessonId);
  if (!found) return false;
  if (found.lesson.status !== "IN_PROGRESS") return false;

  found.lesson.status = "ABANDONED";
  return true;
}

export function retireLesson(path: SavedPath, lessonId: string): boolean {
  const found = findLesson(path, lessonId);
  if (!found) return false;
  const { capability, lesson } = found;
  if (lesson.status === "COMPLETED" || lesson.status === "RETIRED") return false;

  lesson.status = "RETIRED";

  if (capability.status !== "RETIRED" && allActiveLessonsDone(capability)) {
    capability.status = "COMPLETED";
  }
  return true;
}

export function restoreLesson(path: SavedPath, lessonId: string): boolean {
  const found = findLesson(path, lessonId);
  if (!found) return false;
  const { capability, lesson } = found;
  if (lesson.status !== "RETIRED") return false;

  lesson.status = "NOT_STARTED";
  if (capability.status === "COMPLETED") capability.status = "IN_PROGRESS";
  return true;
}

export function retireCapability(path: SavedPath, capabilityId: string): boolean {
  const capability = findCapability(path, capabilityId);
  if (!capability) return false;
  if (capability.status === "COMPLETED" || capability.status === "RETIRED") return false;

  capability.status = "RETIRED";
  return true;
}


export function restoreCapability(path: SavedPath, capabilityId: string): boolean {
  const capability = findCapability(path, capabilityId);
  if (!capability) return false;
  if (capability.status !== "RETIRED") return false;

  let anyStarted = false;
  for (const lesson of capability.lessons) {
    if (lesson.status !== "NOT_STARTED" && lesson.status !== "RETIRED") anyStarted = true;
  }
  capability.status = anyStarted ? "IN_PROGRESS" : "NOT_STARTED";
  return true;
}

function now(): string {
  return new Date().toISOString();
}

function newId(prefix: string): string {
  let token = "";
  for (let i = 0; i < 12; i++) {
    token += Math.floor(Math.random() * 36).toString(36);
  }
  return prefix + "_" + token;
}
