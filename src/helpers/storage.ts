import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PathIndex, SavedPath } from "./types";

const INDEX_KEY = "noevoe:index";

function pathKey(pathId: string): string {
  return "noevoe:path:" + pathId;
}

export async function loadIndex(): Promise<PathIndex> {
  try {
    const raw = await AsyncStorage.getItem(INDEX_KEY);
    if (raw === null) return { activePathId: null, pathIds: [] };
    return JSON.parse(raw) as PathIndex;
  } catch {
    return { activePathId: null, pathIds: [] };
  }
}

export async function saveIndex(index: PathIndex): Promise<boolean> {
  try {
    await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(index));
    return true;
  } catch {
    return false;
  }
}

export async function loadPath(pathId: string): Promise<SavedPath | null> {
  try {
    const raw = await AsyncStorage.getItem(pathKey(pathId));
    if (raw === null) return null;
    return JSON.parse(raw) as SavedPath;
  } catch {
    return null;
  }
}


export async function savePath(path: SavedPath): Promise<boolean> {
  try {
    await AsyncStorage.setItem(pathKey(path.id), JSON.stringify(path));
    return true;
  } catch {
    return false;
  }
}

export async function deletePath(pathId: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(pathKey(pathId));
    return true;
  } catch {
    return false;
  }
}
