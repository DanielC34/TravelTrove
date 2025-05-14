import { Types } from "mongoose";

export enum DietaryRestriction {
  VEGETARIAN = "vegetarian",
  VEGAN = "vegan",
  GLUTEN_FREE = "gluten-free",
  KOSHER = "kosher",
  HALAL = "halal",
  NONE = "none",
}

export enum MobilityLevel {
  NO_RESTRICTIONS = "no_restrictions",
  MILD_RESTRICTIONS = "mild_restrictions",
  WHEELCHAIR_ACCESSIBLE = "wheelchair_accessible",
  MINIMAL_WALKING = "minimal_walking",
}

export enum TravelStyle {
  ADVENTURE = "adventure",
  RELAXATION = "relaxation",
  CULTURAL = "cultural",
  FOODIE = "foodie",
  NATURE = "nature",
  URBAN = "urban",
}

export interface DietaryPreferences {
  restrictions: (
    | "vegetarian"
    | "vegan"
    | "gluten-free"
    | "kosher"
    | "halal"
    | "none"
  )[];
  allergies: string[];
  additionalNotes?: string;
}

export interface MobilityRequirements {
  mobilityLevel: MobilityLevel;
  requiresWheelchairAccess: boolean;
  maxWalkingDistance?: number; // in meters
  additionalNeeds?: string;
}

export interface TravelInterests {
  preferredActivities: string[];
  preferredDestinations: string[];
  preferredAccommodationTypes: (
    | "hotel"
    | "hostel"
    | "apartment"
    | "resort"
    | "camping"
  )[];
  preferredTransportation: ("public" | "private" | "walking" | "cycling")[];
  additionalNotes?: string;
}

export interface BudgetRange {
  currency: string;
  minPerDay: number;
  maxPerDay: number;
  preferredAccommodationLevel: 1 | 2 | 3 | 4 | 5; // 1=budget, 5=luxury
}

export interface AccommodationPreferences {
  preferredTypes: ("hotel" | "hostel" | "apartment" | "resort")[];
  mustHaveAmenities: string[];
  preferredLocation: ("city-center" | "quiet" | "beach" | "suburban")[];
}

export interface ActivityComfortLevels {
  hiking: 1 | 2 | 3 | 4 | 5; // 1=easy, 5=challenging
  water: 1 | 2 | 3 | 4 | 5;
  heights: 1 | 2 | 3 | 4 | 5;
  crowdedPlaces: 1 | 2 | 3 | 4 | 5;
}

export interface MobilityPreferences {
  hasMobilityNeeds: boolean;
  requiresWheelchair: boolean;
  requiresElevator: boolean;
  additionalNotes?: string;
}

export interface UserPreferences {
  userId: Types.ObjectId;
  dietary: DietaryPreferences;
  mobility: MobilityPreferences;
  travelInterests: TravelInterests;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  languagePreference: string;
  currencyPreference: string;
  timezonePreference: string;
  budget: BudgetRange;
  dailyBudget: {
    min: number;
    max: number;
  };
  accommodation: AccommodationPreferences;
  activityLevels: ActivityComfortLevels;
  lastUpdated: Date;
}
