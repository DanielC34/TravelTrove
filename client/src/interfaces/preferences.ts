export type DietaryRestriction =
  | "vegetarian"
  | "vegan"
  | "gluten-free"
  | "dairy-free"
  | "halal"
  | "kosher";
export type MobilityNeed =
  | "wheelchair"
  | "elevator"
  | "ground-floor"
  | "assistance";
export type TravelInterest =
  | "adventure"
  | "relaxation"
  | "culture"
  | "nature"
  | "food"
  | "shopping";
export type AccommodationType =
  | "hotel"
  | "hostel"
  | "apartment"
  | "resort"
  | "camping";
export type TransportationPreference =
  | "public"
  | "private"
  | "walking"
  | "cycling";

export interface DietaryPreferences {
  restrictions: DietaryRestriction[];
  allergies: string[];
  additionalNotes?: string;
}

export interface MobilityPreferences {
  hasMobilityNeeds: boolean;
  requiresWheelchair: boolean;
  requiresElevator: boolean;
  additionalNotes?: string;
}

export interface TravelInterests {
  preferredActivities: TravelInterest[];
  preferredDestinations: string[];
  preferredAccommodationTypes: AccommodationType[];
  preferredTransportation: TransportationPreference[];
  additionalNotes?: string;
}

export interface BudgetPreferences {
  minBudget: number;
  maxBudget: number;
  currency: string;
  additionalNotes?: string;
}

export interface ActivityComfortLevel {
  activity: string;
  comfortLevel: number; // 1-5 scale
}

export interface UserPreferences {
  userId: string;
  dietary: DietaryPreferences;
  mobility: MobilityPreferences;
  travelInterests: TravelInterests;
  budget: BudgetPreferences;
  activityComfortLevels: ActivityComfortLevel[];
  additionalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PreferencesFormData {
  dietary: DietaryPreferences;
  mobility: MobilityPreferences;
  travelInterests: TravelInterests;
  budget: BudgetPreferences;
  activityComfortLevels: ActivityComfortLevel[];
  additionalNotes?: string;
}

export interface PreferencesContextState {
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;
  isDirty: boolean;
  currentStep: number;
  totalSteps: number;
}

// Define the type for preference values
export type PreferenceValue =
  | DietaryPreferences
  | MobilityPreferences
  | TravelInterests
  | BudgetPreferences
  | ActivityComfortLevel[]
  | string
  | boolean
  | number;

export interface PreferencesContextValue extends PreferencesContextState {
  fetchPreferences: () => Promise<void>;
  updatePreferences: (preferences: PreferencesFormData) => Promise<void>;
  setPreferenceValue: (field: string, value: PreferenceValue) => void;
  resetPreferences: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  saveDraft: () => Promise<void>;
}
