import React from "react";
import { useFormContext, Controller, Path } from "react-hook-form";
import { Checkbox } from "../common/Checkbox";
import { ErrorMessage } from "../common/ErrorMessage";
import { z } from "zod";

const accommodationSchema = z.object({
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
});

type AccommodationFormData = z.infer<typeof accommodationSchema>;

interface AccommodationCheckboxGroupProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
}

export const AccommodationCheckboxGroup: React.FC<
  AccommodationCheckboxGroupProps
> = ({ name, label, description, required = false }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<AccommodationFormData>();

  const preferenceOptions = [
    { name: "preferences.hotel" as const, label: "Hotel", icon: "🏨" },
    { name: "preferences.hostel" as const, label: "Hostel", icon: "🏠" },
    { name: "preferences.apartment" as const, label: "Apartment", icon: "🏢" },
    { name: "preferences.resort" as const, label: "Resort", icon: "🌴" },
    {
      name: "preferences.bedAndBreakfast" as const,
      label: "Bed & Breakfast",
      icon: "🛏️",
    },
    { name: "preferences.camping" as const, label: "Camping", icon: "⛺" },
  ];

  const requirementOptions = [
    {
      name: "requirements.privateBathroom" as const,
      label: "Private Bathroom",
      icon: "🚿",
    },
    {
      name: "requirements.airConditioning" as const,
      label: "Air Conditioning",
      icon: "❄️",
    },
    { name: "requirements.wifi" as const, label: "Free WiFi", icon: "📶" },
    {
      name: "requirements.breakfast" as const,
      label: "Breakfast Included",
      icon: "🍳",
    },
    { name: "requirements.pool" as const, label: "Swimming Pool", icon: "🏊" },
    { name: "requirements.gym" as const, label: "Fitness Center", icon: "💪" },
  ];

  const locationOptions = [
    { name: "location.cityCenter" as const, label: "City Center", icon: "🌆" },
    { name: "location.beachfront" as const, label: "Beachfront", icon: "🏖️" },
    { name: "location.mountains" as const, label: "Mountains", icon: "⛰️" },
    { name: "location.countryside" as const, label: "Countryside", icon: "🌄" },
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
            Accommodation Types
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
            Amenities & Requirements
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
            Preferred Location
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locationOptions.map((option) => (
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
