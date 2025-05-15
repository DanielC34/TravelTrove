import React from "react";
import { usePreferencesStore } from "../../store/preferencesStore";
import { PreferenceInput } from "./PreferenceInput";
import { PhysicalIntensity } from "../../shared/interfaces/preferences/activity";
import { ActivityComfortLevels } from "../../shared/interfaces/preferences/activity";

export const ActivityComfortForm: React.FC = () => {
  const { preferences, setPreferenceValue } = usePreferencesStore();

  const activityTypes = [
    {
      value: "hiking",
      label: "Hiking",
      description: "Walking and trekking activities",
    },
    {
      value: "water",
      label: "Water Activities",
      description: "Swimming, snorkeling, diving",
    },
    {
      value: "adventure",
      label: "Adventure Sports",
      description: "Rock climbing, zip-lining, etc.",
    },
    {
      value: "cultural",
      label: "Cultural Activities",
      description: "Museums, temples, local experiences",
    },
    {
      value: "nightlife",
      label: "Nightlife",
      description: "Bars, clubs, evening entertainment",
    },
  ];

  const comfortLevels = [
    PhysicalIntensity.SEDENTARY,
    PhysicalIntensity.LIGHT,
    PhysicalIntensity.MODERATE,
    PhysicalIntensity.VIGOROUS,
    PhysicalIntensity.EXTREME,
  ];

  const durationOptions = ["1-3", "4-6", "7-9", "10+"];

  const restDayOptions = ["none", "moderate", "frequent"];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Activity Comfort Levels
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Set your comfort levels for different types of activities.
        </p>
      </div>

      <div className="space-y-6">
        {activityTypes.map((activity) => (
          <div key={activity.value} className="border-b border-gray-200 pb-6">
            <PreferenceInput
              label={activity.label}
              field={`activityComfort.${activity.value}`}
              type="select"
              options={comfortLevels}
              helpText={activity.description}
            />
          </div>
        ))}

        <div className="mt-6">
          <PreferenceInput
            label="Maximum Daily Activity Duration"
            field="activityComfort.maxDuration"
            type="select"
            options={durationOptions}
            helpText="What's your preferred maximum duration for daily activities?"
          />
        </div>

        <div className="mt-6">
          <PreferenceInput
            label="Rest Day Preference"
            field="activityComfort.restDays"
            type="select"
            options={restDayOptions}
            helpText="How often do you prefer to take rest days during your trip?"
          />
        </div>
      </div>
    </div>
  );
};
