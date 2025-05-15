import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePreferences } from "../../context/PreferencesContext";
import { DietaryCheckboxGroup } from "./DietaryCheckboxGroup";
import { MobilityCheckboxGroup } from "./MobilityCheckboxGroup";
import { InterestsSliderGroup } from "./InterestsSliderGroup";
import { BudgetRangeSlider } from "./BudgetRangeSlider";
import { AccommodationCheckboxGroup } from "./AccommodationCheckboxGroup";
import { ActivityComfortSliderGroup } from "./ActivityComfortSliderGroup";
import { TransportationCheckboxGroup } from "./TransportationCheckboxGroup";
import { TravelStyleCheckboxGroup } from "./TravelStyleCheckboxGroup";
import { SpecialRequirementsTextArea } from "./SpecialRequirementsTextArea";

// Define the complete preferences schema
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

const steps = [
  {
    id: "dietary",
    title: "Dietary Preferences",
    component: DietaryCheckboxGroup,
    description: "Tell us about your dietary preferences and restrictions",
  },
  {
    id: "mobility",
    title: "Mobility & Accessibility",
    component: MobilityCheckboxGroup,
    description: "Help us understand your mobility needs",
  },
  {
    id: "interests",
    title: "Interests & Activities",
    component: InterestsSliderGroup,
    description: "What activities interest you the most?",
  },
  {
    id: "budget",
    title: "Budget Preferences",
    component: BudgetRangeSlider,
    description: "Set your budget preferences for different aspects of travel",
  },
  {
    id: "accommodation",
    title: "Accommodation Preferences",
    component: AccommodationCheckboxGroup,
    description: "Tell us about your accommodation preferences",
  },
  {
    id: "activityComfort",
    title: "Activity Comfort Levels",
    component: ActivityComfortSliderGroup,
    description: "Set your comfort levels for various activities",
  },
  {
    id: "transportation",
    title: "Transportation Preferences",
    component: TransportationCheckboxGroup,
    description: "How do you prefer to get around?",
  },
  {
    id: "travelStyle",
    title: "Travel Style",
    component: TravelStyleCheckboxGroup,
    description: "What's your preferred travel style?",
  },
  {
    id: "specialRequirements",
    title: "Special Requirements",
    component: SpecialRequirementsTextArea,
    description: "Any special requirements we should know about?",
  },
];

interface PreferencesWizardProps {
  onComplete: (data: PreferencesFormData) => Promise<void>;
  initialData?: Partial<PreferencesFormData>;
}

export const PreferencesWizard: React.FC<PreferencesWizardProps> = ({
  onComplete,
  initialData,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [stepCompletion, setStepCompletion] = useState<Record<string, boolean>>(
    {}
  );

  const { isLoading, error: contextError } = usePreferences();

  const methods = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: initialData,
  });

  const {
    handleSubmit,
    trigger,
    formState: { errors },
  } = methods;

  const nextStep = async () => {
    setValidationErrors({});
    const currentStepId = steps[currentStep].id;
    try {
      const isValid = await trigger(currentStepId as keyof PreferencesFormData);
      if (isValid) {
        setStepCompletion((prev) => ({ ...prev, [currentStepId]: true }));
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      } else {
        // Collect validation errors for the current step
        const stepErrors = Object.entries(errors)
          .filter(([key]) => key.startsWith(currentStepId))
          .reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]: value.message || "This field is required",
            }),
            {}
          );
        setValidationErrors(stepErrors);
      }
    } catch (err) {
      setValidationErrors({
        [currentStepId]:
          "An error occurred while validating the form. Please try again.",
      });
    }
  };

  const prevStep = () => {
    setValidationErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: PreferencesFormData) => {
    try {
      await onComplete(data);
      // Show success state
      setStepCompletion((prev) => ({ ...prev, completed: true }));
    } catch (err) {
      // Error is handled by the context
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {steps[currentStep].title}
            </h2>
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          <p className="text-gray-600">{steps[currentStep].description}</p>
        </div>

        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {Math.round(progress)}% Complete
          </div>
        </div>

        {contextError && (
          <div
            className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
            role="alert"
          >
            {contextError}
          </div>
        )}

        {Object.keys(validationErrors).length > 0 && (
          <div
            className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
            role="alert"
          >
            <ul className="list-disc list-inside">
              {Object.entries(validationErrors).map(([key, message]) => (
                <li key={key}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}
          <CurrentStepComponent
            name={steps[currentStep].id}
            label={steps[currentStep].title}
            description={steps[currentStep].description}
            required
          />
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0 || isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {isLastStep ? (
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                "Complete"
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Completed Steps:
          </h3>
          <div className="flex flex-wrap gap-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  stepCompletion[step.id]
                    ? "bg-green-100 text-green-800"
                    : index === currentStep
                    ? "bg-indigo-100 text-indigo-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
