import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { preferencesService } from "../services/preferencesService";
import {
  UserPreferences,
  PreferencesFormData,
  PreferenceValue,
} from "../interfaces/preferences";

interface PreferencesState {
  // State
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;
  isDirty: boolean;
  currentStep: number;
  totalSteps: number;
  history: UserPreferences[];
  historyIndex: number;

  // Actions
  fetchPreferences: () => Promise<void>;
  updatePreferences: (preferences: PreferencesFormData) => Promise<void>;
  setPreferenceValue: (field: string, value: PreferenceValue) => void;
  resetPreferences: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  saveDraft: () => Promise<void>;
  undo: () => void;
  redo: () => void;
}

// Type-safe nested value setter
type NestedObject = Record<string, unknown>;
const setNestedValue = (
  obj: NestedObject,
  path: string,
  value: unknown
): void => {
  const keys = path.split(".");
  const lastKey = keys.pop()!;
  const target = keys.reduce((acc, key) => {
    if (!(key in acc)) {
      acc[key] = {};
    }
    return acc[key] as NestedObject;
  }, obj);
  target[lastKey] = value;
};

const MAX_HISTORY = 50;

export const usePreferencesStore = create<PreferencesState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        preferences: null,
        isLoading: false,
        error: null,
        isDirty: false,
        currentStep: 0,
        totalSteps: 5,
        history: [],
        historyIndex: -1,

        // Actions
        fetchPreferences: async () => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });
          try {
            const response = await preferencesService.getPreferences();
            set((state) => {
              state.preferences = response;
              state.isLoading = false;
              state.isDirty = false;
              state.history = [response];
              state.historyIndex = 0;
            });
          } catch (error) {
            set((state) => {
              state.isLoading = false;
              state.error =
                error instanceof Error
                  ? error.message
                  : "An unknown error occurred";
            });
          }
        },

        updatePreferences: async (preferences: PreferencesFormData) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });
          try {
            const response = await preferencesService.updatePreferences(
              preferences
            );
            set((state) => {
              state.preferences = response;
              state.isLoading = false;
              state.isDirty = false;
              // Add to history
              state.history = [
                ...state.history.slice(0, state.historyIndex + 1),
                response,
              ].slice(-MAX_HISTORY);
              state.historyIndex = state.history.length - 1;
            });
          } catch (error) {
            set((state) => {
              state.isLoading = false;
              state.error =
                error instanceof Error
                  ? error.message
                  : "An unknown error occurred";
            });
          }
        },

        setPreferenceValue: (field: string, value: PreferenceValue) => {
          const { preferences } = get();
          if (!preferences) return;

          set((state) => {
            const newPreferences = { ...preferences };
            setNestedValue(newPreferences, field, value);
            state.preferences = newPreferences;
            state.isDirty = true;
            // Add to history
            state.history = [
              ...state.history.slice(0, state.historyIndex + 1),
              newPreferences,
            ].slice(-MAX_HISTORY);
            state.historyIndex = state.history.length - 1;
          });
        },

        resetPreferences: () => {
          set((state) => {
            state.preferences = null;
            state.isLoading = false;
            state.error = null;
            state.isDirty = false;
            state.currentStep = 0;
            state.history = [];
            state.historyIndex = -1;
          });
        },

        nextStep: () => {
          set((state) => {
            if (state.currentStep < state.totalSteps - 1) {
              state.currentStep += 1;
            }
          });
        },

        prevStep: () => {
          set((state) => {
            if (state.currentStep > 0) {
              state.currentStep -= 1;
            }
          });
        },

        goToStep: (step: number) => {
          set((state) => {
            if (step >= 0 && step < state.totalSteps) {
              state.currentStep = step;
            }
          });
        },

        saveDraft: async () => {
          const { preferences, isDirty } = get();
          if (!preferences || !isDirty) return;

          set((state) => {
            state.isLoading = true;
            state.error = null;
          });
          try {
            await preferencesService.saveDraft(preferences);
            set((state) => {
              state.isLoading = false;
              state.isDirty = false;
            });
          } catch (error) {
            set((state) => {
              state.isLoading = false;
              state.error =
                error instanceof Error
                  ? error.message
                  : "An unknown error occurred";
            });
          }
        },

        undo: () => {
          set((state) => {
            if (state.historyIndex > 0) {
              state.historyIndex -= 1;
              state.preferences = state.history[state.historyIndex];
              state.isDirty = true;
            }
          });
        },

        redo: () => {
          set((state) => {
            if (state.historyIndex < state.history.length - 1) {
              state.historyIndex += 1;
              state.preferences = state.history[state.historyIndex];
              state.isDirty = true;
            }
          });
        },
      })),
      {
        name: "preferences-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          preferences: state.preferences,
          currentStep: state.currentStep,
          history: state.history,
          historyIndex: state.historyIndex,
        }),
      }
    ),
    {
      name: "preferences-store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);
