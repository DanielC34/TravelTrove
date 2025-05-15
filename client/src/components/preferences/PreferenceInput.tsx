import React, { useState } from "react";
import { usePreferencesStore } from "../../store/preferencesStore";
import { PreferenceValue, UserPreferences } from "../../interfaces/preferences";
import {
  validatePreferenceValue,
  ValidationError,
} from "../../utils/validation";
import { ErrorBoundary } from "../common/ErrorBoundary";

interface PreferenceInputProps {
  label: string;
  field: string;
  type?: "text" | "number" | "checkbox" | "select" | "multiselect";
  options?: string[];
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
  helpText?: string;
}

export const PreferenceInput: React.FC<PreferenceInputProps> = ({
  label,
  field,
  type = "text",
  options,
  placeholder,
  required = false,
  className = "",
  error: propError,
  helpText,
}) => {
  const { preferences, setPreferenceValue } = usePreferencesStore();
  const [error, setError] = useState<string | null>(null);

  // Helper function to get nested value with proper typing
  const getNestedValue = (
    obj: UserPreferences | null,
    path: string
  ): unknown => {
    if (!obj) return null;
    return path.split(".").reduce((acc, part) => {
      if (acc === null || acc === undefined) return null;
      return (acc as Record<string, unknown>)[part];
    }, obj as unknown);
  };

  const value = getNestedValue(preferences, field);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    try {
      const newValue =
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;

      // Validate the new value
      validatePreferenceValue(field, newValue, type, options);

      // If validation passes, update the store
      setPreferenceValue(field, newValue as PreferenceValue);
      setError(null);
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const renderInput = () => {
    switch (type) {
      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
        );
      case "select":
        return (
          <select
            value={String(value || "")}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select an option</option>
            {options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "multiselect": {
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <select
            multiple
            value={selectedValues}
            onChange={(e) => {
              try {
                const values = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                validatePreferenceValue(field, values, type, options);
                setPreferenceValue(field, values as unknown as PreferenceValue);
                setError(null);
              } catch (err) {
                if (err instanceof ValidationError) {
                  setError(err.message);
                } else {
                  setError("An unexpected error occurred");
                }
              }
            }}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      }
      default:
        return (
          <input
            type={type}
            value={String(value || "")}
            onChange={handleChange}
            placeholder={placeholder}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className={`space-y-1 ${className}`}>
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {renderInput()}
        {helpText && <p className="mt-1 text-sm text-gray-500">{helpText}</p>}
        {(error || propError) && (
          <p className="mt-1 text-sm text-red-600">{error || propError}</p>
        )}
      </div>
    </ErrorBoundary>
  );
};
