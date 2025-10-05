/**
 * Accommodation Preferences Interface
 * Defines the structure for user accommodation preferences
 */

/**
 * Types of accommodation
 */
export enum AccommodationType {
  HOTEL = "hotel",
  HOSTEL = "hostel",
  RESORT = "resort",
  APARTMENT = "apartment",
  VACATION_RENTAL = "vacation-rental",
  BED_AND_BREAKFAST = "bed-and-breakfast",
  CAMPING = "camping",
  GLAMPING = "glamping",
  HOMESTAY = "homestay",
}

/**
 * Accommodation amenities
 */
export enum AccommodationAmenity {
  WIFI = "wifi",
  AIR_CONDITIONING = "air-conditioning",
  POOL = "pool",
  GYM = "gym",
  KITCHEN = "kitchen",
  LAUNDRY = "laundry",
  PARKING = "parking",
  BREAKFAST_INCLUDED = "breakfast-included",
  PET_FRIENDLY = "pet-friendly",
  ROOM_SERVICE = "room-service",
  SPA = "spa",
  BUSINESS_CENTER = "business-center",
}

/**
 * Accommodation location preferences
 */
export enum LocationPreference {
  CITY_CENTER = "city-center",
  NEAR_ATTRACTIONS = "near-attractions",
  QUIET_AREA = "quiet-area",
  BEACH_FRONT = "beach-front",
  MOUNTAIN_VIEW = "mountain-view",
  COUNTRYSIDE = "countryside",
  NEAR_PUBLIC_TRANSPORT = "near-public-transport",
}

/**
 * Accommodation preferences interface
 */
export interface AccommodationPreferences {
  /**
   * Preferred accommodation types
   */
  types: AccommodationType[];

  /**
   * Minimum star rating (1-5)
   */
  minStarRating?: number;

  /**
   * Required amenities
   */
  requiredAmenities: AccommodationAmenity[];

  /**
   * Nice-to-have amenities
   */
  preferredAmenities?: AccommodationAmenity[];

  /**
   * Location preferences
   */
  locationPreferences: LocationPreference[];

  /**
   * Maximum distance from city center (in kilometers)
   */
  maxDistanceFromCenter?: number;

  /**
   * Whether user requires private bathroom
   */
  privateBathroom: boolean;

  /**
   * Number of beds required
   */
  numberOfBeds?: number;

  /**
   * Additional accommodation notes
   */
  additionalNotes?: string;
}
