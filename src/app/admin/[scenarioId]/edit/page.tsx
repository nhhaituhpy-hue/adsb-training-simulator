import type { Metadata } from "next";
import { ScenarioWizard } from "@/components/admin/scenario-wizard";

export const metadata: Metadata = {
  title: "Chỉnh sửa kịch bản",
};

type EditScenarioPageProps = {
  params: Promise<{ scenarioId: string }>;
};

export default async function EditScenarioPage({ params }: EditScenarioPageProps) {
  const { scenarioId } = await params;
  return <ScenarioWizard scenarioId={scenarioId} />;
}
