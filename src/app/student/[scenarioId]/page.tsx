import { ScenarioMonitorView } from "@/components/qcms/scenario-monitor-view";

type StudentScenarioPageProps = {
  params: Promise<{ scenarioId: string }>;
};

export default async function StudentScenarioPage({
  params,
}: StudentScenarioPageProps) {
  const { scenarioId } = await params;
  return <ScenarioMonitorView scenarioId={scenarioId} />;
}

