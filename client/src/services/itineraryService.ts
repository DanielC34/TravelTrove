import api from "./api";

export interface Activity {
  name: string;
  description?: string;
  location: { name: string; address?: string };
  startTime: string;
  endTime: string;
  duration: number;
  category: "attraction" | "restaurant" | "transport" | "accommodation" | "activity" | "other";
  cost?: { amount: number; currency: string };
  notes?: string;
  isFlexible: boolean;
  priority: "must-see" | "recommended" | "optional";
}

export const itineraryService = {
  // Reorder activities in a day
  async reorderActivities(tripId: string, dayNumber: number, activities: Activity[]): Promise<void> {
    await api.patch(`/itineraries/${tripId}/days/${dayNumber}/activities/reorder`, {
      activities
    });
  },

  // Add activity to day
  async addActivity(tripId: string, dayNumber: number, activity: Activity): Promise<void> {
    await api.post(`/itineraries/${tripId}/days/${dayNumber}/activities`, activity);
  },

  // Update activity
  async updateActivity(tripId: string, dayNumber: number, activityIndex: number, activity: Activity): Promise<void> {
    await api.put(`/itineraries/${tripId}/days/${dayNumber}/activities/${activityIndex}`, activity);
  },

  // Remove activity
  async removeActivity(tripId: string, dayNumber: number, activityIndex: number): Promise<void> {
    await api.delete(`/itineraries/${tripId}/days/${dayNumber}/activities/${activityIndex}`);
  }
};