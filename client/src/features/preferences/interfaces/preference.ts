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
  restrictions: DietaryRestriction[];
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
  preferredStyles: TravelStyle[];
  activityPreferences: {
    outdoor: boolean;
    cultural: boolean;
    nightlife: boolean;
    shopping: boolean;
  };
  mustAvoid?: string[];
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

export interface ActivityLevels {
  hiking: 1 | 2 | 3 | 4 | 5; // 1=easy, 5=challenging
  water: 1 | 2 | 3 | 4 | 5;
  heights: 1 | 2 | 3 | 4 | 5;
  crowdedPlaces: 1 | 2 | 3 | 4 | 5;
}

export interface UserPreferences {
  userId: string;
  dietary: DietaryPreferences;
  mobility: MobilityRequirements;
  interests: TravelInterests;
  budget: BudgetRange;
  accommodation: AccommodationPreferences;
  activityLevels: ActivityLevels;
  lastUpdated: Date;
}
