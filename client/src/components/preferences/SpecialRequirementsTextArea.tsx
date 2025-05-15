import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { ErrorMessage } from "../common/ErrorMessage";
import { z } from "zod";

const specialRequirementsSchema = z.object({
  medical: z.string().max(500).optional(),
  dietary: z.string().max(500).optional(),
  accessibility: z.string().max(500).optional(),
  other: z.string().max(500).optional(),
});

type SpecialRequirementsFormData = z.infer<typeof specialRequirementsSchema>;

interface SpecialRequirementsTextAreaProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
}

export const SpecialRequirementsTextArea: React.FC<
  SpecialRequirementsTextAreaProps
> = ({ name, label, description, required = false }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<SpecialRequirementsFormData>();

  const requirementFields = [
    {
      name: "medical" as const,
      label: "Medical Requirements",
      icon: "🏥",
      placeholder:
        "Please list any medical conditions, medications, or special medical needs...",
    },
    {
      name: "dietary" as const,
      label: "Dietary Requirements",
      icon: "🍽️",
      placeholder:
        "Please list any dietary restrictions, allergies, or special dietary needs...",
    },
    {
      name: "accessibility" as const,
      label: "Accessibility Requirements",
      icon: "♿",
      placeholder:
        "Please list any accessibility needs or mobility requirements...",
    },
    {
      name: "other" as const,
      label: "Other Requirements",
      icon: "📝",
      placeholder:
        "Please list any other special requirements or considerations...",
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
        {requirementFields.map((field) => (
          <div key={field.name}>
            <div className="flex items-center mb-2">
              <span className="mr-2">{field.icon}</span>
              <label className="text-sm font-medium text-gray-700">
                {field.label}
              </label>
            </div>
            <Controller
              name={field.name}
              control={control}
              render={({ field: { value, onChange } }) => (
                <textarea
                  value={value}
                  onChange={onChange}
                  placeholder={field.placeholder}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              )}
            />
            {errors[field.name] && (
              <ErrorMessage message={errors[field.name]?.message} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
