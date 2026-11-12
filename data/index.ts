import type { Command, CommandsData, Technology, TechnologyGroup } from "@/types";

import technologiesJson from "./technologies.json";

import aws from "./commands/aws.json";
import bun from "./commands/bun.json";
import composer from "./commands/composer.json";
import docker from "./commands/docker.json";
import filament from "./commands/filament.json";
import git from "./commands/git.json";
import githubCli from "./commands/github-cli.json";
import go from "./commands/go.json";
import homebrew from "./commands/homebrew.json";
import kubernetes from "./commands/kubernetes.json";
import laravel from "./commands/laravel.json";
import linux from "./commands/linux.json";
import mongodb from "./commands/mongodb.json";
import mysql from "./commands/mysql.json";
import nextjs from "./commands/nextjs.json";
import nginx from "./commands/nginx.json";
import npm from "./commands/npm.json";
import pnpm from "./commands/pnpm.json";
import postgresql from "./commands/postgresql.json";
import python from "./commands/python.json";
import redis from "./commands/redis.json";
import rust from "./commands/rust.json";
import ssh from "./commands/ssh.json";
import terraform from "./commands/terraform.json";
import tmux from "./commands/tmux.json";
import uv from "./commands/uv.json";
import vim from "./commands/vim.json";
import yarn from "./commands/yarn.json";

/**
 * Every technology's command file, keyed by technology id.
 * To add a technology: create data/commands/<id>.json, add an entry to
 * technologies.json, and register the import here. `npm run validate` checks
 * that the three stay in sync.
 */
const commandFiles: Record<string, unknown[]> = {
  aws,
  bun,
  composer,
  docker,
  filament,
  git,
  "github-cli": githubCli,
  go,
  homebrew,
  kubernetes,
  laravel,
  linux,
  mongodb,
  mysql,
  nextjs,
  nginx,
  npm,
  pnpm,
  postgresql,
  python,
  redis,
  rust,
  ssh,
  terraform,
  tmux,
  uv,
  vim,
  yarn,
};

export const technologies = technologiesJson as Technology[];

export const technologyGroups: TechnologyGroup[] = [
  "Shell & System",
  "Version Control",
  "Languages & Runtimes",
  "Package Managers",
  "Frameworks",
  "Databases",
  "DevOps & Cloud",
];

export const commands: Command[] = technologies.flatMap(
  (tech) => (commandFiles[tech.id] ?? []) as Command[]
);

const technologyById = new Map(technologies.map((t) => [t.id, t]));
const commandsByTechnology = new Map<string, Command[]>();
const commandByKey = new Map<string, Command>();

for (const cmd of commands) {
  const list = commandsByTechnology.get(cmd.technologyId) ?? [];
  list.push(cmd);
  commandsByTechnology.set(cmd.technologyId, list);
  commandByKey.set(`${cmd.technologyId}/${cmd.id}`, cmd);
}

export function getTechnology(id: string): Technology | undefined {
  return technologyById.get(id);
}

export function getCommandsByTechnology(technologyId: string): Command[] {
  return commandsByTechnology.get(technologyId) ?? [];
}

export function getCommand(technologyId: string, commandId: string): Command | undefined {
  return commandByKey.get(`${technologyId}/${commandId}`);
}

export function getTechnologiesByGroup(): { group: TechnologyGroup; technologies: Technology[] }[] {
  return technologyGroups
    .map((group) => ({ group, technologies: technologies.filter((t) => t.group === group) }))
    .filter((g) => g.technologies.length > 0);
}

export const commandsData: CommandsData = { technologies, commands };

export default commandsData;
