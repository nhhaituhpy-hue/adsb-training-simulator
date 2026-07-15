"use client";

import { Suspense } from "react";
import { TerminalSession } from "@/components/terminal/terminal-session";
import { useSearchParams } from "next/navigation";

function LoadingTerminal() {
  return (
    <div className="mx-auto w-full max-w-[1400px] animate-pulse px-4 py-6 sm:px-6 lg:px-8">
      <div className="h-8 w-64 rounded bg-neutral-200" />
      <div className="mt-6 min-h-[620px] rounded-lg bg-neutral-900" />
    </div>
  );
}

function TerminalContent() {
  const searchParams = useSearchParams();
  const scenarioId = searchParams.get("id") || "";
  return <TerminalSession scenarioId={scenarioId} />;
}

export default function TerminalPage() {
  return (
    <Suspense fallback={<LoadingTerminal />}>
      <TerminalContent />
    </Suspense>
  );
}
