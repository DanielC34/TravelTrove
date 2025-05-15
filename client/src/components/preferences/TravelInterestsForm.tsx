import React from "react";
import { usePreferencesStore } from "../../store/preferencesStore";
import { PreferenceInput } from "./PreferenceInput";
import {
  TravelPace,
  GroupSize,
} from "../../shared/interfaces/preferences/travel";

export const TravelInterestsForm: React.FC = () => {
  const { preferences, setPreferenceValue } = usePreferencesStore();

  const travelInterests = [
    "adventure",
    "culture",
    "nature",
    "food",
    "history",
    "shopping",
    "relaxation",
    "nightlife",
    "photography",
    "architecture",
  ];

  const paceOptions = [
    TravelPace.RELAXED,
    TravelPace.MODERATE,
    TravelPace.FAST,
  ];

  const groupSizeOptions = [
    GroupSize.SOLO,
    GroupSize.COUPLE,
    GroupSize.SMALL_GROUP,
    GroupSize.LARGE_GROUP,
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Travel Interests
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Select your interests and preferences for travel.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Select Your Interests
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {travelInterests.map((interest) => (
              <PreferenceInput
                key={interest}
                label={interest.charAt(0).toUpperCase() + interest.slice(1)}
                field={`interests.${interest}`}
                type="checkbox"
              />
            ))}
          </div>
        </div>

        <PreferenceInput
          label="Preferred Travel Pace"
          field="travelPace"
          type="select"
          options={paceOptions}
          helpText="How fast-paced do you prefer your travel to be?"
        />

        <PreferenceInput
          label="Group Size Preference"
          field="groupSize"
          type="select"
          options={groupSizeOptions}
          helpText="What's your preferred group size for travel?"
        />
      </div>
    </div>
  );
};
