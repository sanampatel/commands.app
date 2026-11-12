import Link from "next/link";
import { ArrowLeftRight, HandHeart, LayoutGrid, Menu, Star, Terminal } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandPalette } from "@/components/command-palette";
import { GitHubIcon } from "@/components/icons/github";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { technologies } from "@/data";
import { siteConfig } from "@/lib/site";

const navLinks = [
  { href: "/#technologies", label: "Technologies", icon: LayoutGrid },
  { href: "/favorites", label: "Favorites", icon: Star },
  { href: "/compare", label: "Compare", icon: ArrowLeftRight },
  { href: "/contributing", label: "Contribute", icon: HandHeart },
];

export function Header() {
  const paletteTechs = technologies.map(({ id, name }) => ({ id, name }));

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-16 items-center gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label={`${siteConfig.name} home`}>
          <span className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-md">
            <Terminal className="h-4 w-4" />
          </span>
          <span className="hidden text-lg font-bold tracking-tight sm:inline">{siteConfig.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <CommandPalette technologies={paletteTechs} />
          <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
            <a href={siteConfig.repo} target="_blank" rel="noreferrer" aria-label="View source on GitHub" title="GitHub">
              <GitHubIcon className="h-5 w-5" />
            </a>
          </Button>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <DropdownMenuItem key={href} asChild>
                  <Link href={href}>
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href={siteConfig.repo} target="_blank" rel="noreferrer">
                  <GitHubIcon className="h-4 w-4" />
                  GitHub
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
