/**
 * Budget Range Interface
 * Defines the structure for user budget preferences
 */

/**
 * Budget category levels
 */
export enum BudgetCategory {
  BUDGET = "budget",
  ECONOMY = "economy",
  MODERATE = "moderate",
  LUXURY = "luxury",
  ULTRA_LUXURY = "ultra-luxury",
}

/**
 * Currency code type
 */
export type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "CAD"
  | "AUD"
  | "CNY"
  | string;

/**
 * Budget allocation preferences
 */
export interface BudgetAllocation {
  /**
   * Percentage allocated to accommodation (0-100)
   */
  accommodation: number;

  /**
   * Percentage allocated to food (0-100)
   */
  food: number;

  /**
   * Percentage allocated to activities (0-100)
   */
  activities: number;

  /**
   * Percentage allocated to transportation (0-100)
   */
  transportation: number;

  /**
   * Percentage allocated to shopping (0-100)
   */
  shopping: number;

  /**
   * Percentage allocated to miscellaneous expenses (0-100)
   */
  miscellaneous: number;
}

/**
 * Budget range interface
 */
export interface BudgetRange {
  /**
   * Overall budget category
   */
  category: BudgetCategory;

  /**
   * Daily budget amount
   */
  dailyBudget?: number;

  /**
   * Total trip budget amount
   */
  totalBudget?: number;

  /**
   * Currency for budget amounts
   */
  currency: CurrencyCode;

  /**
   * Budget allocation preferences
   */
  allocation?: BudgetAllocation;

  /**
   * Whether user is flexible with budget
   */
  isFlexible: boolean;

  /**
   * Maximum percentage over budget user is willing to go (if flexible)
   */
  flexibilityPercentage?: number;
}

export enum BudgetLevel {
  BUDGET = "budget",
  MODERATE = "moderate",
  LUXURY = "luxury",
}

export interface BudgetPreferences {
  accommodation: BudgetLevel;
  activities: BudgetLevel;
  dining: BudgetLevel;
  flexibility: "strict" | "moderate" | "flexible";
  currency: string;
}
