"use client";

import { useEffect, useRef } from "react";

function lineColor(line: string): string {
  if (/invalid|incorrect|required|không hợp lệ/i.test(line)) {
    return "text-[var(--terminal-error)]";
  }

  if (
    line.startsWith("*") ||
    /please type|press return|^login:|^password:/i.test(line)
  ) {
    return "text-[var(--terminal-green)]";
  }

  return "text-[var(--terminal-text)]";
}

export function TerminalOutput({ output }: { output: string[] }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [output]);

  return (
    <div
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      className="min-h-0 flex-1 overflow-auto px-4 py-4 font-mono text-[13px] leading-[1.6] sm:px-5 sm:text-sm"
    >
      {output.map((block, blockIndex) => (
        <div key={`${blockIndex}-${block.slice(0, 24)}`} className="mb-3 last:mb-0">
          {block.split("\n").map((line, lineIndex) => (
            <div
              key={`${blockIndex}-${lineIndex}`}
              className={`min-h-[1.6em] whitespace-pre ${lineColor(line)}`}
            >
              {line || " "}
            </div>
          ))}
        </div>
      ))}
      <div ref={endRef} aria-hidden />
    </div>
  );
}
