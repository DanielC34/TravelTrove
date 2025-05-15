import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Slider } from "../common/Slider";
import { ErrorMessage } from "../common/ErrorMessage";
import { z } from "zod";

const interestsSchema = z.object({
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
});

type InterestsFormData = z.infer<typeof interestsSchema>;

interface InterestsSliderGroupProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
}

export const InterestsSliderGroup: React.FC<InterestsSliderGroupProps> = ({
  name,
  label,
  description,
  required = false,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<InterestsFormData>();

  const interestOptions = [
    { name: "interests.culture", label: "Culture & Arts", icon: "🎭" },
    { name: "interests.nature", label: "Nature & Outdoors", icon: "🌿" },
    { name: "interests.adventure", label: "Adventure & Sports", icon: "🏃" },
    {
      name: "interests.relaxation",
      label: "Relaxation & Wellness",
      icon: "🧘",
    },
    { name: "interests.food", label: "Food & Dining", icon: "🍽️" },
    { name: "interests.shopping", label: "Shopping & Markets", icon: "🛍️" },
    {
      name: "interests.nightlife",
      label: "Nightlife & Entertainment",
      icon: "🌃",
    },
    { name: "interests.history", label: "History & Heritage", icon: "🏛️" },
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
        {interestOptions.map((option) => (
          <Controller
            key={option.name}
            name={option.name as any}
            control={control}
            render={({ field }) => (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                  </label>
                  <span className="text-sm text-gray-500">{field.value}%</span>
                </div>
                <Slider
                  value={field.value}
                  onChange={field.onChange}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            )}
          />
        ))}
      </div>

      {errors[name]?.interests && (
        <ErrorMessage message={errors[name]?.interests?.message} />
      )}
    </div>
  );
};
