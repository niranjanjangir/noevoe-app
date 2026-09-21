import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Curriculum, OnboardingInput } from "../types";
import {
  createPathFromCurriculum,
  deletePath as deletePathFromStorage,
  loadIndex,
  loadPath,
  saveIndex,
  savePath,
  type PathIndex,
  type SavedPath,
} from "../helpers";

type PathsState = {
  loading: boolean;
  index: PathIndex;
  activePath: SavedPath | null;
  saveError: string | null;
  getActivePath: () => SavedPath | null;
  findDuplicatePath: (input: OnboardingInput) => Promise<SavedPath | null>;
  createPath: (curriculum: Curriculum, input: OnboardingInput) => Promise<SavedPath | null>;
  updateActivePath: (change: (path: SavedPath) => boolean) => Promise<boolean>;
  switchPath: (pathId: string) => Promise<boolean>;
  deletePath: (pathId: string) => Promise<boolean>;
  reload: () => Promise<void>;
};

const PathsContext = createContext<PathsState | null>(null);

export function PathsProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState<PathIndex>({ activePathId: null, pathIds: [] });
  const [activePath, setActivePathState] = useState<SavedPath | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // The ref always holds the newest path, even inside functions created by an older render.
  const activePathRef = useRef<SavedPath | null>(null);
  // Updates wait for the previous one to finish, so two saves never race.
  const updateQueue = useRef<Promise<unknown>>(Promise.resolve());

  function setActivePath(path: SavedPath | null) {
    activePathRef.current = path;
    setActivePathState(path);
  }

  function getActivePath(): SavedPath | null {
    return activePathRef.current;
  }

  async function findDuplicatePath(input: OnboardingInput): Promise<SavedPath | null> {
    const currentIndex = await loadIndex();
    const paths = await Promise.all(currentIndex.pathIds.map((pathId) => loadPath(pathId)));
    for (const path of paths) {
      if (
        path &&
        (path.hobbyDescription ?? path.hobby) === input.hobbyDescription &&
        path.targetLevel === input.targetLevel &&
        path.currentLevel === input.currentLevel &&
        path.currentLevelNote === input.currentLevelNote
      ) {
        return path;
      }
    }
    return null;
  }

  async function reload() {
    const loadedIndex = await loadIndex();
    setIndex(loadedIndex);
    if (loadedIndex.activePathId) {
      setActivePath(await loadPath(loadedIndex.activePathId));
    } else {
      setActivePath(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    reload();
  }, []);

  async function createPath(curriculum: Curriculum, input: OnboardingInput): Promise<SavedPath | null> {
    const path = createPathFromCurriculum(curriculum, input);
    const savedPathOk = await savePath(path);
    if (!savedPathOk) {
      setSaveError("Could not save your new learning path.");
      return null;
    }
    const nextIndex: PathIndex = { activePathId: path.id, pathIds: [...index.pathIds, path.id] };
    const savedIndexOk = await saveIndex(nextIndex);
    if (!savedIndexOk) {
      setSaveError("Could not save your new learning path.");
      return null;
    }
    setIndex(nextIndex);
    setActivePath(path);
    setSaveError(null);
    return path;
  }

  async function applyChange(change: (path: SavedPath) => boolean): Promise<boolean> {
    const current = activePathRef.current;
    if (!current) return false;
    const copy: SavedPath = JSON.parse(JSON.stringify(current));
    const changed = change(copy);
    if (!changed) return false;

    const saved = await savePath(copy);
    if (!saved) {
      setSaveError("Could not save your progress. Please try again.");
      return false;
    }
    setActivePath(copy);
    setSaveError(null);
    return true;
  }

  function updateActivePath(change: (path: SavedPath) => boolean): Promise<boolean> {
    const run = updateQueue.current.then(() => applyChange(change));
    updateQueue.current = run.catch(() => false);
    return run;
  }

  async function switchPath(pathId: string): Promise<boolean> {
    const path = await loadPath(pathId);
    if (!path) return false;
    const nextIndex: PathIndex = { ...index, activePathId: pathId };
    const saved = await saveIndex(nextIndex);
    if (!saved) return false;
    setIndex(nextIndex);
    setActivePath(path);
    return true;
  }

  async function deletePath(pathId: string): Promise<boolean> {
    const removed = await deletePathFromStorage(pathId);
    if (!removed) return false;

    const remaining: string[] = [];
    for (const id of index.pathIds) {
      if (id !== pathId) remaining.push(id);
    }
    const nextActiveId = index.activePathId === pathId ? (remaining.length > 0 ? remaining[remaining.length - 1]! : null) : index.activePathId;
    const nextIndex: PathIndex = { activePathId: nextActiveId, pathIds: remaining };
    const saved = await saveIndex(nextIndex);
    if (!saved) return false;

    setIndex(nextIndex);
    setActivePath(nextActiveId ? await loadPath(nextActiveId) : null);
    return true;
  }

  const value: PathsState = {
    loading,
    index,
    activePath,
    saveError,
    getActivePath,
    findDuplicatePath,
    createPath,
    updateActivePath,
    switchPath,
    deletePath,
    reload,
  };
  return <PathsContext.Provider value={value}>{children}</PathsContext.Provider>;
}

export function usePaths(): PathsState {
  const value = useContext(PathsContext);
  if (!value) throw new Error("usePaths must be used inside PathsProvider");
  return value;
}
