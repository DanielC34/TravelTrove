import api from "./api";

export interface Activity {
  name: string;
  description: string;
  location: {
    name: string;
    address?: string;
  };
  startTime: string;
  endTime: string;
  duration: number;
  category:
    | "attraction"
    | "restaurant"
    | "transport"
    | "accommodation"
    | "activity"
    | "other";
  cost: {
    amount: number;
    currency: string;
  };
  notes?: string;
  isFlexible: boolean;
  priority: "must-see" | "recommended" | "optional";
}

export interface ItineraryDay {
  date: string;
  dayNumber: number;
  activities: Activity[];
  notes?: string;
  weather?: {
    forecast: string;
    temperature: number;
    conditions: string;
  };
}

export interface Itinerary {
  _id?: string;
  tripId: string;
  name: string;
  description: string;
  days: ItineraryDay[];
  totalCost?: {
    amount: number;
    currency: string;
  };
  status: "draft" | "confirmed" | "completed";
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActivitySuggestion {
  name: string;
  description: string;
  category:
    | "attraction"
    | "restaurant"
    | "transport"
    | "accommodation"
    | "activity"
    | "other";
  estimatedCost: {
    amount: number;
    currency: string;
  };
  duration: number;
  priority: "must-see" | "recommended" | "optional";
}

export interface TravelRecommendations {
  recommendations: {
    bestTimeToVisit: string;
    weather: string;
    transportation: string;
    accommodation: string;
    food: string;
    safety: string;
    budget: string;
    packing: string;
    tips: string[];
  };
}

export const aiService = {
  // Generate itinerary for a trip
  async generateItinerary(tripId: string): Promise<Itinerary> {
    const response = await api.post(`/ai/itinerary/${tripId}`);
    return response.data;
  },

  // Regenerate itinerary for a trip
  async regenerateItinerary(tripId: string): Promise<Itinerary> {
    const response = await api.put(`/ai/itinerary/${tripId}/regenerate`);
    return response.data;
  },

  // Get AI suggestions for activities
  async getActivitySuggestions(
    destination: string,
    interests?: string[],
    budget?: { amount: number; currency: string }
  ): Promise<{ suggestions: ActivitySuggestion[] }> {
    const response = await api.post("/ai/suggestions", {
      destination,
      interests,
      budget,
    });
    return response.data;
  },

  // Get travel recommendations
  async getTravelRecommendations(
    destination: string,
    tripType?: string,
    budget?: string
  ): Promise<TravelRecommendations> {
    const response = await api.post("/ai/recommendations", {
      destination,
      tripType,
      budget,
    });
    return response.data;
  },
};
