import {
  BudgetLevel,
  BudgetPreferences,
} from "../shared/interfaces/preferences/budget";
import {
  TravelPace,
  GroupSize,
  TravelPreferences,
} from "../shared/interfaces/preferences/travel";
import {
  DietaryRestriction,
  DietaryPreferences,
} from "../shared/interfaces/preferences/dietary";
import {
  MobilityLevel,
  MobilityPreferences,
} from "../shared/interfaces/preferences/mobility";
import {
  PhysicalIntensity,
  ActivityComfortPreferences,
  ActivityComfortLevels,
  WeatherPreference,
  CrowdLevel,
  ActivityTiming,
} from "../shared/interfaces/preferences/activity";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

interface CrossFieldPreferences {
  budget?: Partial<BudgetPreferences>;
  activityComfort?: Partial<ActivityComfortPreferences>;
  mobility?: Partial<MobilityPreferences>;
  dietary?: Partial<DietaryPreferences>;
  travel?: Partial<TravelPreferences>;
}

// Cross-field validation rules
export const validateCrossFieldDependencies = (
  preferences: CrossFieldPreferences
): void => {
  // Budget and Activity Level validation
  if (preferences.budget && preferences.activityComfort) {
    const { accommodation, activities } = preferences.budget;
    const { maxDuration, preferredIntensity } = preferences.activityComfort;

    if (accommodation === BudgetLevel.LUXURY && maxDuration === "10+") {
      throw new ValidationError(
        "Luxury accommodation with extended activity duration may not be suitable"
      );
    }

    if (
      activities === BudgetLevel.BUDGET &&
      preferredIntensity === PhysicalIntensity.EXTREME
    ) {
      throw new ValidationError(
        "Extreme activities may not be suitable for budget travel"
      );
    }
  }

  // Mobility and Activity Level validation
  if (preferences.mobility && preferences.activityComfort) {
    const { level } = preferences.mobility;
    const { maxDuration, preferredIntensity } = preferences.activityComfort;

    if (level === MobilityLevel.WHEELCHAIR && maxDuration === "10+") {
      throw new ValidationError(
        "Extended activity duration may not be suitable for wheelchair users"
      );
    }

    if (
      level === MobilityLevel.WHEELCHAIR &&
      preferredIntensity === PhysicalIntensity.EXTREME
    ) {
      throw new ValidationError(
        "Extreme activities may not be suitable for wheelchair users"
      );
    }
  }

  // Dietary and Travel Pace validation
  if (preferences.dietary && preferences.travel) {
    const { restrictions } = preferences.dietary;
    const { pace } = preferences.travel;

    if (restrictions && restrictions.length > 2 && pace === TravelPace.FAST) {
      throw new ValidationError(
        "Multiple dietary restrictions may be challenging with fast-paced travel"
      );
    }
  }

  // Activity Comfort and Travel Pace validation
  if (preferences.activityComfort && preferences.travel) {
    const { maxDuration, preferredIntensity } = preferences.activityComfort;
    const { pace } = preferences.travel;

    if (pace === TravelPace.FAST && maxDuration === "10+") {
      throw new ValidationError(
        "Extended activity duration may not be suitable for fast-paced travel"
      );
    }

    if (
      pace === TravelPace.RELAXED &&
      preferredIntensity === PhysicalIntensity.EXTREME
    ) {
      throw new ValidationError(
        "Extreme activities may not be suitable for relaxed travel pace"
      );
    }
  }
};

export const validateDietaryPreferences = (
  preferences: Partial<DietaryPreferences>
): void => {
  if (preferences.restrictions) {
    preferences.restrictions.forEach((restriction) => {
      if (!Object.values(DietaryRestriction).includes(restriction)) {
        throw new ValidationError(
          `Invalid dietary restriction: ${restriction}`
        );
      }
    });
  }

  if (preferences.preferences) {
    const { spicy, localCuisine, streetFood, fineDining } =
      preferences.preferences;

    if (spicy && !["none", "mild", "medium", "hot"].includes(spicy)) {
      throw new ValidationError("Invalid spicy preference level");
    }

    if (
      typeof localCuisine !== "boolean" ||
      typeof streetFood !== "boolean" ||
      typeof fineDining !== "boolean"
    ) {
      throw new ValidationError("Invalid preference boolean value");
    }
  }
};

export const validateMobilityPreferences = (
  preferences: Partial<MobilityPreferences>
): void => {
  if (
    preferences.level &&
    !Object.values(MobilityLevel).includes(preferences.level)
  ) {
    throw new ValidationError("Invalid mobility level");
  }

  if (preferences.requirements) {
    const {
      wheelchairAccess,
      elevatorAccess,
      ramps,
      limitedStairs,
      restAreas,
    } = preferences.requirements;

    if (
      typeof wheelchairAccess !== "boolean" ||
      typeof elevatorAccess !== "boolean" ||
      typeof ramps !== "boolean" ||
      typeof limitedStairs !== "boolean" ||
      typeof restAreas !== "boolean"
    ) {
      throw new ValidationError("Invalid requirement boolean value");
    }
  }

  if (preferences.limitations) {
    const { maxWalkingDistance, maxStandingTime, restFrequency } =
      preferences.limitations;

    if (typeof maxWalkingDistance !== "number" || maxWalkingDistance < 0) {
      throw new ValidationError("Invalid maximum walking distance");
    }

    if (typeof maxStandingTime !== "number" || maxStandingTime < 0) {
      throw new ValidationError("Invalid maximum standing time");
    }

    if (typeof restFrequency !== "number" || restFrequency < 0) {
      throw new ValidationError("Invalid rest frequency");
    }
  }
};

export const validateBudgetPreferences = (
  preferences: Partial<BudgetPreferences>
): void => {
  if (
    preferences.accommodation &&
    !Object.values(BudgetLevel).includes(preferences.accommodation)
  ) {
    throw new ValidationError("Invalid accommodation budget level");
  }

  if (
    preferences.activities &&
    !Object.values(BudgetLevel).includes(preferences.activities)
  ) {
    throw new ValidationError("Invalid activities budget level");
  }

  if (
    preferences.dining &&
    !Object.values(BudgetLevel).includes(preferences.dining)
  ) {
    throw new ValidationError("Invalid dining budget level");
  }

  if (
    preferences.flexibility &&
    !["strict", "moderate", "flexible"].includes(preferences.flexibility)
  ) {
    throw new ValidationError("Invalid flexibility level");
  }

  if (
    preferences.currency &&
    !["USD", "EUR", "GBP", "JPY", "AUD", "CAD"].includes(preferences.currency)
  ) {
    throw new ValidationError("Invalid currency code");
  }
};

export const validateTravelPreferences = (
  preferences: Partial<TravelPreferences>
): void => {
  if (
    preferences.pace &&
    !Object.values(TravelPace).includes(preferences.pace)
  ) {
    throw new ValidationError("Invalid travel pace");
  }

  if (
    preferences.groupSize &&
    !Object.values(GroupSize).includes(preferences.groupSize)
  ) {
    throw new ValidationError("Invalid group size");
  }

  if (preferences.interests) {
    Object.entries(preferences.interests).forEach(([key, value]) => {
      if (typeof value !== "boolean") {
        throw new ValidationError(`Invalid interest value for ${key}`);
      }
    });
  }
};

export const validateActivityComfortPreferences = (
  preferences: Partial<ActivityComfortPreferences>
): void => {
  if (
    preferences.maxDuration &&
    !["1-2", "3-5", "6-8", "9-10", "10+"].includes(preferences.maxDuration)
  ) {
    throw new ValidationError("Invalid maximum duration value");
  }

  if (
    preferences.preferredIntensity &&
    !Object.values(PhysicalIntensity).includes(preferences.preferredIntensity)
  ) {
    throw new ValidationError("Invalid physical intensity level");
  }

  if (
    preferences.restDayFrequency &&
    !["none", "1-2", "3-4", "5+"].includes(preferences.restDayFrequency)
  ) {
    throw new ValidationError("Invalid rest day frequency");
  }

  if (preferences.preferredActivities) {
    if (!Array.isArray(preferences.preferredActivities)) {
      throw new ValidationError("Preferred activities must be an array");
    }
    if (preferences.preferredActivities.length === 0) {
      throw new ValidationError(
        "At least one preferred activity must be selected"
      );
    }
  }

  if (preferences.limitations) {
    const { maxDailyActivities, preferredTimeOfDay, weatherPreferences } =
      preferences.limitations;

    if (
      typeof maxDailyActivities === "number" &&
      (maxDailyActivities < 1 || maxDailyActivities > 10)
    ) {
      throw new ValidationError(
        "Maximum daily activities must be between 1 and 10"
      );
    }

    if (
      preferredTimeOfDay &&
      !["morning", "afternoon", "evening", "flexible"].includes(
        preferredTimeOfDay
      )
    ) {
      throw new ValidationError("Invalid preferred time of day");
    }

    if (weatherPreferences) {
      const { avoidRain, avoidExtremeHeat, avoidExtremeCold } =
        weatherPreferences;
      if (
        typeof avoidRain !== "boolean" ||
        typeof avoidExtremeHeat !== "boolean" ||
        typeof avoidExtremeCold !== "boolean"
      ) {
        throw new ValidationError("Invalid weather preference boolean value");
      }
    }
  }
};

export const validateActivityComfortLevels = (
  levels: Partial<ActivityComfortLevels>
): void => {
  if (
    levels.maxPhysicalIntensity &&
    !Object.values(PhysicalIntensity).includes(levels.maxPhysicalIntensity)
  ) {
    throw new ValidationError("Invalid maximum physical intensity level");
  }

  if (levels.weatherPreferences) {
    if (!Array.isArray(levels.weatherPreferences)) {
      throw new ValidationError("Weather preferences must be an array");
    }
    levels.weatherPreferences.forEach((pref) => {
      if (!Object.values(WeatherPreference).includes(pref)) {
        throw new ValidationError(`Invalid weather preference: ${pref}`);
      }
    });
  }

  if (levels.crowdPreferences) {
    if (!Array.isArray(levels.crowdPreferences)) {
      throw new ValidationError("Crowd preferences must be an array");
    }
    levels.crowdPreferences.forEach((pref) => {
      if (!Object.values(CrowdLevel).includes(pref)) {
        throw new ValidationError(`Invalid crowd level preference: ${pref}`);
      }
    });
  }

  if (levels.timingPreferences) {
    if (!Array.isArray(levels.timingPreferences)) {
      throw new ValidationError("Timing preferences must be an array");
    }
    levels.timingPreferences.forEach((pref) => {
      if (!Object.values(ActivityTiming).includes(pref)) {
        throw new ValidationError(
          `Invalid activity timing preference: ${pref}`
        );
      }
    });
  }

  if (typeof levels.comfortableWithHeights === "boolean") {
    if (
      levels.comfortableWithHeights === false &&
      levels.maxPhysicalIntensity === PhysicalIntensity.EXTREME
    ) {
      throw new ValidationError(
        "Extreme activities may not be suitable for those uncomfortable with heights"
      );
    }
  }

  if (typeof levels.comfortableWithWater === "boolean") {
    if (
      levels.comfortableWithWater === false &&
      levels.maxPhysicalIntensity === PhysicalIntensity.EXTREME
    ) {
      throw new ValidationError(
        "Extreme activities may not be suitable for those uncomfortable with water"
      );
    }
  }

  if (typeof levels.comfortableWithAnimals === "boolean") {
    if (
      levels.comfortableWithAnimals === false &&
      levels.maxPhysicalIntensity === PhysicalIntensity.EXTREME
    ) {
      throw new ValidationError(
        "Extreme activities may not be suitable for those uncomfortable with animals"
      );
    }
  }

  if (typeof levels.maxActivityDuration === "number") {
    if (levels.maxActivityDuration < 1 || levels.maxActivityDuration > 24) {
      throw new ValidationError(
        "Maximum activity duration must be between 1 and 24 hours"
      );
    }
  }

  if (typeof levels.minRestBetweenActivities === "number") {
    if (
      levels.minRestBetweenActivities < 0 ||
      levels.minRestBetweenActivities > 24
    ) {
      throw new ValidationError(
        "Minimum rest time between activities must be between 0 and 24 hours"
      );
    }
  }

  if (levels.additionalNotes && typeof levels.additionalNotes !== "string") {
    throw new ValidationError("Additional notes must be a string");
  }
};

export const validatePreferenceValue = (
  field: string,
  value: unknown,
  type: "text" | "number" | "checkbox" | "select" | "multiselect",
  options?: string[]
): void => {
  switch (type) {
    case "text":
      if (typeof value !== "string") {
        throw new ValidationError(`Invalid text value for ${field}`);
      }
      break;
    case "number":
      if (typeof value !== "number") {
        throw new ValidationError(`Invalid number value for ${field}`);
      }
      break;
    case "checkbox":
      if (typeof value !== "boolean") {
        throw new ValidationError(`Invalid checkbox value for ${field}`);
      }
      break;
    case "select":
      if (typeof value !== "string") {
        throw new ValidationError(`Invalid select value for ${field}`);
      }
      if (options && !options.includes(value)) {
        throw new ValidationError(`Invalid option for ${field}`);
      }
      break;
    case "multiselect":
      if (!Array.isArray(value)) {
        throw new ValidationError(`Invalid multiselect value for ${field}`);
      }
      if (options && !value.every((v) => options.includes(v))) {
        throw new ValidationError(`Invalid options for ${field}`);
      }
      break;
  }
};
