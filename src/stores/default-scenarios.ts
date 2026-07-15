import { TerminalEngine } from "@/lib/terminal-engine";
import type {
  LoginUser,
  RecordedAction,
  Scenario,
  SensorMonitoringData,
  SensorStatus,
} from "@/lib/types";

const SEED_TIMESTAMP = Date.parse("2026-01-01T00:00:00.000Z");

function buildExpectedActions(
  loginUser: LoginUser,
  inputs: readonly string[],
): RecordedAction[] {
  const engine = new TerminalEngine({ targetLoginUser: loginUser });

  return inputs.flatMap((input) => {
    const action = engine.processInput(input).recordableAction;

    if (!action) {
      return [];
    }

    return [
      {
        ...action,
        step: 0,
        timestamp: 0,
      },
    ];
  }).map((action, index) => ({
    ...action,
    step: index + 1,
    timestamp: SEED_TIMESTAMP + index,
  }));
}

function monitoring(
  gpsStatus: SensorMonitoringData["gpsStatus"] = "synchronized",
): SensorMonitoringData {
  return {
    lastSnmpResponseAt: "2026-01-01T00:00:00.000Z",
    temperatureC: 42.5,
    cpuLoadPercent: 31,
    voltages: { v3_3: 3.3, v5: 5.02, v12: 12.08 },
    receiverConfidencePercent: 97,
    crcErrorCount: 3,
    gpsStatus,
  };
}

function singleSite(
  siteId: string,
  siteName: string,
  sensorId: string,
  sensorLabel: "A" | "B",
  status: SensorStatus,
  gpsStatus: SensorMonitoringData["gpsStatus"] = "synchronized",
): Scenario["sites"] {
  const sensor = {
    id: sensorId,
    sensorLabel,
    status,
    ipAddress: "10.10.10.3",
    name: "Quadrant ADS-B sensor",
    monitoring: monitoring(gpsStatus),
  };

  return [
    {
      id: siteId,
      name: siteName,
      sensorA: sensorLabel === "A" ? sensor : null,
      sensorB: sensorLabel === "B" ? sensor : null,
    },
  ];
}

/** Built-in exercises used only when a browser has no scenario storage yet. */
export const DEFAULT_SCENARIOS: readonly Scenario[] = [
  {
    id: "seed-sa-enable-cat21",
    title: "Khôi phục đầu ra ADS-B CAT21",
    description:
      "Quản trị viên hệ thống cần bật lại đầu ra CAT21 trên cảm biến bị ảnh hưởng.",
    difficulty: "easy",
    createdAt: "2026-01-01T00:00:00.000Z",
    sites: singleSite(
      "da-nang",
      "Đà Nẵng",
      "da-nang-a",
      "A",
      "yellow",
    ),
    targetSensorId: "da-nang-a",
    targetLoginUser: "sysadmin",
    expectedActions: buildExpectedActions("sysadmin", ["1", "1", "1"]),
  },
  {
    id: "seed-ma-restore-gps",
    title: "Khôi phục xử lý GPS",
    description:
      "Nhân viên bảo trì cần bật lại GPS sau khi cảm biến mất đồng bộ.",
    difficulty: "medium",
    createdAt: "2026-01-02T00:00:00.000Z",
    sites: singleSite(
      "noi-bai",
      "Nội Bài",
      "noi-bai-b",
      "B",
      "orange",
      "unsynchronized",
    ),
    targetSensorId: "noi-bai-b",
    targetLoginUser: "maintenance",
    expectedActions: buildExpectedActions("maintenance", ["6", "2", "1"]),
  },
  {
    id: "seed-ma-check-version",
    title: "Kiểm tra phiên bản phần mềm",
    description:
      "Mở màn hình thông tin phần mềm, kiểm tra phiên bản rồi quay lại menu trước.",
    difficulty: "easy",
    createdAt: "2026-01-03T00:00:00.000Z",
    sites: singleSite(
      "tan-son-nhat",
      "Tân Sơn Nhất",
      "tan-son-nhat-a",
      "A",
      "green",
    ),
    targetSensorId: "tan-son-nhat-a",
    targetLoginUser: "maintenance",
    expectedActions: buildExpectedActions("maintenance", ["7", "1", ""]),
  },
];

export function cloneScenarios(
  scenarios: readonly Scenario[],
  monitoringTimestamp?: string,
): Scenario[] {
  return scenarios.map((scenario) => ({
    ...scenario,
    sites: scenario.sites.map((site) => ({
      ...site,
      sensorA: site.sensorA
        ? {
            ...site.sensorA,
            monitoring: site.sensorA.monitoring
              ? {
                  ...site.sensorA.monitoring,
                  lastSnmpResponseAt:
                    monitoringTimestamp ??
                    site.sensorA.monitoring.lastSnmpResponseAt,
                  voltages: { ...site.sensorA.monitoring.voltages },
                }
              : undefined,
          }
        : null,
      sensorB: site.sensorB
        ? {
            ...site.sensorB,
            monitoring: site.sensorB.monitoring
              ? {
                  ...site.sensorB.monitoring,
                  lastSnmpResponseAt:
                    monitoringTimestamp ??
                    site.sensorB.monitoring.lastSnmpResponseAt,
                  voltages: { ...site.sensorB.monitoring.voltages },
                }
              : undefined,
          }
        : null,
    })),
    expectedActions: scenario.expectedActions.map((action) => ({ ...action })),
  }));
}
