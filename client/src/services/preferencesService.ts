import axios from "axios";
import {
  UserPreferences,
  PreferencesFormData,
  DietaryPreferences,
  MobilityPreferences,
  TravelInterests,
  BudgetPreferences,
  ActivityComfortLevel,
  PreferenceValue,
} from "../interfaces/preferences";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

// Define valid section names
export type PreferenceSection =
  | "dietary"
  | "mobility"
  | "travelInterests"
  | "budget"
  | "activityComfortLevels";

// Map section names to their corresponding types
type SectionTypeMap = {
  dietary: DietaryPreferences;
  mobility: MobilityPreferences;
  travelInterests: TravelInterests;
  budget: BudgetPreferences;
  activityComfortLevels: ActivityComfortLevel[];
};

export const preferencesService = {
  async getPreferences(): Promise<UserPreferences> {
    const response = await axios.get(`${API_URL}/preferences`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  },

  async updatePreferences(
    preferences: PreferencesFormData
  ): Promise<UserPreferences> {
    const response = await axios.put(`${API_URL}/preferences`, preferences, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  },

  async updatePreferenceSection<T extends PreferenceSection>(
    section: T,
    data: SectionTypeMap[T]
  ): Promise<UserPreferences> {
    const response = await axios.patch(
      `${API_URL}/preferences/${section}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  },

  async deletePreferences(): Promise<void> {
    await axios.delete(`${API_URL}/preferences`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },

  async saveDraft(preferences: Partial<PreferencesFormData>): Promise<void> {
    await axios.post(`${API_URL}/preferences/draft`, preferences, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },
};
