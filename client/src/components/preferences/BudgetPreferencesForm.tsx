import React from "react";
import { usePreferencesStore } from "../../store/preferencesStore";
import { PreferenceInput } from "./PreferenceInput";
import { BudgetLevel } from "../../shared/interfaces/preferences/budget";

export const BudgetPreferencesForm: React.FC = () => {
  const { preferences, setPreferenceValue } = usePreferencesStore();

  const budgetRanges = [
    BudgetLevel.BUDGET,
    BudgetLevel.MODERATE,
    BudgetLevel.LUXURY,
  ];

  const flexibilityOptions = ["strict", "moderate", "flexible"];

  const currencyOptions = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD"];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Budget Preferences
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Set your budget preferences for different aspects of your trip.
        </p>
      </div>

      <div className="space-y-6">
        <PreferenceInput
          label="Accommodation Budget"
          field="budget.accommodation"
          type="select"
          options={budgetRanges}
          helpText="Select your preferred budget range for accommodations"
        />

        <PreferenceInput
          label="Activity Budget"
          field="budget.activities"
          type="select"
          options={budgetRanges}
          helpText="Select your preferred budget range for activities and experiences"
        />

        <PreferenceInput
          label="Dining Budget"
          field="budget.dining"
          type="select"
          options={budgetRanges}
          helpText="Select your preferred budget range for meals and dining"
        />

        <PreferenceInput
          label="Flexibility with Budget"
          field="budget.flexibility"
          type="select"
          options={flexibilityOptions}
          helpText="How flexible are you with your budget?"
        />

        <PreferenceInput
          label="Currency Preference"
          field="budget.currency"
          type="select"
          options={currencyOptions}
          helpText="Select your preferred currency for budget planning"
        />
      </div>
    </div>
  );
};
