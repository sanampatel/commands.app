/**
 * Renders a shell command so it wraps between arguments rather than inside them.
 * Browsers break lines after hyphens, which splits flags like `--force` into `--` / `force`.
 * Each argument is an inline-block, so wrapping happens at spaces; an argument longer than
 * the whole line (e.g. a URL) can still break anywhere instead of overflowing.
 * The text content is unchanged, so selecting and copying still gives the exact command.
 */
export function CommandText({ text }: { text: string }) {
  return text.split(/(\s+)/).map((part, i) =>
    part === "" || /^\s+$/.test(part) ? (
      part
    ) : (
      <span key={i} className="inline-block max-w-full [overflow-wrap:anywhere]">
        {part}
      </span>
    )
  );
}
