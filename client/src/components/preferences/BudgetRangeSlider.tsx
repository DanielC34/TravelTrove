import React from "react";
import { useFormContext, Controller, Path } from "react-hook-form";
import { BudgetLevel } from "../../shared/interfaces/preferences/budget";
import { Slider } from "../common/Slider";
import { ErrorMessage } from "../common/ErrorMessage";
import { z } from "zod";

const budgetSchema = z.object({
  accommodation: z.nativeEnum(BudgetLevel),
  activities: z.nativeEnum(BudgetLevel),
  dining: z.nativeEnum(BudgetLevel),
  flexibility: z.enum(["strict", "moderate", "flexible"]),
  currency: z.enum(["USD", "EUR", "GBP", "JPY", "AUD", "CAD"]),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

interface BudgetRangeSliderProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
}

export const BudgetRangeSlider: React.FC<BudgetRangeSliderProps> = ({
  name,
  label,
  description,
  required = false,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<BudgetFormData>();

  const budgetOptions = [
    {
      name: "accommodation" as const,
      label: "Accommodation Budget",
      icon: "🏨",
    },
    { name: "activities" as const, label: "Activities Budget", icon: "🎯" },
    { name: "dining" as const, label: "Dining Budget", icon: "🍽️" },
  ];

  const budgetLevels = [
    { value: BudgetLevel.BUDGET, label: "Budget" },
    { value: BudgetLevel.MODERATE, label: "Moderate" },
    { value: BudgetLevel.LUXURY, label: "Luxury" },
  ];

  const flexibilityOptions = [
    { value: "strict" as const, label: "Strict" },
    { value: "moderate" as const, label: "Moderate" },
    { value: "flexible" as const, label: "Flexible" },
  ];

  const currencyOptions = [
    { value: "USD" as const, label: "USD ($)" },
    { value: "EUR" as const, label: "EUR (€)" },
    { value: "GBP" as const, label: "GBP (£)" },
    { value: "JPY" as const, label: "JPY (¥)" },
    { value: "AUD" as const, label: "AUD (A$)" },
    { value: "CAD" as const, label: "CAD (C$)" },
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
        {budgetOptions.map((option) => (
          <div key={option.name}>
            <div className="flex items-center mb-2">
              <span className="mr-2">{option.icon}</span>
              <label className="text-sm font-medium text-gray-700">
                {option.label}
              </label>
            </div>
            <Controller
              name={option.name}
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-4">
                  {budgetLevels.map((level) => (
                    <div key={level.value} className="flex items-center">
                      <input
                        type="radio"
                        id={`${option.name}-${level.value}`}
                        {...field}
                        value={level.value}
                        checked={field.value === level.value}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label
                        htmlFor={`${option.name}-${level.value}`}
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        {level.label}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            />
            {errors[option.name] && (
              <ErrorMessage message={errors[option.name]?.message} />
            )}
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget Flexibility
          </label>
          <Controller
            name="flexibility"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-4">
                {flexibilityOptions.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      id={`flexibility-${option.value}`}
                      {...field}
                      value={option.value}
                      checked={field.value === option.value}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label
                      htmlFor={`flexibility-${option.value}`}
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            )}
          />
          {errors.flexibility && (
            <ErrorMessage message={errors.flexibility.message} />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Currency
          </label>
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {currencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.currency && (
            <ErrorMessage message={errors.currency.message} />
          )}
        </div>
      </div>
    </div>
  );
};
