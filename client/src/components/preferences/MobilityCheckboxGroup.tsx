import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { MobilityLevel } from "../../shared/interfaces/preferences/mobility";
import { Checkbox } from "../common/Checkbox";
import { ErrorMessage } from "../common/ErrorMessage";
import { z } from "zod";

const mobilitySchema = z.object({
  level: z.nativeEnum(MobilityLevel),
  requirements: z.object({
    wheelchairAccess: z.boolean(),
    elevatorAccess: z.boolean(),
    ramps: z.boolean(),
    limitedStairs: z.boolean(),
    restAreas: z.boolean(),
  }),
  limitations: z.object({
    maxWalkingDistance: z.number().min(0).max(50),
    maxStandingTime: z.number().min(0).max(480),
    restFrequency: z.number().min(0).max(120),
  }),
});

type MobilityFormData = z.infer<typeof mobilitySchema>;

interface MobilityCheckboxGroupProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
}

export const MobilityCheckboxGroup: React.FC<MobilityCheckboxGroupProps> = ({
  name,
  label,
  description,
  required = false,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<MobilityFormData>();

  const mobilityLevels = [
    { value: MobilityLevel.INDEPENDENT, label: "Independent" },
    { value: MobilityLevel.ASSISTED, label: "Assisted" },
    { value: MobilityLevel.WHEELCHAIR, label: "Wheelchair" },
    { value: MobilityLevel.MOBILITY_AID, label: "Mobility Aid" },
  ];

  const requirementOptions = [
    { name: "requirements.wheelchairAccess", label: "Wheelchair Access" },
    { name: "requirements.elevatorAccess", label: "Elevator Access" },
    { name: "requirements.ramps", label: "Ramps" },
    { name: "requirements.limitedStairs", label: "Limited Stairs" },
    { name: "requirements.restAreas", label: "Rest Areas" },
  ];

  const limitationOptions = [
    {
      name: "limitations.maxWalkingDistance",
      label: "Maximum Walking Distance (km)",
      type: "number" as const,
    },
    {
      name: "limitations.maxStandingTime",
      label: "Maximum Standing Time (minutes)",
      type: "number" as const,
    },
    {
      name: "limitations.restFrequency",
      label: "Rest Frequency (minutes)",
      type: "number" as const,
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

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Mobility Level
          </h4>
          <Controller
            name={`${name}.level`}
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mobilityLevels.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      id={option.value}
                      {...field}
                      value={option.value}
                      checked={field.value === option.value}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label
                      htmlFor={option.value}
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            )}
          />
          {errors[name]?.level && (
            <ErrorMessage message={errors[name]?.level?.message} />
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Accessibility Requirements
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requirementOptions.map((option) => (
              <Controller
                key={option.name}
                name={option.name as any}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label={option.label}
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
            Limitations
          </h4>
          <div className="space-y-4">
            {limitationOptions.map((option) => (
              <Controller
                key={option.name}
                name={option.name as any}
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {option.label}
                    </label>
                    <input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      min={0}
                      max={
                        option.name.includes("Walking")
                          ? 50
                          : option.name.includes("Standing")
                          ? 480
                          : 120
                      }
                    />
                  </div>
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
