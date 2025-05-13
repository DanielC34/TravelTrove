/**
 * Travel Interests Interface
 * Defines the structure for user travel interests and preferences
 */

/**
 * Categories of travel interests
 */
export enum TravelInterestCategory {
  CULTURE = "culture",
  NATURE = "nature",
  ADVENTURE = "adventure",
  RELAXATION = "relaxation",
  FOOD = "food",
  HISTORY = "history",
  ART = "art",
  SHOPPING = "shopping",
  NIGHTLIFE = "nightlife",
  WELLNESS = "wellness",
  SPORTS = "sports",
  EDUCATION = "education",
}

/**
 * Specific travel activities
 */
export enum TravelActivity {
  // Culture
  MUSEUMS = "museums",
  LOCAL_EVENTS = "local-events",
  HISTORICAL_SITES = "historical-sites",

  // Nature
  HIKING = "hiking",
  BEACHES = "beaches",
  WILDLIFE = "wildlife",
  NATIONAL_PARKS = "national-parks",

  // Adventure
  WATER_SPORTS = "water-sports",
  SKIING = "skiing",
  CLIMBING = "climbing",
  SKYDIVING = "skydiving",

  // Relaxation
  SPA = "spa",
  MEDITATION = "meditation",
  SCENIC_VIEWS = "scenic-views",

  // Food
  FINE_DINING = "fine-dining",
  STREET_FOOD = "street-food",
  COOKING_CLASSES = "cooking-classes",
  FOOD_TOURS = "food-tours",

  // And so on for other categories...
}

/**
 * Travel pace preference
 */
export enum TravelPace {
  VERY_SLOW = "very-slow",
  SLOW = "slow",
  MODERATE = "moderate",
  FAST = "fast",
  VERY_FAST = "very-fast",
}

/**
 * Travel interests interface
 */
export interface TravelInterests {
  /**
   * Primary interest categories
   */
  categories: TravelInterestCategory[];

  /**
   * Specific activities of interest
   */
  activities: TravelActivity[];

  /**
   * Preferred travel pace
   */
  pace: TravelPace;

  /**
   * Preferred travel group size
   */
  groupSize?: number;

  /**
   * Whether user prefers popular or off-the-beaten-path experiences
   * 0 = Mainstream only, 100 = Off-the-beaten-path only
   */
  mainstreamVsOffbeat: number;

  /**
   * Additional interest notes
   */
  additionalNotes?: string;
}
