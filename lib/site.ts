export const siteConfig = {
  name: "Commands.app",
  title: "Commands.app - Your Command Line Cheat Sheet",
  description:
    "Searchable command line cheat sheets for Linux, Git, Docker, Kubernetes, Terraform, AWS, databases, package managers and more.",
  // Canonical domain, used for the sitemap, canonical URLs and Open Graph.
  // NEXT_PUBLIC_SITE_URL can override it (e.g. for a staging deployment).
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://commands.app").replace(/\/$/, ""),
  repo: "https://github.com/sanampatel/commands.app",
  branch: "main",
} as const;

export function editOnGitHubUrl(technologyId: string): string {
  return `${siteConfig.repo}/edit/${siteConfig.branch}/data/commands/${technologyId}.json`;
}

export function newIssueUrl(template: string, title?: string): string {
  const params = new URLSearchParams({ template });
  if (title) params.set("title", title);
  return `${siteConfig.repo}/issues/new?${params.toString()}`;
}
