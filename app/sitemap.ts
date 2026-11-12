import type { MetadataRoute } from "next";
import { commands, technologies } from "@/data";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/compare`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/contributing`, changeFrequency: "monthly", priority: 0.3 },
    ...technologies.map((t) => ({
      url: `${base}/${t.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...commands.map((c) => ({
      url: `${base}/${c.technologyId}/${c.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
