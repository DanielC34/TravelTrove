import React from "react";
import { usePreferencesStore } from "../../store/preferencesStore";
import { ErrorBoundary } from "../common/ErrorBoundary";
import { ActivityComfortForm } from "./ActivityComfortForm";
import { BudgetPreferencesForm } from "./BudgetPreferencesForm";
import { TravelInterestsForm } from "./TravelInterestsForm";
import {
  validateBudgetPreferences,
  validateTravelPreferences,
  validateDietaryPreferences,
  validateMobilityPreferences,
  validateActivityComfortPreferences,
  validateActivityComfortLevels,
  validateCrossFieldDependencies,
} from "../../utils/validation";
import { UserPreferences } from "../../interfaces/preferences";
import { BudgetPreferences as BudgetPreferencesType } from "../../shared/interfaces/preferences/budget";
import { TravelPreferences as TravelPreferencesType } from "../../shared/interfaces/preferences/travel";
import { DietaryPreferences as DietaryPreferencesType } from "../../shared/interfaces/preferences/dietary";
import { MobilityPreferences as MobilityPreferencesType } from "../../shared/interfaces/preferences/mobility";
import {
  ActivityComfortPreferences as ActivityComfortPreferencesType,
  ActivityComfortLevels as ActivityComfortLevelsType,
} from "../../shared/interfaces/preferences/activity";

interface PreferencesState {
  budget?: Partial<BudgetPreferencesType>;
  travel?: Partial<TravelPreferencesType>;
  dietary?: Partial<DietaryPreferencesType>;
  mobility?: Partial<MobilityPreferencesType>;
  activityComfort?: Partial<ActivityComfortPreferencesType>;
  activityComfortLevels?: Partial<ActivityComfortLevelsType>;
}

export const PreferencesForm: React.FC = () => {
  const {
    preferences,
    isLoading,
    error,
    currentStep,
    totalSteps,
    fetchPreferences,
    updatePreferences,
    nextStep,
    prevStep,
    goToStep,
    saveDraft,
  } = usePreferencesStore();

  React.useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate preferences before submitting
      if (preferences) {
        const prefs = preferences as PreferencesState;
        validateBudgetPreferences(prefs.budget || {});
        validateTravelPreferences(prefs.travel || {});
        validateDietaryPreferences(prefs.dietary || {});
        validateMobilityPreferences(prefs.mobility || {});
        validateActivityComfortPreferences(prefs.activityComfort || {});
        validateActivityComfortLevels(prefs.activityComfortLevels || {});
        validateCrossFieldDependencies(prefs);
      }
      await updatePreferences(preferences);
    } catch (err) {
      console.error("Error updating preferences:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-lg font-medium text-red-800">Error</h3>
        <p className="mt-2 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Progress Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToStep(i + 1)}
                className={`w-3 h-3 rounded-full ${
                  currentStep === i + 1
                    ? "bg-indigo-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-6">
          {currentStep === 1 && <TravelInterestsForm />}
          {currentStep === 2 && <BudgetPreferencesForm />}
          {currentStep === 3 && <ActivityComfortForm />}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Previous
          </button>
          <div className="space-x-4">
            <button
              type="button"
              onClick={saveDraft}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Draft
            </button>
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </form>
    </ErrorBoundary>
  );
};
