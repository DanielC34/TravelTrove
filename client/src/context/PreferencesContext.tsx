import React, { createContext, useReducer, useContext, ReactNode } from "react";
import { preferencesService } from "../services/preferencesService";
import {
  UserPreferences,
  PreferencesFormData,
  PreferencesContextState,
  PreferencesContextValue,
  DietaryPreferences,
  MobilityPreferences,
  TravelInterests,
  BudgetPreferences,
  ActivityComfortLevel,
} from "../interfaces/preferences";

// Initial state
const initialState: PreferencesContextState = {
  preferences: null,
  isLoading: false,
  error: null,
  isDirty: false,
  currentStep: 0,
  totalSteps: 5, // Dietary, Mobility, Travel Interests, Budget, Activity Comfort
};

// Define the type for preference values
type PreferenceValue =
  | DietaryPreferences
  | MobilityPreferences
  | TravelInterests
  | BudgetPreferences
  | ActivityComfortLevel[]
  | string
  | boolean
  | number;

// Action types
type PreferencesAction =
  | { type: "FETCH_PREFERENCES_START" }
  | { type: "FETCH_PREFERENCES_SUCCESS"; payload: UserPreferences }
  | { type: "FETCH_PREFERENCES_ERROR"; payload: string }
  | { type: "UPDATE_PREFERENCES_START" }
  | { type: "UPDATE_PREFERENCES_SUCCESS"; payload: UserPreferences }
  | { type: "UPDATE_PREFERENCES_ERROR"; payload: string }
  | { type: "SET_PREFERENCE_VALUE"; field: string; value: PreferenceValue }
  | { type: "RESET_PREFERENCES" }
  | { type: "SET_STEP"; payload: number }
  | { type: "SAVE_DRAFT_START" }
  | { type: "SAVE_DRAFT_SUCCESS" }
  | { type: "SAVE_DRAFT_ERROR"; payload: string };

// Create context
const PreferencesContext = createContext<PreferencesContextValue | undefined>(
  undefined
);

// Reducer function
function preferencesReducer(
  state: PreferencesContextState,
  action: PreferencesAction
): PreferencesContextState {
  switch (action.type) {
    case "FETCH_PREFERENCES_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_PREFERENCES_SUCCESS":
      return {
        ...state,
        isLoading: false,
        preferences: action.payload,
        isDirty: false,
      };
    case "FETCH_PREFERENCES_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "UPDATE_PREFERENCES_START":
      return { ...state, isLoading: true, error: null };
    case "UPDATE_PREFERENCES_SUCCESS":
      return {
        ...state,
        isLoading: false,
        preferences: action.payload,
        isDirty: false,
      };
    case "UPDATE_PREFERENCES_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "SET_PREFERENCE_VALUE":
      return {
        ...state,
        isDirty: true,
        preferences: state.preferences
          ? {
              ...state.preferences,
              [action.field]: action.value,
            }
          : null,
      };
    case "RESET_PREFERENCES":
      return { ...initialState };
    case "SET_STEP":
      return { ...state, currentStep: action.payload };
    case "SAVE_DRAFT_START":
      return { ...state, isLoading: true, error: null };
    case "SAVE_DRAFT_SUCCESS":
      return { ...state, isLoading: false, isDirty: false };
    case "SAVE_DRAFT_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

// Provider component
export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(preferencesReducer, initialState);

  const fetchPreferences = async () => {
    dispatch({ type: "FETCH_PREFERENCES_START" });
    try {
      const response = await preferencesService.getPreferences();
      dispatch({ type: "FETCH_PREFERENCES_SUCCESS", payload: response });
    } catch (error) {
      dispatch({
        type: "FETCH_PREFERENCES_ERROR",
        payload:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const updatePreferences = async (preferences: PreferencesFormData) => {
    dispatch({ type: "UPDATE_PREFERENCES_START" });
    try {
      const response = await preferencesService.updatePreferences(preferences);
      dispatch({ type: "UPDATE_PREFERENCES_SUCCESS", payload: response });
    } catch (error) {
      dispatch({
        type: "UPDATE_PREFERENCES_ERROR",
        payload:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const setPreferenceValue = (field: string, value: PreferenceValue) => {
    dispatch({ type: "SET_PREFERENCE_VALUE", field, value });
  };

  const resetPreferences = () => {
    dispatch({ type: "RESET_PREFERENCES" });
  };

  const nextStep = () => {
    if (state.currentStep < state.totalSteps - 1) {
      dispatch({ type: "SET_STEP", payload: state.currentStep + 1 });
    }
  };

  const prevStep = () => {
    if (state.currentStep > 0) {
      dispatch({ type: "SET_STEP", payload: state.currentStep - 1 });
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < state.totalSteps) {
      dispatch({ type: "SET_STEP", payload: step });
    }
  };

  const saveDraft = async () => {
    if (!state.preferences || !state.isDirty) return;

    dispatch({ type: "SAVE_DRAFT_START" });
    try {
      await preferencesService.saveDraft(state.preferences);
      dispatch({ type: "SAVE_DRAFT_SUCCESS" });
    } catch (error) {
      dispatch({
        type: "SAVE_DRAFT_ERROR",
        payload:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const value: PreferencesContextValue = {
    ...state,
    fetchPreferences,
    updatePreferences,
    setPreferenceValue,
    resetPreferences,
    nextStep,
    prevStep,
    goToStep,
    saveDraft,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

// Custom hook
export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
};
