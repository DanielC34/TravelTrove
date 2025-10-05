// Service for handling places API calls
const API_BASE_URL = "http://localhost:3001/api";

export interface Place {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  category?: string;
  country?: string;
  region?: string;
}

export interface PlaceSearchResponse {
  results: Place[];
  total: number;
}

class PlacesService {
  private getAuthHeaders(): HeadersInit {
    // Get token from localStorage (you'll need to implement this based on your auth system)
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async searchPlaces(
    query: string,
    limit: number = 10
  ): Promise<PlaceSearchResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/places/search?q=${encodeURIComponent(
          query
        )}&limit=${limit}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || "Search failed");
      }

      return data.data;
    } catch (error) {
      console.error("Places search error:", error);
      throw new Error("Failed to search places");
    }
  }

  async getPlaceDetails(placeId: string): Promise<Place> {
    try {
      const response = await fetch(`${API_BASE_URL}/places/${placeId}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || "Failed to get place details");
      }

      return data.data;
    } catch (error) {
      console.error("Place details error:", error);
      throw new Error("Failed to get place details");
    }
  }

  // For development/testing - uses test endpoints that don't require auth
  async searchPlacesTest(
    query: string,
    limit: number = 10
  ): Promise<PlaceSearchResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/places/test/search?q=${encodeURIComponent(
          query
        )}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || "Search failed");
      }

      return data.data;
    } catch (error) {
      console.error("Places search error:", error);
      throw new Error("Failed to search places");
    }
  }
}

export const placesService = new PlacesService();
