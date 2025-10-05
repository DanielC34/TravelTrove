import axios from "axios";

export interface PlaceResult {
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
  results: PlaceResult[];
  total: number;
}

export interface PlaceDetails extends PlaceResult {
  description?: string;
  website?: string;
  phone?: string;
  openingHours?: string;
  rating?: number;
  reviews?: number;
  photos?: string[];
  amenities?: string[];
  priceLevel?: string;
  accessibility?: string[];
}

class PlacesService {
  private mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;

  // Note: Currently using OSM/Nominatim as primary provider for free development
  // To switch to Mapbox later, uncomment the Mapbox calls and comment out OSM calls

  async searchPlaces(query: string, limit = 10): Promise<PlaceSearchResponse> {
    try {
      // Use OSM/Nominatim as primary (free) provider
      return await this.searchNominatim(query, limit);
    } catch (error) {
      console.error("Places search error:", error);
      throw new Error("Failed to search places");
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    try {
      // Use OSM/Nominatim as primary (free) provider
      return await this.getNominatimPlaceDetails(placeId);
    } catch (error) {
      console.error("Place details error:", error);
      throw new Error("Failed to get place details");
    }
  }

  private async searchMapbox(
    query: string,
    limit: number
  ): Promise<PlaceSearchResponse> {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json`,
      {
        params: {
          access_token: this.mapboxToken,
          limit,
          types: "place,poi,address",
        },
      }
    );

    const results: PlaceResult[] = response.data.features.map(
      (feature: any) => ({
        id: feature.id,
        name: feature.text || feature.place_name,
        address: feature.place_name,
        coordinates: {
          lat: feature.center[1],
          lng: feature.center[0],
        },
        category: feature.properties?.category,
        country: feature.context?.find((c: any) => c.id.startsWith("country"))
          ?.text,
        region: feature.context?.find((c: any) => c.id.startsWith("region"))
          ?.text,
      })
    );

    return {
      results,
      total: results.length,
    };
  }

  private async searchNominatim(
    query: string,
    limit: number
  ): Promise<PlaceSearchResponse> {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: query,
          format: "json",
          limit,
          addressdetails: 1,
        },
        headers: {
          "User-Agent": "TravelTrove/1.0",
        },
      }
    );

    const results: PlaceResult[] = response.data.map((item: any) => ({
      id: item.place_id.toString(),
      name: item.display_name.split(",")[0],
      address: item.display_name,
      coordinates: {
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      },
      category: item.type,
      country: item.address?.country,
      region: item.address?.state || item.address?.region,
    }));

    return {
      results,
      total: results.length,
    };
  }

  private async getMapboxPlaceDetails(placeId: string): Promise<PlaceDetails> {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeId}.json`,
      {
        params: {
          access_token: this.mapboxToken,
        },
      }
    );

    const feature = response.data.features[0];
    if (!feature) {
      throw new Error("Place not found");
    }

    return {
      id: feature.id,
      name: feature.text || feature.place_name,
      address: feature.place_name,
      coordinates: {
        lat: feature.center[1],
        lng: feature.center[0],
      },
      category: feature.properties?.category,
      country: feature.context?.find((c: any) => c.id.startsWith("country"))
        ?.text,
      region: feature.context?.find((c: any) => c.id.startsWith("region"))
        ?.text,
      description: feature.properties?.description,
      website: feature.properties?.website,
      phone: feature.properties?.tel,
      // Mapbox doesn't provide detailed POI info in geocoding API
      // For more details, we'd need to use Mapbox Places API or other services
    };
  }

  private async getNominatimPlaceDetails(
    placeId: string
  ): Promise<PlaceDetails> {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/details`,
      {
        params: {
          place_id: placeId,
          format: "json",
          addressdetails: 1,
        },
        headers: {
          "User-Agent": "TravelTrove/1.0",
        },
      }
    );

    const data = response.data;
    if (!data) {
      throw new Error("Place not found");
    }

    return {
      id: data.place_id.toString(),
      name: data.display_name.split(",")[0],
      address: data.display_name,
      coordinates: {
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lon),
      },
      category: data.type,
      country: data.address?.country,
      region: data.address?.state || data.address?.region,
      description: data.extratags?.description,
      website: data.extratags?.website,
      phone: data.extratags?.phone,
      openingHours: data.extratags?.opening_hours,
      // Nominatim provides basic info, for more details we'd need other services
    };
  }
}

export const placesService = new PlacesService();
