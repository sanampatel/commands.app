#!/usr/bin/env node
/**
 * Validates every file in data/commands against the Command schema and
 * cross-checks technologies.json. Run with `npm run validate`.
 * Exits non-zero when any error is found so it can gate CI.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "data");
const commandsDir = join(dataDir, "commands");

const errors = [];
const warnings = [];
const err = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const technologies = JSON.parse(readFileSync(join(dataDir, "technologies.json"), "utf8"));
const techIds = new Set();
for (const tech of technologies) {
  for (const key of ["id", "name", "description", "group"]) {
    if (typeof tech[key] !== "string" || !tech[key].trim()) err(`technologies.json: "${tech.id}" missing ${key}`);
  }
  if (techIds.has(tech.id)) err(`technologies.json: duplicate id "${tech.id}"`);
  techIds.add(tech.id);
}

const files = readdirSync(commandsDir).filter((f) => f.endsWith(".json"));
const allIds = new Map();
const byTech = new Map();

for (const file of files) {
  const techId = basename(file, ".json");
  if (!techIds.has(techId)) err(`${file}: no matching entry in technologies.json`);

  let commands;
  try {
    commands = JSON.parse(readFileSync(join(commandsDir, file), "utf8"));
  } catch (e) {
    err(`${file}: invalid JSON (${e.message})`);
    continue;
  }
  if (!Array.isArray(commands)) {
    err(`${file}: top level must be an array`);
    continue;
  }

  const ids = new Set();
  for (const [i, c] of commands.entries()) {
    const where = `${file}[${i}] (${c?.id ?? "?"})`;
    for (const key of ["id", "name", "description", "category"]) {
      if (typeof c[key] !== "string" || !c[key].trim()) err(`${where}: missing "${key}"`);
    }
    if (c.id && !ID_PATTERN.test(c.id)) err(`${where}: id must be kebab-case`);
    if (c.technologyId !== techId) err(`${where}: technologyId "${c.technologyId}" should be "${techId}"`);
    if (allIds.has(c.id)) err(`${where}: id also used in ${allIds.get(c.id)} (ids must be globally unique)`);
    allIds.set(c.id, file);
    ids.add(c.id);

    if (!Array.isArray(c.examples) || c.examples.length === 0) err(`${where}: needs at least one example`);
    for (const ex of c.examples ?? []) {
      if (!ex.command?.trim() || !ex.description?.trim()) err(`${where}: example missing command/description`);
    }
    for (const f of c.flags ?? []) {
      if (!f.flag?.trim() || !f.description?.trim()) err(`${where}: flag missing flag/description`);
    }
    if (c.notes && !Array.isArray(c.notes)) err(`${where}: notes must be an array`);
    const allowed = new Set(["id", "name", "description", "category", "technologyId", "flags", "examples", "notes", "relatedCommands", "status"]);
    if (c.status !== undefined && !["legacy", "deprecated", "preview"].includes(c.status))
      err(`${where}: status must be "legacy", "deprecated" or "preview"`);
    for (const key of Object.keys(c)) if (!allowed.has(key)) warn(`${where}: unknown key "${key}"`);
  }
  byTech.set(techId, { commands, ids });
}

for (const [techId, { commands, ids }] of byTech) {
  for (const c of commands) {
    for (const rel of c.relatedCommands ?? []) {
      if (rel === c.id) err(`${techId}/${c.id}: relates to itself`);
      else if (!ids.has(rel)) err(`${techId}/${c.id}: related command "${rel}" does not exist in ${techId}.json`);
    }
  }
}

for (const id of techIds) if (!byTech.has(id)) err(`technologies.json: "${id}" has no data/commands/${id}.json`);

warnings.forEach((w) => console.warn(`warn: ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`error: ${e}`));
  console.error(`\n${errors.length} error(s) in ${files.length} files`);
  process.exit(1);
}
const total = [...byTech.values()].reduce((n, t) => n + t.commands.length, 0);
console.log(`OK: ${technologies.length} technologies, ${total} commands`);
