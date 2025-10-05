export enum TravelPace {
  RELAXED = "relaxed",
  MODERATE = "moderate",
  FAST = "fast",
}

export enum GroupSize {
  SOLO = "solo",
  COUPLE = "couple",
  SMALL_GROUP = "small_group",
  LARGE_GROUP = "large_group",
}

export interface TravelPreferences {
  pace: TravelPace;
  groupSize: GroupSize;
  interests: Record<string, boolean>;
}
