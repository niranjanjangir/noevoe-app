import { useEffect, useState } from "react";

// How long the "you're offline" banner stays up after a failed request.
const NOTICE_MS = 5_000;

let lastFailureAt = 0;
const listeners = new Set<() => void>();

/** Called by the API client whenever the server could not be reached. */
export function noteNetworkFailure(): void {
  lastFailureAt = Date.now();
  for (const listener of listeners) listener();
}

export function recentlyOffline(): boolean {
  return Date.now() - lastFailureAt < NOTICE_MS;
}

export function useRecentlyOffline(): boolean {
  const [offline, setOffline] = useState(recentlyOffline());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    function onFailure() {
      setOffline(true);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setOffline(false), NOTICE_MS);
    }
    listeners.add(onFailure);
    return () => {
      listeners.delete(onFailure);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return offline;
}
