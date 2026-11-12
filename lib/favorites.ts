"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Favorites are stored as "<technologyId>/<commandId>" keys in localStorage.
 * Older versions stored bare command ids; those are still honoured by
 * `isFavorite` because command ids are globally unique.
 */
export const FAVORITES_KEY = "commands-app-favorites";

const EMPTY: string[] = [];
const listeners = new Set<() => void>();
let cache: { raw: string | null; value: string[] } = { raw: null, value: EMPTY };

function read(): string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(FAVORITES_KEY);
  } catch {
    return cache.value;
  }
  if (raw === cache.raw) return cache.value;
  let value: string[] = EMPTY;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) value = parsed.filter((x): x is string => typeof x === "string");
  } catch {
    // Corrupted storage: treat as empty rather than crashing the page.
  }
  cache = { raw, value };
  return value;
}

function write(next: string[]) {
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode, quota); keep the in-memory value.
    cache = { raw: cache.raw, value: next };
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === FAVORITES_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function favoriteKey(technologyId: string, commandId: string) {
  return `${technologyId}/${commandId}`;
}

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, read, () => EMPTY);

  const isFavorite = useCallback(
    (technologyId: string, commandId: string) =>
      favorites.includes(favoriteKey(technologyId, commandId)) || favorites.includes(commandId),
    [favorites]
  );

  const toggleFavorite = useCallback((technologyId: string, commandId: string) => {
    const key = favoriteKey(technologyId, commandId);
    const current = read();
    const has = current.includes(key) || current.includes(commandId);
    write(has ? current.filter((f) => f !== key && f !== commandId) : [...current, key]);
  }, []);

  const clearFavorites = useCallback(() => write([]), []);

  return { favorites, isFavorite, toggleFavorite, clearFavorites };
}
