import Link from "next/link";
import { ArrowRight, Copy, Keyboard, Search, Star } from "lucide-react";
import { commands, getCommand, getCommandsByTechnology, getTechnologiesByGroup, technologies } from "@/data";
import { TechIcon } from "@/components/tech-icon";
import { HeroSearch } from "@/components/hero-search";

// Hand-picked commands people look up most often. Missing ids are skipped.
const POPULAR: [technologyId: string, commandId: string][] = [
  ["git", "git-reset"],
  ["git", "git-stash"],
  ["linux", "find"],
  ["linux", "tar"],
  ["docker", "docker-exec"],
  ["kubernetes", "kubectl-logs"],
  ["ssh", "ssh-keygen"],
  ["postgresql", "pg-dump"],
  ["linux", "grep"],
  ["git", "git-rebase"],
  ["docker", "docker-compose-up"],
  ["vim", "vim-write-quit"],
];

const features = [
  { icon: Search, title: "Instant search", text: "Fuzzy search across every technology with ⌘K, or press / on any page." },
  { icon: Copy, title: "One-click copy", text: "Copy any example straight into your terminal." },
  { icon: Star, title: "Favorites", text: "Star the commands you reach for and find them in one place." },
  { icon: Keyboard, title: "Keyboard friendly", text: "Navigate, search and copy without touching the mouse." },
];

export default function Home() {
  const groups = getTechnologiesByGroup();
  const popular = POPULAR.map(([t, c]) => getCommand(t, c)).filter((c) => c !== undefined);

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Hero */}
        <section className="space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            Your command line <span className="text-muted-foreground">cheat sheet</span>
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-balance sm:text-xl">
            Searchable references for {technologies.length} developer tools, with flags, real-world examples and
            gotchas. Find it, copy it, get back to work.
          </p>
          <HeroSearch commandCount={commands.length} />
          {popular.length > 0 && (
            <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2 pt-2">
              <span className="text-muted-foreground py-1 text-sm">Popular:</span>
              {popular.map((cmd) => (
                <Link
                  key={cmd.id}
                  href={`/${cmd.technologyId}/${cmd.id}`}
                  className="bg-muted hover:bg-accent hover:text-foreground text-muted-foreground rounded-md px-2.5 py-1 font-mono text-sm transition-colors"
                >
                  {cmd.name}
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Technologies, grouped */}
        <section id="technologies" className="scroll-mt-24 space-y-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">Browse by technology</h2>
            <p className="text-muted-foreground text-sm">
              {technologies.length} technologies · {commands.length.toLocaleString("en-US")} commands
            </p>
          </div>
          {groups.map(({ group, technologies: techs }) => (
            <div key={group} className="space-y-4">
              <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">{group}</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {techs.map((tech) => (
                  <Link
                    key={tech.id}
                    href={`/${tech.id}`}
                    className="group bg-card hover:border-foreground/20 focus-visible:ring-ring/50 flex items-start gap-4 rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-[3px] focus-visible:outline-none"
                  >
                    <TechIcon name={tech.id} className="h-10 w-10" />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{tech.name}</span>
                        <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                          {getCommandsByTechnology(tech.id).length} cmds
                        </span>
                      </div>
                      <p className="text-muted-foreground line-clamp-2 text-sm">{tech.description}</p>
                    </div>
                    <ArrowRight className="text-muted-foreground mt-1 h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Features */}
        <section className="grid gap-8 border-t pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="space-y-2">
              <Icon className="text-muted-foreground h-5 w-5" />
              <h3 className="font-semibold">{title}</h3>
              <p className="text-muted-foreground text-sm">{text}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
