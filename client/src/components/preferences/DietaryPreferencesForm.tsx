import React from "react";
import { PreferenceInput } from "./PreferenceInput";
import { DietaryRestriction } from "../../interfaces/preferences";

const DIETARY_RESTRICTIONS: DietaryRestriction[] = [
  "vegetarian",
  "vegan",
  "gluten-free",
  "dairy-free",
  "halal",
  "kosher",
];

export const DietaryPreferencesForm: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Dietary Preferences
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Let us know about your dietary restrictions and preferences to help us
          provide better recommendations.
        </p>
      </div>

      <div className="space-y-4">
        <PreferenceInput
          label="Dietary Restrictions"
          field="dietary.restrictions"
          type="multiselect"
          options={DIETARY_RESTRICTIONS}
          helpText="Select all that apply"
        />

        <PreferenceInput
          label="Food Allergies"
          field="dietary.allergies"
          type="text"
          placeholder="Enter allergies separated by commas"
          helpText="List any food allergies or intolerances"
        />

        <PreferenceInput
          label="Additional Notes"
          field="dietary.additionalNotes"
          type="text"
          placeholder="Any other dietary preferences or requirements"
          helpText="Optional: Add any other dietary information that might be relevant"
        />
      </div>
    </div>
  );
};
