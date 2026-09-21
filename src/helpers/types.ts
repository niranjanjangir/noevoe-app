import type { BlockResult, CurrentLevel, Lesson, TargetLevel } from "../types";

export type CapabilityStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "RETIRED";
export type LessonStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "ABANDONED" | "RETIRED";
export type GenerationStatus = "pending" | "ready" | "failed";

export type SavedLesson = {
  id: string;
  title: string;
  objective: string;
  status: LessonStatus;
  generationStatus: GenerationStatus;
  content?: Lesson;
  results: Record<string, BlockResult>;
};

export type SavedCapability = {
  id: string;
  title: string;
  description: string;
  masteryCriteria: string[];
  status: CapabilityStatus;
  lessons: SavedLesson[];
};

export type SavedPath = {
  id: string;
  hobby: string;
  hobbyDescription?: string;
  goal: string;
  targetLevel: TargetLevel;
  currentLevel: CurrentLevel;
  currentLevelNote?: string;
  capabilities: SavedCapability[];
  createdAt: string;
};

export type PathIndex = {
  activePathId: string | null;
  pathIds: string[];
};

