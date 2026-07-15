import { describe, expect, it } from "vitest";

import {
  SCENARIO_STORAGE_VERSION,
  ScenarioStorageError,
  deserializeScenarioStorage,
  serializeScenarioStorage,
} from "../../src/lib/storage";
import type { Scenario } from "../../src/lib/types";

function validScenario(): Scenario {
  return {
    id: "scenario-cat21",
    title: "Enable CAT21",
    description: "Restore CAT21 surveillance output.",
    difficulty: "easy",
    createdAt: "2026-07-15T00:00:00.000Z",
    sites: [
      {
        id: "site-danang",
        name: "Da Nang",
        sensorA: {
          id: "danang-A",
          sensorLabel: "A",
          status: "yellow",
          ipAddress: "10.10.10.3",
          name: "Quadrant ADS-B sensor",
        },
        sensorB: null,
      },
    ],
    targetSensorId: "danang-A",
    targetLoginUser: "sysadmin",
    expectedActions: [
      {
        step: 1,
        kind: "menu-selection",
        menuId: "sa.root",
        menuTitle: "System Administrator Main Menu",
        input: "1",
        resultLabel: "General Settings",
        timestamp: 1,
      },
    ],
  };
}

describe("scenario storage schema", () => {
  it("round-trips a versioned scenario envelope", () => {
    const scenario = validScenario();
    const serialized = serializeScenarioStorage([scenario]);
    const parsed = deserializeScenarioStorage(serialized);

    expect(parsed.version).toBe(SCENARIO_STORAGE_VERSION);
    expect(parsed.scenarios).toEqual([scenario]);
  });

  it("returns an empty current-version envelope for missing storage", () => {
    expect(deserializeScenarioStorage(null)).toEqual({
      version: SCENARIO_STORAGE_VERSION,
      scenarios: [],
    });
  });

  it("rejects unsupported versions", () => {
    expect(() =>
      deserializeScenarioStorage(JSON.stringify({ version: 99, scenarios: [] })),
    ).toThrowError(ScenarioStorageError);
  });

  it("rejects a scenario whose target sensor does not exist", () => {
    const scenario = validScenario();
    scenario.targetSensorId = "missing-sensor";

    expect(() => serializeScenarioStorage([scenario])).toThrowError(
      ScenarioStorageError,
    );
  });
});

