import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { DietaryRestriction } from "../../shared/interfaces/preferences/dietary";
import { Checkbox } from "../common/Checkbox";
import { ErrorMessage } from "../common/ErrorMessage";
import { z } from "zod";

const dietarySchema = z.object({
  restrictions: z
    .array(z.nativeEnum(DietaryRestriction))
    .min(1, "Please select at least one dietary restriction"),
  preferences: z.object({
    spicy: z.enum(["none", "mild", "medium", "hot"]),
    localCuisine: z.boolean(),
    streetFood: z.boolean(),
    fineDining: z.boolean(),
  }),
});

type DietaryFormData = z.infer<typeof dietarySchema>;

interface DietaryCheckboxGroupProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
}

export const DietaryCheckboxGroup: React.FC<DietaryCheckboxGroupProps> = ({
  name,
  label,
  description,
  required = false,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<DietaryFormData>();

  const dietaryOptions = [
    { value: DietaryRestriction.VEGETARIAN, label: "Vegetarian" },
    { value: DietaryRestriction.VEGAN, label: "Vegan" },
    { value: DietaryRestriction.GLUTEN_FREE, label: "Gluten-Free" },
    { value: DietaryRestriction.DAIRY_FREE, label: "Dairy-Free" },
    { value: DietaryRestriction.NUT_FREE, label: "Nut-Free" },
    { value: DietaryRestriction.HALAL, label: "Halal" },
    { value: DietaryRestriction.KOSHER, label: "Kosher" },
  ];

  const preferenceOptions = [
    {
      name: "preferences.spicy",
      label: "Spice Level",
      type: "select" as const,
      options: [
        { value: "none", label: "No Spice" },
        { value: "mild", label: "Mild" },
        { value: "medium", label: "Medium" },
        { value: "hot", label: "Hot" },
      ],
    },
    {
      name: "preferences.localCuisine",
      label: "Local Cuisine",
      type: "checkbox" as const,
    },
    {
      name: "preferences.streetFood",
      label: "Street Food",
      type: "checkbox" as const,
    },
    {
      name: "preferences.fineDining",
      label: "Fine Dining",
      type: "checkbox" as const,
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
            Dietary Restrictions
          </h4>
          <Controller
            name={`${name}.restrictions`}
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dietaryOptions.map((option) => (
                  <Checkbox
                    key={option.value}
                    label={option.label}
                    checked={field.value?.includes(option.value)}
                    onChange={(checked) => {
                      const newValue = checked
                        ? [...(field.value || []), option.value]
                        : (field.value || []).filter((v) => v !== option.value);
                      field.onChange(newValue);
                    }}
                  />
                ))}
              </div>
            )}
          />
          {errors[name]?.restrictions && (
            <ErrorMessage message={errors[name]?.restrictions?.message} />
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Food Preferences
          </h4>
          <div className="space-y-4">
            {preferenceOptions.map((option) => (
              <Controller
                key={option.name}
                name={option.name as any}
                control={control}
                render={({ field }) => (
                  <div>
                    {option.type === "select" ? (
                      <select
                        {...field}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        {option.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Checkbox
                        label={option.label}
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    )}
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
