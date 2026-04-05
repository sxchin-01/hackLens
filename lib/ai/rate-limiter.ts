const LIMIT_KEY = "hacklens_ai_usage";
const MAX_REQUESTS = 5;
const WINDOW_MS = 60_000;

let inMemoryTimestamps: number[] = [];

function readFromStorage(): number[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(LIMIT_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is number => typeof item === "number");
  } catch {
    return [];
  }
}

function writeToStorage(timestamps: number[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(LIMIT_KEY, JSON.stringify(timestamps));
  } catch {
    // Ignore storage write failures.
  }
}

function getActiveTimestamps(now: number): number[] {
  const storage = readFromStorage();
  const merged = [...inMemoryTimestamps, ...storage].filter(
    (time) => now - time < WINDOW_MS
  );

  const uniqueSorted = Array.from(new Set(merged)).sort((a, b) => a - b);
  inMemoryTimestamps = uniqueSorted;
  writeToStorage(uniqueSorted);

  return uniqueSorted;
}

export function canMakeAIRequest(): boolean {
  const now = Date.now();
  const active = getActiveTimestamps(now);

  if (active.length >= MAX_REQUESTS) {
    return false;
  }

  const updated = [...active, now];
  inMemoryTimestamps = updated;
  writeToStorage(updated);
  return true;
}

export function getCooldownTime(): number {
  const now = Date.now();
  const active = getActiveTimestamps(now);

  if (active.length < MAX_REQUESTS) {
    return 0;
  }

  const oldestActive = active[0];
  const remainingMs = WINDOW_MS - (now - oldestActive);
  return Math.max(0, Math.ceil(remainingMs / 1000));
}
