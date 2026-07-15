"use client";

import { ScenarioWizard } from "@/components/admin/scenario-wizard";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function EditScenarioContent() {
  const searchParams = useSearchParams();
  const scenarioId = searchParams.get("id") || "";
  return <ScenarioWizard scenarioId={scenarioId} />;
}

export default function EditScenarioPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[var(--text-secondary)]">Đang tải trình chỉnh sửa...</div>}>
      <EditScenarioContent />
    </Suspense>
  );
}
