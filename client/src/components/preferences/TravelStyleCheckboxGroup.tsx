import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Checkbox } from "../common/Checkbox";
import { ErrorMessage } from "../common/ErrorMessage";
import { z } from "zod";

const travelStyleSchema = z.object({
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
});

type TravelStyleFormData = z.infer<typeof travelStyleSchema>;

interface TravelStyleCheckboxGroupProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
}

export const TravelStyleCheckboxGroup: React.FC<
  TravelStyleCheckboxGroupProps
> = ({ name, label, description, required = false }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<TravelStyleFormData>();

  const paceOptions = [
    { name: "pace.relaxed" as const, label: "Relaxed", icon: "😌" },
    { name: "pace.balanced" as const, label: "Balanced", icon: "⚖️" },
    { name: "pace.fastPaced" as const, label: "Fast-Paced", icon: "⚡" },
  ];

  const styleOptions = [
    { name: "style.luxury" as const, label: "Luxury", icon: "✨" },
    { name: "style.adventure" as const, label: "Adventure", icon: "🏃" },
    { name: "style.cultural" as const, label: "Cultural", icon: "🏛️" },
    { name: "style.nature" as const, label: "Nature", icon: "🌿" },
    { name: "style.urban" as const, label: "Urban", icon: "🌆" },
    { name: "style.rural" as const, label: "Rural", icon: "🌄" },
    { name: "style.beach" as const, label: "Beach", icon: "🏖️" },
    { name: "style.mountain" as const, label: "Mountain", icon: "⛰️" },
  ];

  const groupSizeOptions = [
    { name: "groupSize.solo" as const, label: "Solo", icon: "👤" },
    { name: "groupSize.couple" as const, label: "Couple", icon: "👫" },
    { name: "groupSize.family" as const, label: "Family", icon: "👨‍👩‍👧‍👦" },
    { name: "groupSize.smallGroup" as const, label: "Small Group", icon: "👥" },
    {
      name: "groupSize.largeGroup" as const,
      label: "Large Group",
      icon: "👥👥",
    },
  ];

  const seasonOptions = [
    { name: "season.spring" as const, label: "Spring", icon: "🌸" },
    { name: "season.summer" as const, label: "Summer", icon: "☀️" },
    { name: "season.fall" as const, label: "Fall", icon: "🍂" },
    { name: "season.winter" as const, label: "Winter", icon: "❄️" },
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
            Travel Pace
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paceOptions.map((option) => (
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
            Travel Style
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {styleOptions.map((option) => (
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
          <h4 className="text-sm font-medium text-gray-700 mb-2">Group Size</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupSizeOptions.map((option) => (
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
            Preferred Seasons
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seasonOptions.map((option) => (
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
