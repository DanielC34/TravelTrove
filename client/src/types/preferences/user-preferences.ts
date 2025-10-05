/**
 * User Preferences Interface
 * Composite interface that combines all user preference types
 */

import { DietaryPreferences } from "./dietary";
import { MobilityRequirements } from "./mobility";
import { TravelInterests } from "./travel-interests";
import { BudgetRange } from "./budget";
import { AccommodationPreferences } from "./accommodation";
import { ActivityComfortLevels } from "./activity";

/**
 * Language proficiency levels
 */
export enum LanguageProficiency {
  NATIVE = "native",
  FLUENT = "fluent",
  INTERMEDIATE = "intermediate",
  BASIC = "basic",
}

/**
 * User language capability
 */
export interface LanguageCapability {
  /**
   * Language code (e.g., 'en', 'es', 'fr')
   */
  languageCode: string;

  /**
   * Proficiency level in this language
   */
  proficiency: LanguageProficiency;
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  /**
   * Whether to receive email notifications
   */
  email: boolean;

  /**
   * Whether to receive push notifications
   */
  push: boolean;

  /**
   * Whether to receive marketing communications
   */
  marketing: boolean;
}

/**
 * Complete user preferences interface
 */
export interface UserPreferences {
  /**
   * User ID
   */
  userId: string;

  /**
   * Dietary preferences
   */
  dietary: DietaryPreferences;

  /**
   * Mobility requirements
   */
  mobility: MobilityRequirements;

  /**
   * Travel interests
   */
  interests: TravelInterests;

  /**
   * Budget range
   */
  budget: BudgetRange;

  /**
   * Accommodation preferences
   */
  accommodation: AccommodationPreferences;

  /**
   * Activity comfort levels
   */
  activityComfort: ActivityComfortLevels;

  /**
   * Languages spoken
   */
  languages: LanguageCapability[];

  /**
   * Notification preferences
   */
  notifications: NotificationPreferences;

  /**
   * Whether user has completed onboarding
   */
  onboardingCompleted: boolean;

  /**
   * Last updated timestamp
   */
  lastUpdated: Date;
}
