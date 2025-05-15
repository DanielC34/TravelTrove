import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Checkbox } from "../common/Checkbox";
import { ErrorMessage } from "../common/ErrorMessage";
import { z } from "zod";

const transportationSchema = z.object({
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
});

type TransportationFormData = z.infer<typeof transportationSchema>;

interface TransportationCheckboxGroupProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
}

export const TransportationCheckboxGroup: React.FC<
  TransportationCheckboxGroupProps
> = ({ name, label, description, required = false }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<TransportationFormData>();

  const preferenceOptions = [
    { name: "preferences.plane" as const, label: "Plane", icon: "✈️" },
    { name: "preferences.train" as const, label: "Train", icon: "🚂" },
    { name: "preferences.bus" as const, label: "Bus", icon: "🚌" },
    { name: "preferences.car" as const, label: "Car", icon: "🚗" },
    { name: "preferences.boat" as const, label: "Boat", icon: "⛴️" },
    { name: "preferences.bicycle" as const, label: "Bicycle", icon: "🚲" },
    { name: "preferences.walking" as const, label: "Walking", icon: "🚶" },
  ];

  const requirementOptions = [
    {
      name: "requirements.directRoutes" as const,
      label: "Direct Routes",
      icon: "➡️",
    },
    {
      name: "requirements.flexibleDates" as const,
      label: "Flexible Dates",
      icon: "📅",
    },
    {
      name: "requirements.windowSeat" as const,
      label: "Window Seat",
      icon: "🪟",
    },
    {
      name: "requirements.extraLegroom" as const,
      label: "Extra Legroom",
      icon: "🦵",
    },
    {
      name: "requirements.priorityBoarding" as const,
      label: "Priority Boarding",
      icon: "🎫",
    },
    {
      name: "requirements.luggageAllowance" as const,
      label: "Extra Luggage",
      icon: "🧳",
    },
  ];

  const accessibilityOptions = [
    {
      name: "accessibility.wheelchairAccess" as const,
      label: "Wheelchair Access",
      icon: "♿",
    },
    {
      name: "accessibility.assistanceService" as const,
      label: "Assistance Service",
      icon: "🤝",
    },
    {
      name: "accessibility.serviceAnimal" as const,
      label: "Service Animal",
      icon: "🐕",
    },
    {
      name: "accessibility.oxygenEquipment" as const,
      label: "Oxygen Equipment",
      icon: "🫧",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Transportation Types
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {preferenceOptions.map((option) => (
              <Controller
                key={option.name}
                name={option.name}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label={
                      <span className="flex items-center">
                        <span className="mr-2">{option.icon}</span>
                        {option.label}
                      </span>
                    }
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Travel Requirements
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requirementOptions.map((option) => (
              <Controller
                key={option.name}
                name={option.name}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label={
                      <span className="flex items-center">
                        <span className="mr-2">{option.icon}</span>
                        {option.label}
                      </span>
                    }
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Accessibility Needs
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accessibilityOptions.map((option) => (
              <Controller
                key={option.name}
                name={option.name}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label={
                      <span className="flex items-center">
                        <span className="mr-2">{option.icon}</span>
                        {option.label}
                      </span>
                    }
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {errors[name] && <ErrorMessage message={errors[name]?.message} />}
    </div>
  );
};
