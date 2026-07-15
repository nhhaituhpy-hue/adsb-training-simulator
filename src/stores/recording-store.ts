import { gradeActions } from "@/lib/grading";
import type {
  GradingResult,
  RecordableAction,
  RecordedAction,
} from "@/lib/types";
import { create, type StoreApi, type UseBoundStore } from "zustand";

export interface RecordingStoreState {
  scenarioId: string | null;
  isRecording: boolean;
  allActions: RecordedAction[];
  selectedActions: RecordedAction[];
  gradingResult: GradingResult | null;
}

export interface RecordingStoreActions {
  beginAttempt: (scenarioId: string) => void;
  toggleRecording: () => void;
  addAction: (
    action: RecordableAction | RecordedAction,
  ) => RecordedAction | null;
  toggleSelectAction: (step: number) => void;
  selectAll: () => void;
  clearSelection: () => void;
  reorderSelectedAction: (fromIndex: number, toIndex: number) => boolean;
  removeAction: (step: number) => boolean;
  clearActions: () => void;
  submitForGrading: (
    expectedActions: readonly RecordedAction[],
  ) => GradingResult;
  resetAttempt: () => void;
}

export type RecordingStore = RecordingStoreState & RecordingStoreActions;

export interface RecordingStoreOptions {
  now?: () => number;
}

const INITIAL_STATE: RecordingStoreState = {
  scenarioId: null,
  isRecording: false,
  allActions: [],
  selectedActions: [],
  gradingResult: null,
};

export function createRecordingStore(
  options: RecordingStoreOptions = {},
): UseBoundStore<StoreApi<RecordingStore>> {
  const now = options.now ?? Date.now;

  return create<RecordingStore>()((set, get) => ({
    ...INITIAL_STATE,

    beginAttempt: (scenarioId) => {
      set({
        scenarioId,
        isRecording: true,
        allActions: [],
        selectedActions: [],
        gradingResult: null,
      });
    },

    toggleRecording: () => {
      set((state) => ({ isRecording: !state.isRecording }));
    },

    addAction: (inputAction) => {
      const state = get();

      // Authentication values, including passwords, never enter recording state.
      if (!state.isRecording || inputAction.kind === "authentication") {
        return null;
      }

      const nextStep =
        state.allActions.reduce(
          (highestStep, action) => Math.max(highestStep, action.step),
          0,
        ) + 1;
      const action: RecordedAction = {
        kind: inputAction.kind,
        menuId: inputAction.menuId,
        menuTitle: inputAction.menuTitle,
        input: inputAction.input,
        resultLabel: inputAction.resultLabel,
        step: nextStep,
        timestamp: now(),
      };

      set({
        allActions: [...state.allActions, action],
        gradingResult: null,
      });
      return action;
    },

    toggleSelectAction: (step) => {
      const state = get();
      const isSelected = state.selectedActions.some(
        (action) => action.step === step,
      );

      if (isSelected) {
        set({
          selectedActions: state.selectedActions.filter(
            (action) => action.step !== step,
          ),
          gradingResult: null,
        });
        return;
      }

      const action = state.allActions.find((item) => item.step === step);
      if (action) {
        set({
          selectedActions: [...state.selectedActions, action],
          gradingResult: null,
        });
      }
    },

    selectAll: () => {
      set((state) => ({
        selectedActions: [...state.allActions],
        gradingResult: null,
      }));
    },

    clearSelection: () => {
      set({ selectedActions: [], gradingResult: null });
    },

    reorderSelectedAction: (fromIndex, toIndex) => {
      const selectedActions = [...get().selectedActions];

      if (
        fromIndex < 0 ||
        fromIndex >= selectedActions.length ||
        toIndex < 0 ||
        toIndex >= selectedActions.length ||
        fromIndex === toIndex
      ) {
        return false;
      }

      const [movedAction] = selectedActions.splice(fromIndex, 1);
      selectedActions.splice(toIndex, 0, movedAction);
      set({ selectedActions, gradingResult: null });
      return true;
    },

    removeAction: (step) => {
      const state = get();
      if (!state.allActions.some((action) => action.step === step)) {
        return false;
      }

      set({
        allActions: state.allActions.filter((action) => action.step !== step),
        selectedActions: state.selectedActions.filter(
          (action) => action.step !== step,
        ),
        gradingResult: null,
      });
      return true;
    },

    clearActions: () => {
      set({ allActions: [], selectedActions: [], gradingResult: null });
    },

    submitForGrading: (expectedActions) => {
      const result = gradeActions(expectedActions, get().selectedActions);
      set({ gradingResult: result, isRecording: false });
      return result;
    },

    resetAttempt: () => {
      set({
        scenarioId: null,
        isRecording: false,
        allActions: [],
        selectedActions: [],
        gradingResult: null,
      });
    },
  }));
}

export const useRecordingStore = createRecordingStore();
