"use client";

import StackIcon from "tech-stack-icons";
import type { IconName } from "tech-stack-icons";
import technologies from "@/data/technologies.json";
import { cn } from "@/lib/utils";

interface TechIconProps {
  name: string;
  className?: string;
}

// Technology id -> tech-stack-icons name (https://www.tech-stack-icons.com).
const iconMap: Record<string, IconName> = {
  aws: "aws",
  bun: "bunjs",
  docker: "docker",
  git: "git",
  "github-cli": "github",
  go: "go",
  homebrew: "homebrew",
  kubernetes: "kubernetes",
  laravel: "laravel",
  linux: "linux",
  mongodb: "mongodb",
  nextjs: "nextjs2",
  nginx: "nginx",
  npm: "npm",
  pnpm: "pnpm",
  postgresql: "postgresql",
  python: "python",
  redis: "redis",
  rust: "rust",
  terraform: "terraform",
  tmux: "tmux",
  uv: "uv",
  vim: "vim",
  yarn: "yarn",
};

// Self-hosted SVGs in public/icons for logos tech-stack-icons doesn't have.
// `monochrome` icons are dark artwork on transparent and get inverted in dark mode;
// `darkVariant` icons ship a separate /icons/<id>-dark.svg for dark mode.
// Sources: Composer, MySQL and SSH from Devicon (MIT, https://devicon.dev, also
// served by techicons.dev); the Filament mark from filamentphp.com.
const localIcons: Record<string, { monochrome?: boolean; darkVariant?: boolean }> = {
  composer: {},
  filament: {},
  mysql: { darkVariant: true },
  ssh: { monochrome: true },
};

// Last-resort fallback so a newly added technology never renders blank.
const emojiById = new Map(technologies.map((t) => [t.id, t.icon]));

export function TechIcon({ name, className = "h-8 w-8" }: TechIconProps) {
  const iconName = iconMap[name];
  const local = localIcons[name];

  if (local) {
    const imgClass = "h-full w-full object-contain";
    return (
      <span aria-hidden="true" className={cn("inline-block shrink-0", className)}>
        {/* eslint-disable @next/next/no-img-element -- static SVGs from /public; no optimisation needed */}
        <img
          src={`/icons/${name}.svg`}
          alt=""
          draggable={false}
          className={cn(imgClass, local.monochrome && "dark:invert", local.darkVariant && "dark:hidden")}
        />
        {local.darkVariant && (
          <img src={`/icons/${name}-dark.svg`} alt="" draggable={false} className={cn(imgClass, "hidden dark:block")} />
        )}
        {/* eslint-enable @next/next/no-img-element */}
      </span>
    );
  }

  if (!iconName) {
    return (
      // The outer box is a size container so the emoji scales with whatever
      // h-/w- classes the caller passes, just like the SVG icons do.
      <span
        aria-hidden="true"
        className={cn("flex shrink-0 items-center justify-center", className)}
        style={{ containerType: "size" }}
      >
        <span className="leading-none" style={{ fontSize: "80cqh" }}>
          {emojiById.get(name) ?? "⌘"}
        </span>
      </span>
    );
  }

  return (
    // Both variants are rendered and swapped with `dark:` classes, so dark logos
    // (GitHub, Rust, AWS, MySQL...) stay visible without reading the theme in JS.
    <div aria-hidden="true" className={cn("shrink-0", className)}>
      <div className="h-full w-full dark:hidden">
        <StackIcon name={iconName} variant="light" />
      </div>
      <div className="hidden h-full w-full dark:block">
        <StackIcon name={iconName} variant="dark" />
      </div>
    </div>
  );
}
