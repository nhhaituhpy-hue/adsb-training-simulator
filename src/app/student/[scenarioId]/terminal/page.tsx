import { Suspense } from "react";
import { TerminalSession } from "@/components/terminal/terminal-session";

function LoadingTerminal() {
  return (
    <div className="mx-auto w-full max-w-[1400px] animate-pulse px-4 py-6 sm:px-6 lg:px-8">
      <div className="h-8 w-64 rounded bg-neutral-200" />
      <div className="mt-6 min-h-[620px] rounded-lg bg-neutral-900" />
    </div>
  );
}

export default async function TerminalPage({
  params,
}: {
  params: Promise<{ scenarioId: string }>;
}) {
  const { scenarioId } = await params;

  return (
    <Suspense fallback={<LoadingTerminal />}>
      <TerminalSession scenarioId={scenarioId} />
    </Suspense>
  );
}
