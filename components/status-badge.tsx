import { cn } from "@/lib/utils";
import type { CommandStatus } from "@/types";

const STATUS: Record<CommandStatus, { label: string; title: string; className: string }> = {
  legacy: {
    label: "Legacy",
    title: "Older tool or version; there is a newer recommended alternative",
    className: "border-zinc-400/40 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300",
  },
  deprecated: {
    label: "Deprecated",
    title: "Deprecated or removed in current versions; avoid in new work",
    className: "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400",
  },
  preview: {
    label: "Preview",
    title: "Experimental, beta or preview feature; behaviour may change",
    className: "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  },
};

export function StatusBadge({ status, className }: { status?: CommandStatus; className?: string }) {
  if (!status) return null;
  const s = STATUS[status];
  return (
    <span
      title={s.title}
      className={cn(
        "inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 font-sans text-xs leading-none font-medium",
        s.className,
        className
      )}
    >
      {s.label}
    </span>
  );
}
