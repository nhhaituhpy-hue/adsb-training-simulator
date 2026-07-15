import {
  SCENARIO_STORAGE_KEY,
  loadScenarios,
  removeScenario,
  saveScenarios,
  upsertScenario,
  type StorageLike,
} from "@/lib/storage";
import type { Scenario } from "@/lib/types";
import { create, type StoreApi, type UseBoundStore } from "zustand";

import { cloneScenarios, DEFAULT_SCENARIOS } from "./default-scenarios";

export type CreateScenarioInput = Omit<
  Scenario,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
  createdAt?: string;
};

export type UpdateScenarioInput = Partial<
  Omit<Scenario, "id" | "createdAt" | "updatedAt">
>;

export interface ScenarioStoreState {
  scenarios: Scenario[];
  isHydrated: boolean;
  storageError: string | null;
}

export interface ScenarioStoreActions {
  hydrate: () => void;
  createScenario: (input: CreateScenarioInput) => Scenario;
  updateScenario: (
    scenarioId: string,
    updates: UpdateScenarioInput,
  ) => Scenario | null;
  deleteScenario: (scenarioId: string) => boolean;
  getScenarioById: (scenarioId: string) => Scenario | undefined;
  resetToDefaults: () => Scenario[];
}

export type ScenarioStore = ScenarioStoreState & ScenarioStoreActions;

export interface ScenarioStoreOptions {
  storage?: StorageLike | null;
  defaultScenarios?: readonly Scenario[];
  now?: () => Date;
  generateId?: () => string;
}

function getBrowserStorage(): StorageLike | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Scenario storage failed.";
}

function defaultId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `scenario-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createScenarioStore(
  options: ScenarioStoreOptions = {},
): UseBoundStore<StoreApi<ScenarioStore>> {
  const defaults = options.defaultScenarios ?? DEFAULT_SCENARIOS;
  const now = options.now ?? (() => new Date());
  const generateId = options.generateId ?? defaultId;
  const resolveStorage = (): StorageLike | null =>
    Object.prototype.hasOwnProperty.call(options, "storage")
      ? (options.storage ?? null)
      : getBrowserStorage();

  return create<ScenarioStore>()((set, get) => {
    const persist = (scenarios: readonly Scenario[]): string | null => {
      const storage = resolveStorage();

      if (!storage) {
        return null;
      }

      try {
        saveScenarios(storage, scenarios);
        return null;
      } catch (error) {
        return errorMessage(error);
      }
    };

    const ensureHydrated = (): void => {
      if (!get().isHydrated) {
        get().hydrate();
      }
    };

    return {
      scenarios: cloneScenarios(defaults),
      isHydrated: false,
      storageError: null,

      hydrate: () => {
        if (get().isHydrated) {
          return;
        }

        const storage = resolveStorage();
        if (!storage) {
          return;
        }

        try {
          const rawValue = storage.getItem(SCENARIO_STORAGE_KEY);

          if (rawValue === null || rawValue.trim() === "") {
            const scenarios = cloneScenarios(defaults, now().toISOString());
            saveScenarios(storage, scenarios);
            set({ scenarios, isHydrated: true, storageError: null });
            return;
          }

          set({
            scenarios: cloneScenarios(loadScenarios(storage)),
            isHydrated: true,
            storageError: null,
          });
        } catch (error) {
          // Keep invalid or future-version data untouched so recovery is possible.
          set({
            scenarios: cloneScenarios(defaults, now().toISOString()),
            isHydrated: true,
            storageError: errorMessage(error),
          });
        }
      },

      createScenario: (input) => {
        ensureHydrated();

        const createdAt = input.createdAt ?? now().toISOString();
        const scenario: Scenario = {
          ...input,
          id: input.id?.trim() || generateId(),
          createdAt,
        };
        const scenarios = upsertScenario(get().scenarios, scenario);

        set({ scenarios, storageError: persist(scenarios) });
        return scenario;
      },

      updateScenario: (scenarioId, updates) => {
        ensureHydrated();

        const existing = get().scenarios.find(
          (scenario) => scenario.id === scenarioId,
        );
        if (!existing) {
          return null;
        }

        const updated: Scenario = {
          ...existing,
          ...updates,
          id: existing.id,
          createdAt: existing.createdAt,
          updatedAt: now().toISOString(),
        };
        const scenarios = upsertScenario(get().scenarios, updated);

        set({ scenarios, storageError: persist(scenarios) });
        return updated;
      },

      deleteScenario: (scenarioId) => {
        ensureHydrated();

        if (!get().scenarios.some((scenario) => scenario.id === scenarioId)) {
          return false;
        }

        const scenarios = removeScenario(get().scenarios, scenarioId);
        set({ scenarios, storageError: persist(scenarios) });
        return true;
      },

      getScenarioById: (scenarioId) =>
        get().scenarios.find((scenario) => scenario.id === scenarioId),

      resetToDefaults: () => {
        const scenarios = cloneScenarios(defaults, now().toISOString());
        const storage = resolveStorage();
        const storageError = persist(scenarios);

        set({
          scenarios,
          isHydrated: storage ? true : get().isHydrated,
          storageError,
        });
        return scenarios;
      },
    };
  });
}

export const useScenarioStore = createScenarioStore();

export { DEFAULT_SCENARIOS } from "./default-scenarios";
