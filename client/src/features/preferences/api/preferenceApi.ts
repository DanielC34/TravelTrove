import api from "@/services/api";
import type { UserPreferences } from "@/features/preferences/interfaces/preference";

export const preferencesApi = {
  /**
   * Get user preferences
   */
  getUserPreferences: async (): Promise<UserPreferences> => {
    const response = await api.get("/user/preferences");
    return response.data;
  },

  /**
   * Update user preferences
   */
  updatePreferences: async (
    preferences: Partial<UserPreferences>
  ): Promise<UserPreferences> => {
    const response = await api.post("/user/preferences", { preferences });
    return response.data;
  },

  /**
   * Reset user preferences to defaults
   */
  resetPreferences: async (): Promise<void> => {
    await api.delete("/user/preferences");
  },

  /**
   * Get default preferences template
   */
  getDefaultPreferences: async (): Promise<UserPreferences> => {
    const response = await api.get("/user/preferences/defaults");
    return response.data;
  },

  /**
   * Validate preferences data
   */
  validatePreferences: async (
    preferences: Partial<UserPreferences>
  ): Promise<{
    isValid: boolean;
    errors?: string[];
  }> => {
    const response = await api.post("/user/preferences/validate", {
      preferences,
    });
    return response.data;
  },

  /**
   * Apply preferences to trip planning
   */
  applyToTrip: async (
    tripId: string,
    preferences: Partial<UserPreferences>
  ): Promise<{
    success: boolean;
    modifiedTrip?: any; // Replace 'any' with your Trip type
  }> => {
    const response = await api.post(`/trips/${tripId}/apply-preferences`, {
      preferences,
    });
    return response.data;
  },
};

// Error types for preference-related operations
export class PreferencesError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "PreferencesError";
  }
}

export class ValidationError extends PreferencesError {
  constructor(message: string, public errors: string[]) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class NotFoundError extends PreferencesError {
  constructor(message: string = "Preferences not found") {
    super(message, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}
