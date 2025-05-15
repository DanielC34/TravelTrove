import React from "react";
import { PreferenceInput } from "./PreferenceInput";

export const MobilityPreferencesForm: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Mobility Preferences
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Help us understand your mobility needs to ensure we recommend
          accessible travel options.
        </p>
      </div>

      <div className="space-y-4">
        <PreferenceInput
          label="Do you have any mobility needs?"
          field="mobility.hasMobilityNeeds"
          type="checkbox"
          helpText="Select if you have any mobility requirements"
        />

        <PreferenceInput
          label="Requires Wheelchair Access"
          field="mobility.requiresWheelchair"
          type="checkbox"
          helpText="Select if you need wheelchair-accessible facilities"
        />

        <PreferenceInput
          label="Requires Elevator Access"
          field="mobility.requiresElevator"
          type="checkbox"
          helpText="Select if you need elevator access"
        />

        <PreferenceInput
          label="Additional Notes"
          field="mobility.additionalNotes"
          type="text"
          placeholder="Any other mobility requirements or preferences"
          helpText="Optional: Add any other mobility-related information that might be relevant"
        />
      </div>
    </div>
  );
};
