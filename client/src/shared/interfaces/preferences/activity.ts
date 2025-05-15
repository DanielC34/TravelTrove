/**
 * Activity Comfort Levels Interface
 * Defines the structure for user comfort levels with various activities
 */

/**
 * Physical activity intensity levels
 */
export enum PhysicalIntensity {
  SEDENTARY = "SEDENTARY",
  LIGHT = "LIGHT",
  MODERATE = "MODERATE",
  VIGOROUS = "VIGOROUS",
  EXTREME = "EXTREME",
}

/**
 * Weather condition preferences
 */
export enum WeatherPreference {
  HOT = "hot",
  WARM = "warm",
  MILD = "mild",
  COOL = "cool",
  COLD = "cold",
  RAINY = "rainy",
  SNOWY = "snowy",
  SUNNY = "sunny",
  ANY = "any",
}

/**
 * Crowd level preferences
 */
export enum CrowdLevel {
  ISOLATED = "isolated",
  UNCROWDED = "uncrowded",
  MODERATE = "moderate",
  BUSY = "busy",
  VERY_CROWDED = "very-crowded",
}

/**
 * Activity timing preferences
 */
export enum ActivityTiming {
  EARLY_MORNING = "early-morning",
  MORNING = "morning",
  AFTERNOON = "afternoon",
  EVENING = "evening",
  LATE_NIGHT = "late-night",
  ANY_TIME = "any-time",
}

/**
 * Activity comfort levels interface
 */
export interface ActivityComfortLevels {
  /**
   * Maximum physical intensity level
   */
  maxPhysicalIntensity: PhysicalIntensity;

  /**
   * Preferred weather conditions
   */
  weatherPreferences: WeatherPreference[];

  /**
   * Preferred crowd levels
   */
  crowdPreferences: CrowdLevel[];

  /**
   * Preferred activity times
   */
  timingPreferences: ActivityTiming[];

  /**
   * Whether user is comfortable with heights
   */
  comfortableWithHeights: boolean;

  /**
   * Whether user is comfortable with water activities
   */
  comfortableWithWater: boolean;

  /**
   * Whether user is comfortable with animals
   */
  comfortableWithAnimals: boolean;

  /**
   * Maximum duration of activities in hours
   */
  maxActivityDuration?: number;

  /**
   * Minimum rest time between activities in hours
   */
  minRestBetweenActivities?: number;

  /**
   * Additional comfort notes
   */
  additionalNotes?: string;
}

export interface ActivityComfortPreferences {
  maxDuration: string;
  preferredIntensity: PhysicalIntensity;
  restDayFrequency: string;
  preferredActivities: string[];
  limitations?: {
    maxDailyActivities: number;
    preferredTimeOfDay: "morning" | "afternoon" | "evening" | "flexible";
    weatherPreferences: {
      avoidRain: boolean;
      avoidExtremeHeat: boolean;
      avoidExtremeCold: boolean;
    };
  };
}
