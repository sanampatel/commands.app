import { getCommandsByTechnology, technologies } from "@/data";

// Static per-technology JSON (e.g. /data/git) used by the compare page, and handy
// for anyone who wants to consume the dataset programmatically.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return technologies.map((t) => ({ technology: t.id }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ technology: string }> }) {
  const { technology } = await params;
  return Response.json(getCommandsByTechnology(technology));
}
