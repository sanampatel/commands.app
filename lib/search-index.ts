import type { SearchEntry } from "@/types";

let indexPromise: Promise<SearchEntry[]> | null = null;

/** Fetch the static search index once per page load (shared by the palette and favorites page). */
export function loadSearchIndex(): Promise<SearchEntry[]> {
  indexPromise ??= fetch("/search-index.json")
    .then((r) => {
      if (!r.ok) throw new Error(`search index: ${r.status}`);
      return r.json() as Promise<SearchEntry[]>;
    })
    .catch((e) => {
      indexPromise = null; // allow a retry next time
      throw e;
    });
  return indexPromise;
}
