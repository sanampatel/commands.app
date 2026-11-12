import type { Command } from "@/types";

export function generateMarkdown(command: Command, technologyName: string): string {
  let markdown = `# ${command.name}\n\n`;
  markdown += `**Technology:** ${technologyName} · **Category:** ${command.category}\n\n`;
  markdown += `${command.description}\n\n`;

  if (command.flags && command.flags.length > 0) {
    markdown += `## Options & Flags\n\n`;
    markdown += `| Flag | Description |\n`;
    markdown += `|------|-------------|\n`;
    command.flags.forEach((flag) => {
      markdown += `| \`${flag.flag.replace(/\|/g, "\\|")}\` | ${flag.description.replace(/\|/g, "\\|")} |\n`;
    });
    markdown += `\n`;
  }

  markdown += `## Examples\n\n`;
  command.examples.forEach((example, index) => {
    markdown += `### ${index + 1}. ${example.description}\n\n`;
    markdown += `\`\`\`bash\n${example.command}\n\`\`\`\n\n`;
    if (example.output) {
      markdown += `**Output:**\n\`\`\`\n${example.output}\n\`\`\`\n\n`;
    }
  });

  if (command.notes && command.notes.length > 0) {
    markdown += `## Notes\n\n`;
    command.notes.forEach((note) => {
      markdown += `- ${note}\n`;
    });
    markdown += `\n`;
  }

  if (command.relatedCommands && command.relatedCommands.length > 0) {
    markdown += `## Related Commands\n\n`;
    command.relatedCommands.forEach((cmd) => {
      markdown += `- \`${cmd}\`\n`;
    });
  }

  markdown += `\n---\n*Generated from Commands.app*\n`;

  return markdown;
}

export function downloadMarkdown(command: Command, technologyName: string): void {
  const markdown = generateMarkdown(command, technologyName);
  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${command.id}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generatePrintHTML(command: Command, technologyName: string): string {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${escapeHtml(command.name)} - ${escapeHtml(technologyName)} Commands</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          color: #333;
        }
        h1 { color: #1a1a1a; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        h2 { color: #333; margin-top: 30px; }
        code {
          background: #f4f4f4;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'SF Mono', Monaco, monospace;
          font-size: 0.9em;
        }
        pre {
          background: #1e1e1e;
          color: #d4d4d4;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
        }
        pre code {
          background: none;
          padding: 0;
          color: inherit;
        }
        .badge {
          display: inline-block;
          background: #e5e5e5;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85em;
          margin-left: 10px;
        }
        .flag-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .flag-table th, .flag-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        .flag-table th {
          background: #f8f8f8;
        }
        .example {
          margin: 20px 0;
          padding: 15px;
          background: #fafafa;
          border-radius: 8px;
        }
        .example-title {
          font-weight: 600;
          margin-bottom: 10px;
        }
        .notes {
          background: #fff9e6;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 0.85em;
          color: #666;
        }
        @media print {
          body { padding: 20px; }
          pre { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <h1>${escapeHtml(command.name)} <span class="badge">${escapeHtml(command.category)}</span></h1>
      <p>${escapeHtml(command.description)}</p>
  `;

  if (command.flags && command.flags.length > 0) {
    html += `
      <h2>Options & Flags</h2>
      <table class="flag-table">
        <thead>
          <tr><th>Flag</th><th>Description</th></tr>
        </thead>
        <tbody>
    `;
    command.flags.forEach((flag) => {
      html += `<tr><td><code>${escapeHtml(flag.flag)}</code></td><td>${escapeHtml(flag.description)}</td></tr>`;
    });
    html += `</tbody></table>`;
  }

  html += `<h2>Examples</h2>`;
  command.examples.forEach((example, index) => {
    html += `
      <div class="example">
        <div class="example-title">${index + 1}. ${escapeHtml(example.description)}</div>
        <pre><code>${escapeHtml(example.command)}</code></pre>
    `;
    if (example.output) {
      html += `<p><strong>Output:</strong></p><pre><code>${escapeHtml(example.output)}</code></pre>`;
    }
    html += `</div>`;
  });

  if (command.notes && command.notes.length > 0) {
    html += `<h2>Notes</h2><div class="notes"><ul>`;
    command.notes.forEach((note) => {
      html += `<li>${escapeHtml(note)}</li>`;
    });
    html += `</ul></div>`;
  }

  if (command.relatedCommands && command.relatedCommands.length > 0) {
    html += `<h2>Related Commands</h2><p>`;
    html += command.relatedCommands.map((cmd) => `<code>${escapeHtml(cmd)}</code>`).join(", ");
    html += `</p>`;
  }

  html += `
      <div class="footer">
        Generated from Commands.app - Your Command Line Cheat Sheet
      </div>
    </body>
    </html>
  `;

  return html;
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
}

export function printCommand(command: Command, technologyName: string): void {
  const html = generatePrintHTML(command, technologyName);
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}
