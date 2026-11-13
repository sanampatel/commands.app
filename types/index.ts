export type TechnologyGroup =
  | "Shell & System"
  | "Version Control"
  | "Languages & Runtimes"
  | "Package Managers"
  | "Frameworks"
  | "Databases"
  | "DevOps & Cloud";

export type Technology = {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji fallback when no SVG icon exists
  color: string; // brand color, used for accents
  group: TechnologyGroup;
};

export type CommandFlag = {
  flag: string;
  description: string;
  example?: string;
};

export type CommandExample = {
  command: string;
  description: string;
  output?: string;
};

export type Command = {
  id: string;
  name: string;
  description: string;
  category: string; // e.g., "File Management", "System Info", "Networking"
  flags?: CommandFlag[];
  examples: CommandExample[];
  notes?: string[];
  relatedCommands?: string[]; // array of command IDs
  technologyId: string;
  /** Lifecycle marker shown as a badge: superseded, going away, or not yet stable. */
  status?: CommandStatus;
};

export type CommandStatus = "legacy" | "deprecated" | "preview";

export type CommandsData = {
  technologies: Technology[];
  commands: Command[];
};

/** Lightweight shape used by the global search palette. */
export type SearchEntry = {
  id: string;
  name: string;
  description: string;
  category: string;
  technologyId: string;
  status?: CommandStatus;
  /** Example descriptions, so task-style queries ("undo last commit") find the command. */
  keywords: string;
};
