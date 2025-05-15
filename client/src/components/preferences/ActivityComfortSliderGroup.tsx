import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Slider } from "../common/Slider";
import { ErrorMessage } from "../common/ErrorMessage";
import { z } from "zod";

const activityComfortSchema = z.object({
  physicalActivity: z.number().min(0).max(100),
  socialInteraction: z.number().min(0).max(100),
  noiseLevel: z.number().min(0).max(100),
  temperature: z.number().min(0).max(100),
  humidity: z.number().min(0).max(100),
  altitude: z.number().min(0).max(100),
});

type ActivityComfortFormData = z.infer<typeof activityComfortSchema>;

interface ActivityComfortSliderGroupProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
}

export const ActivityComfortSliderGroup: React.FC<
  ActivityComfortSliderGroupProps
> = ({ name, label, description, required = false }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<ActivityComfortFormData>();

  const comfortOptions = [
    {
      name: "physicalActivity",
      label: "Physical Activity Level",
      icon: "🏃",
      description: "How physically demanding do you prefer your activities?",
    },
    {
      name: "socialInteraction",
      label: "Social Interaction",
      icon: "👥",
      description: "How much social interaction do you prefer?",
    },
    {
      name: "noiseLevel",
      label: "Noise Level",
      icon: "🔊",
      description: "What noise level are you comfortable with?",
    },
    {
      name: "temperature",
      label: "Temperature",
      icon: "🌡️",
      description: "What temperature range do you prefer?",
    },
    {
      name: "humidity",
      label: "Humidity",
      icon: "💧",
      description: "How much humidity are you comfortable with?",
    },
    {
      name: "altitude",
      label: "Altitude",
      icon: "⛰️",
      description: "What altitude range are you comfortable with?",
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

      <div className="space-y-8">
        {comfortOptions.map((option) => (
          <div key={option.name}>
            <div className="flex items-center mb-2">
              <span className="mr-2">{option.icon}</span>
              <label className="text-sm font-medium text-gray-700">
                {option.label}
              </label>
            </div>
            <p className="text-sm text-gray-500 mb-2">{option.description}</p>
            <Controller
              name={option.name as keyof ActivityComfortFormData}
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Slider
                    value={field.value}
                    onChange={field.onChange}
                    min={0}
                    max={100}
                    step={5}
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Low</span>
                    <span>{field.value}%</span>
                    <span>High</span>
                  </div>
                </div>
              )}
            />
            {errors[option.name as keyof ActivityComfortFormData] && (
              <ErrorMessage
                message={
                  errors[option.name as keyof ActivityComfortFormData]?.message
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
