import Link from "next/link";
import { GitHubIcon } from "@/components/icons/github";
import { commands, technologies } from "@/data";
import { newIssueUrl, siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="text-muted-foreground container flex flex-col gap-6 py-8 text-sm md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-foreground font-medium">{siteConfig.name}</p>
          <p>
            {commands.length.toLocaleString("en-US")} commands across {technologies.length} technologies. Open source
            under the MIT license.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href="/contributing" className="hover:text-foreground">
            Contribute
          </Link>
          <a href={newIssueUrl("add-command.md")} target="_blank" rel="noreferrer" className="hover:text-foreground">
            Suggest a command
          </a>
          <a href={newIssueUrl("bug-report.md")} target="_blank" rel="noreferrer" className="hover:text-foreground">
            Report an issue
          </a>
          <a
            href={siteConfig.repo}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground inline-flex items-center gap-1.5"
          >
            <GitHubIcon className="h-4 w-4" /> GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
