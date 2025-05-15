import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PreferencesWizard } from "./PreferencesWizard";
import { DietaryCheckboxGroup } from "./DietaryCheckboxGroup";
import { MobilityCheckboxGroup } from "./MobilityCheckboxGroup";
import { InterestsSliderGroup } from "./InterestsSliderGroup";
import { BudgetRangeSlider } from "./BudgetRangeSlider";
import { AccommodationCheckboxGroup } from "./AccommodationCheckboxGroup";
import { ActivityComfortSliderGroup } from "./ActivityComfortSliderGroup";
import { TransportationCheckboxGroup } from "./TransportationCheckboxGroup";
import { TravelStyleCheckboxGroup } from "./TravelStyleCheckboxGroup";
import { SpecialRequirementsTextArea } from "./SpecialRequirementsTextArea";
import { usePreferences } from "../../contexts/PreferencesContext";

// Reuse the schema from PreferencesWizard
const preferencesSchema = z.object({
  dietary: z.object({
    restrictions: z.object({
      vegetarian: z.boolean(),
      vegan: z.boolean(),
      glutenFree: z.boolean(),
      dairyFree: z.boolean(),
      nutFree: z.boolean(),
      halal: z.boolean(),
      kosher: z.boolean(),
    }),
    preferences: z.object({
      spicy: z.boolean(),
      local: z.boolean(),
      organic: z.boolean(),
      streetFood: z.boolean(),
    }),
    spiceLevel: z.number().min(0).max(100),
  }),
  mobility: z.object({
    level: z.enum(["none", "low", "medium", "high"]),
    requirements: z.object({
      wheelchair: z.boolean(),
      walker: z.boolean(),
      cane: z.boolean(),
      crutches: z.boolean(),
    }),
    limitations: z.object({
      walkingDistance: z.number().min(0).max(100),
      standingTime: z.number().min(0).max(100),
      stairs: z.number().min(0).max(100),
    }),
  }),
  interests: z.object({
    culture: z.number().min(0).max(100),
    nature: z.number().min(0).max(100),
    adventure: z.number().min(0).max(100),
    relaxation: z.number().min(0).max(100),
    food: z.number().min(0).max(100),
    shopping: z.number().min(0).max(100),
    nightlife: z.number().min(0).max(100),
    history: z.number().min(0).max(100),
  }),
  budget: z.object({
    accommodation: z.enum(["budget", "moderate", "luxury"]),
    activities: z.enum(["budget", "moderate", "luxury"]),
    dining: z.enum(["budget", "moderate", "luxury"]),
    flexibility: z.enum(["strict", "moderate", "flexible"]),
    currency: z.enum(["USD", "EUR", "GBP", "JPY", "AUD", "CAD"]),
  }),
  accommodation: z.object({
    preferences: z.object({
      hotel: z.boolean(),
      hostel: z.boolean(),
      apartment: z.boolean(),
      resort: z.boolean(),
      bedAndBreakfast: z.boolean(),
      camping: z.boolean(),
    }),
    requirements: z.object({
      privateBathroom: z.boolean(),
      airConditioning: z.boolean(),
      wifi: z.boolean(),
      breakfast: z.boolean(),
      pool: z.boolean(),
      gym: z.boolean(),
    }),
    location: z.object({
      cityCenter: z.boolean(),
      beachfront: z.boolean(),
      mountains: z.boolean(),
      countryside: z.boolean(),
    }),
  }),
  activityComfort: z.object({
    physicalActivity: z.number().min(0).max(100),
    socialInteraction: z.number().min(0).max(100),
    noiseLevel: z.number().min(0).max(100),
    temperature: z.number().min(0).max(100),
    humidity: z.number().min(0).max(100),
    altitude: z.number().min(0).max(100),
  }),
  transportation: z.object({
    preferences: z.object({
      plane: z.boolean(),
      train: z.boolean(),
      bus: z.boolean(),
      car: z.boolean(),
      boat: z.boolean(),
      bicycle: z.boolean(),
      walking: z.boolean(),
    }),
    requirements: z.object({
      directRoutes: z.boolean(),
      flexibleDates: z.boolean(),
      windowSeat: z.boolean(),
      extraLegroom: z.boolean(),
      priorityBoarding: z.boolean(),
      luggageAllowance: z.boolean(),
    }),
    accessibility: z.object({
      wheelchairAccess: z.boolean(),
      assistanceService: z.boolean(),
      serviceAnimal: z.boolean(),
      oxygenEquipment: z.boolean(),
    }),
  }),
  travelStyle: z.object({
    pace: z.object({
      relaxed: z.boolean(),
      balanced: z.boolean(),
      fastPaced: z.boolean(),
    }),
    style: z.object({
      luxury: z.boolean(),
      adventure: z.boolean(),
      cultural: z.boolean(),
      nature: z.boolean(),
      urban: z.boolean(),
      rural: z.boolean(),
      beach: z.boolean(),
      mountain: z.boolean(),
    }),
    groupSize: z.object({
      solo: z.boolean(),
      couple: z.boolean(),
      family: z.boolean(),
      smallGroup: z.boolean(),
      largeGroup: z.boolean(),
    }),
    season: z.object({
      spring: z.boolean(),
      summer: z.boolean(),
      fall: z.boolean(),
      winter: z.boolean(),
    }),
  }),
  specialRequirements: z.object({
    medical: z.string().max(500).optional(),
    dietary: z.string().max(500).optional(),
    accessibility: z.string().max(500).optional(),
    other: z.string().max(500).optional(),
  }),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

interface ProfilePreferencesProps {
  onCancel: () => void;
}

export const ProfilePreferences: React.FC<ProfilePreferencesProps> = ({
  onCancel,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isWizardMode, setIsWizardMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const {
    preferences,
    isLoading,
    error: contextError,
    updatePreferences,
    loadPreferences,
  } = usePreferences();

  const methods = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: preferences || undefined,
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  useEffect(() => {
    if (preferences) {
      reset(preferences);
    }
  }, [preferences, reset]);

  const handleEdit = () => {
    setValidationErrors({});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setValidationErrors({});
    setIsEditing(false);
    reset(preferences || undefined);
    onCancel();
  };

  const handleSave = async (data: PreferencesFormData) => {
    try {
      await updatePreferences(data);
      setIsEditing(false);
    } catch (err) {
      // Error is handled by the context
    }
  };

  const handleWizardComplete = async (data: PreferencesFormData) => {
    try {
      await updatePreferences(data);
      setIsWizardMode(false);
      setIsEditing(false);
    } catch (err) {
      // Error is handled by the context
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isWizardMode) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <PreferencesWizard
          initialData={preferences}
          onComplete={handleWizardComplete}
        />
      </div>
    );
  }

  if (!isEditing) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        {contextError && (
          <div
            className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg"
            role="alert"
          >
            {contextError}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Travel Preferences
          </h2>
          <div className="space-x-4">
            <button
              onClick={() => setIsWizardMode(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start Wizard
            </button>
            <button
              onClick={handleEdit}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Preferences
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Dietary Preferences
            </h3>
            <DietaryCheckboxGroup
              name="dietary"
              label="Dietary Preferences"
              readOnly
            />
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Mobility & Accessibility
            </h3>
            <MobilityCheckboxGroup
              name="mobility"
              label="Mobility & Accessibility"
              readOnly
            />
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Interests & Activities
            </h3>
            <InterestsSliderGroup
              name="interests"
              label="Interests & Activities"
              readOnly
            />
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Budget Preferences
            </h3>
            <BudgetRangeSlider
              name="budget"
              label="Budget Preferences"
              readOnly
            />
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Accommodation Preferences
            </h3>
            <AccommodationCheckboxGroup
              name="accommodation"
              label="Accommodation Preferences"
              readOnly
            />
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Activity Comfort Levels
            </h3>
            <ActivityComfortSliderGroup
              name="activityComfort"
              label="Activity Comfort Levels"
              readOnly
            />
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Transportation Preferences
            </h3>
            <TransportationCheckboxGroup
              name="transportation"
              label="Transportation Preferences"
              readOnly
            />
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Travel Style
            </h3>
            <TravelStyleCheckboxGroup
              name="travelStyle"
              label="Travel Style"
              readOnly
            />
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Special Requirements
            </h3>
            <SpecialRequirementsTextArea
              name="specialRequirements"
              label="Special Requirements"
              readOnly
            />
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {contextError && (
        <div
          className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg"
          role="alert"
        >
          {contextError}
        </div>
      )}

      {Object.keys(validationErrors).length > 0 && (
        <div
          className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg"
          role="alert"
        >
          <ul className="list-disc list-inside">
            {Object.entries(validationErrors).map(([key, message]) => (
              <li key={key}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Preferences</h2>
        <div className="space-x-4">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(handleSave)}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleSave)} className="space-y-8">
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Dietary Preferences
            </h3>
            <DietaryCheckboxGroup
              name="dietary"
              label="Dietary Preferences"
              required
            />
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Mobility & Accessibility
            </h3>
            <MobilityCheckboxGroup
              name="mobility"
              label="Mobility & Accessibility"
              required
            />
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Interests & Activities
            </h3>
            <InterestsSliderGroup
              name="interests"
              label="Interests & Activities"
              required
            />
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Budget Preferences
            </h3>
            <BudgetRangeSlider
              name="budget"
              label="Budget Preferences"
              required
            />
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Accommodation Preferences
            </h3>
            <AccommodationCheckboxGroup
              name="accommodation"
              label="Accommodation Preferences"
              required
            />
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Activity Comfort Levels
            </h3>
            <ActivityComfortSliderGroup
              name="activityComfort"
              label="Activity Comfort Levels"
              required
            />
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Transportation Preferences
            </h3>
            <TransportationCheckboxGroup
              name="transportation"
              label="Transportation Preferences"
              required
            />
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Travel Style
            </h3>
            <TravelStyleCheckboxGroup
              name="travelStyle"
              label="Travel Style"
              required
            />
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Special Requirements
            </h3>
            <SpecialRequirementsTextArea
              name="specialRequirements"
              label="Special Requirements"
              required
            />
          </section>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
