import { commands } from "@/data";
import type { SearchEntry } from "@/types";

// Built once at build time and served from the CDN. The command palette fetches
// it lazily so the full dataset never ships in the page payload.
export const dynamic = "force-static";

export function GET() {
  const index: SearchEntry[] = commands.map(({ id, name, description, category, technologyId, examples }) => ({
    id,
    name,
    description,
    category,
    technologyId,
    keywords: [...new Set(examples.map((e) => e.description))].join(" · "),
  }));
  return Response.json(index);
}
