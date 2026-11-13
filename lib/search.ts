import Fuse, { type Expression } from "fuse.js";

export interface SearchKey {
  name: string;
  weight: number;
}

/** Fuse results scoring worse than this are noise (e.g. "ecr" fuzzily matching every "ec2"). */
const MAX_SCORE = 0.35;

/**
 * Builds a search function over commands that:
 * - matches every word of a multi-word query somewhere ("undo commit" finds `git reset`
 *   via its example "Undo last commit"), instead of fuzzy-matching the whole phrase;
 * - drops weak fuzzy matches;
 * - ranks exact / prefix / whole-word name matches first ("tar" → `tar`, not `docker start`).
 */
export function createCommandSearch<T extends { name: string }>(items: T[], keys: SearchKey[]) {
  const fuse = new Fuse(items, {
    keys,
    threshold: 0.3,
    ignoreLocation: true,
    // Long fields (example descriptions) shouldn't be penalised for being long.
    ignoreFieldNorm: true,
    includeScore: true,
  });

  return function search(query: string, limit?: number): T[] {
    const q = query.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return [];

    const results =
      tokens.length === 1
        ? fuse.search(tokens[0])
        : fuse.search({
            $and: tokens.map((token): Expression => ({ $or: keys.map((k) => ({ [k.name]: token })) })),
          });

    const ranked = results
      .filter((r) => (r.score ?? 1) <= MAX_SCORE)
      .map((r) => ({ item: r.item, rank: (r.score ?? 1) - nameBonus(r.item.name.toLowerCase(), q) }))
      .sort((a, b) => a.rank - b.rank)
      .map((r) => r.item);

    return limit ? ranked.slice(0, limit) : ranked;
  };
}

function nameBonus(name: string, query: string) {
  if (name === query) return 1;
  if (name.startsWith(query)) return 0.5;
  if (name.split(/[\s\-:/]+/).includes(query)) return 0.3;
  return 0;
}
