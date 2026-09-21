import type { SavedCapability, SavedLesson, SavedPath } from "./types";

export type PathProgress = {
  completed: number;
  active: number;
  retired: number;
  ratio: number;
  currentCapability: SavedCapability | null;
  nextLesson: SavedLesson | null;
};

export function pathProgress(path: SavedPath): PathProgress {
  let completed = 0;
  let retired = 0;
  let currentCapability: SavedCapability | null = null;

  for (const capability of path.capabilities) {
    if (capability.status === "RETIRED") {
      retired++;
      continue;
    }
    if (capability.status === "COMPLETED") {
      completed++;
      continue;
    }
    if (currentCapability === null) currentCapability = capability;
  }

  const active = path.capabilities.length - retired;
  const ratio = active === 0 ? 0 : completed / active;
  const nextLesson = currentCapability ? nextLessonIn(currentCapability) : null;

  return { completed, active, retired, ratio, currentCapability, nextLesson };
}

export function nextLessonIn(capability: SavedCapability): SavedLesson | null {
  for (const lesson of capability.lessons) {
    if (lesson.status === "IN_PROGRESS") return lesson;
  }
  for (const lesson of capability.lessons) {
    if (lesson.status === "NOT_STARTED" || lesson.status === "ABANDONED") return lesson;
  }
  return null;
}

export function capabilityProgress(capability: SavedCapability): { done: number; total: number } {
  let done = 0;
  let total = 0;
  for (const lesson of capability.lessons) {
    if (lesson.status === "RETIRED") continue;
    total++;
    if (lesson.status === "COMPLETED") done++;
  }
  return { done, total };
}
