"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClipboardCopy, Download, FileText, Printer } from "lucide-react";
import { downloadMarkdown, generateMarkdown, printCommand } from "@/lib/export";
import type { Command } from "@/types";

interface ExportButtonsProps {
  command: Command;
  technologyName: string;
}

export function ExportButtons({ command, technologyName }: ExportButtonsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => navigator.clipboard?.writeText(generateMarkdown(command, technologyName)).catch(() => {})}
        >
          <ClipboardCopy className="h-4 w-4" />
          Copy as Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => downloadMarkdown(command, technologyName)}>
          <FileText className="h-4 w-4" />
          Download Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => printCommand(command, technologyName)}>
          <Printer className="h-4 w-4" />
          Print / Save as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
