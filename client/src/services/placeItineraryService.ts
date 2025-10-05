import api from "./api";
import { Place } from "./placesService";

export interface AddPlaceToItineraryData {
  place: Place;
  dayNumber: number;
  startTime: string;
  endTime: string;
  notes?: string;
  priority?: "must-see" | "recommended" | "optional";
}

class PlaceItineraryService {
  // Add a place to trip itinerary
  async addPlaceToItinerary(
    tripId: string,
    data: AddPlaceToItineraryData
  ): Promise<void> {
    try {
      // For testing with mock trip IDs, simulate success
      if (tripId.startsWith("test-") || tripId === "mock-trip") {
        console.log("Mock: Adding place to itinerary", {
          tripId,
          place: data.place.name,
          day: data.dayNumber,
          time: `${data.startTime} - ${data.endTime}`,
          priority: data.priority,
        });
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        return;
      }

      // Convert place to activity format
      const activity = {
        name: data.place.name,
        description: `${data.place.address}${
          data.notes ? ` - ${data.notes}` : ""
        }`,
        location: {
          name: data.place.name,
          address: data.place.address,
          coordinates: data.place.coordinates,
        },
        startTime: data.startTime,
        endTime: data.endTime,
        duration: this.calculateDuration(data.startTime, data.endTime),
        category: this.mapCategoryToActivityType(data.place.category),
        priority: data.priority || "recommended",
        notes: data.notes,
      };

      await api.post(
        `/itineraries/${tripId}/days/${data.dayNumber}/activities`,
        activity
      );
    } catch (error) {
      console.error("Error adding place to itinerary:", error);
      throw new Error("Failed to add place to itinerary");
    }
  }

  // Calculate duration in minutes between start and end time
  private calculateDuration(startTime: string, endTime: string): number {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  }

  // Map place category to activity type
  private mapCategoryToActivityType(
    category?: string
  ):
    | "attraction"
    | "restaurant"
    | "transport"
    | "accommodation"
    | "activity"
    | "other" {
    if (!category) return "other";

    const categoryLower = category.toLowerCase();

    if (
      categoryLower.includes("restaurant") ||
      categoryLower.includes("food") ||
      categoryLower.includes("cafe")
    ) {
      return "restaurant";
    }
    if (
      categoryLower.includes("hotel") ||
      categoryLower.includes("accommodation") ||
      categoryLower.includes("hostel")
    ) {
      return "accommodation";
    }
    if (
      categoryLower.includes("transport") ||
      categoryLower.includes("station") ||
      categoryLower.includes("airport")
    ) {
      return "transport";
    }
    if (
      categoryLower.includes("museum") ||
      categoryLower.includes("attraction") ||
      categoryLower.includes("monument")
    ) {
      return "attraction";
    }
    if (
      categoryLower.includes("activity") ||
      categoryLower.includes("adventure") ||
      categoryLower.includes("sport")
    ) {
      return "activity";
    }

    return "other";
  }

  // Get available days for a trip (for day selection)
  async getTripDays(
    tripId: string
  ): Promise<{ dayNumber: number; date: string }[]> {
    try {
      // For testing with mock trip IDs, return default days
      if (tripId.startsWith("test-") || tripId === "mock-trip") {
        return this.getMockTripDays();
      }

      const response = await api.get(`/trips/${tripId}`);
      const trip = response.data.trip;

      // Calculate days based on trip duration
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      const days = [];

      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        days.push({
          dayNumber: days.length + 1,
          date: d.toISOString().split("T")[0],
        });
      }

      return days;
    } catch (error) {
      console.error("Error fetching trip days:", error);
      // Fallback to mock days for testing
      console.warn("Falling back to mock trip days for testing");
      return this.getMockTripDays();
    }
  }

  // Get mock trip days for testing
  private getMockTripDays(): { dayNumber: number; date: string }[] {
    const today = new Date();
    const days = [];

    // Generate 7 days starting from today
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        dayNumber: i + 1,
        date: date.toISOString().split("T")[0],
      });
    }

    return days;
  }
}

export const placeItineraryService = new PlaceItineraryService();
