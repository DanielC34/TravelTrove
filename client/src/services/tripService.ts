import api from "./api";

export interface Trip {
  _id: string;
  userId: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: {
    count: number;
    type: "solo" | "couple" | "family" | "group";
    details?: string;
  };
  budget: {
    amount: number;
    currency: string;
    type: "budget" | "moderate" | "premium" | "luxury";
  };
  status: "draft" | "planning" | "confirmed" | "completed" | "cancelled";
  description?: string;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripData {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: {
    count: number;
    type: "solo" | "couple" | "family" | "group";
    details?: string;
  };
  budget: {
    amount: number;
    currency: string;
    type: "budget" | "moderate" | "premium" | "luxury";
  };
  description?: string;
  tags?: string[];
}

export interface UpdateTripData extends Partial<CreateTripData> {
  status?: "draft" | "planning" | "confirmed" | "completed" | "cancelled";
}

export interface TripStats {
  totalTrips: number;
  upcomingTrips: number;
  byStatus: Record<string, number>;
}

export const tripService = {
  // Get all trips for the current user
  async getTrips(params?: {
    status?: string;
    destination?: string;
  }): Promise<Trip[]> {
    try {
      const response = await api.get("/trips", { params });
      return response.data.data || response.data || [];
    } catch (error) {
      console.error("Error fetching trips:", error);
      throw new Error("Failed to fetch trips");
    }
  },

  // Get a single trip by ID
  async getTrip(id: string): Promise<{ trip: Trip; itinerary: any }> {
    try {
      const response = await api.get(`/trips/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching trip:", error);
      throw new Error("Failed to fetch trip");
    }
  },

  // Create a new trip
  async createTrip(tripData: CreateTripData): Promise<Trip> {
    try {
      const response = await api.post("/trips", tripData);
      return response.data;
    } catch (error: any) {
      console.error("Error creating trip:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to create trip");
    }
  },

  // Update a trip
  async updateTrip(id: string, tripData: UpdateTripData): Promise<Trip> {
    try {
      const response = await api.put(`/trips/${id}`, tripData);
      return response.data;
    } catch (error: any) {
      console.error("Error updating trip:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to update trip");
    }
  },

  // Update trip status
  async updateTripStatus(id: string, status: Trip["status"]): Promise<Trip> {
    try {
      const response = await api.patch(`/trips/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      console.error("Error updating trip status:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to update trip status");
    }
  },

  // Delete a trip
  async deleteTrip(id: string): Promise<void> {
    try {
      await api.delete(`/trips/${id}`);
    } catch (error: any) {
      console.error("Error deleting trip:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to delete trip");
    }
  },

  // Get trip statistics
  async getTripStats(): Promise<TripStats> {
    try {
      const response = await api.get("/trips/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching trip stats:", error);
      throw new Error("Failed to fetch trip statistics");
    }
  },
};
