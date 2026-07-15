export const SENSOR_STATUSES = [
  "green",
  "orange",
  "yellow",
  "red",
  "turquoise",
  "magenta",
  "grey",
] as const;

export type SensorStatus = (typeof SENSOR_STATUSES)[number];
export type SensorLabel = "A" | "B";
export type LoginUser = "sysadmin" | "maintenance";
export type ScenarioDifficulty = "easy" | "medium" | "hard";

export interface SensorVoltages {
  v3_3: number;
  v5: number;
  v12: number;
}

export interface SensorMonitoringData {
  lastSnmpResponseAt: string;
  temperatureC: number;
  cpuLoadPercent: number;
  voltages: SensorVoltages;
  receiverConfidencePercent: number;
  crcErrorCount: number;
  gpsStatus: "synchronized" | "unsynchronized" | "unavailable";
}

export interface SensorState {
  id: string;
  sensorLabel: SensorLabel;
  status: SensorStatus;
  ipAddress: string;
  name: string;
  monitoring?: SensorMonitoringData;
}

export interface SiteState {
  id: string;
  name: string;
  sensorA: SensorState | null;
  sensorB: SensorState | null;
}

export type RecordedActionKind =
  | "menu-selection"
  | "value-input"
  | "authentication";

export interface RecordedAction {
  step: number;
  kind: RecordedActionKind;
  menuId: string;
  menuTitle: string;
  input: string;
  resultLabel: string;
  timestamp: number;
}

export type RecordableAction = Omit<RecordedAction, "step" | "timestamp">;

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: ScenarioDifficulty;
  createdAt: string;
  updatedAt?: string;
  sites: SiteState[];
  targetSensorId: string;
  targetLoginUser: LoginUser;
  expectedActions: RecordedAction[];
}

export type StepComparisonStatus =
  | "correct"
  | "incorrect"
  | "missing"
  | "redundant";

export interface StepComparison {
  stepNumber: number;
  expected: RecordedAction | null;
  submitted: RecordedAction | null;
  status: StepComparisonStatus;
}

export interface GradingResult {
  passed: boolean;
  score: number;
  correctSteps: number;
  totalExpected: number;
  totalSubmitted: number;
  steps: StepComparison[];
}

