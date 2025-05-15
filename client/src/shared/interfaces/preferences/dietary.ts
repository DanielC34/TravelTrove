/**
 * Dietary Preferences Interface
 * Defines the structure for user dietary preferences and restrictions
 */

/**
 * Common dietary restrictions
 */
export enum DietaryRestriction {
  NONE = "none",
  VEGETARIAN = "vegetarian",
  VEGAN = "vegan",
  PESCATARIAN = "pescatarian",
  GLUTEN_FREE = "gluten_free",
  DAIRY_FREE = "dairy_free",
  NUT_FREE = "nut_free",
  HALAL = "halal",
  KOSHER = "kosher",
}

/**
 * Meal preference types
 */
export enum MealPreference {
  LOCAL_CUISINE = "local-cuisine",
  INTERNATIONAL = "international",
  FINE_DINING = "fine-dining",
  CASUAL = "casual",
  STREET_FOOD = "street-food",
  HOME_COOKING = "home-cooking",
}

/**
 * Dietary preferences interface
 */
export interface DietaryPreferences {
  /**
   * List of dietary restrictions
   */
  restrictions: DietaryRestriction[];

  /**
   * List of specific food allergies
   */
  allergies: string[];

  /**
   * Preferred meal types
   */
  mealPreferences?: MealPreference[];

  /**
   * Additional dietary notes or requirements
   */
  additionalNotes?: string;

  /**
   * Importance level of dietary preferences (1-5)
   * 1 = Nice to have, 5 = Absolute requirement
   */
  importanceLevel: number;

  /**
   * Meal preferences
   */
  preferences: {
    spicy: "none" | "mild" | "medium" | "hot";
    localCuisine: boolean;
    streetFood: boolean;
    fineDining: boolean;
  };
}
