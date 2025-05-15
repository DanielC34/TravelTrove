import React, { createContext, useContext, useState, useCallback } from 'react';
import { z } from 'zod';

// Reuse the schema from PreferencesWizard
const preferencesSchema = z.object({
  dietary: z.object({
    restrictions: z.object({
      vegetarian: z.boolean(),
      vegan: z.boolean(),
      glutenFree: z.boolean(),
      dairyFree: z.boolean(),
      nutFree: z.boolean(),
      halal: z.boolean(),
      kosher: z.boolean(),
    }),
    preferences: z.object({
      spicy: z.boolean(),
      local: z.boolean(),
      organic: z.boolean(),
      streetFood: z.boolean(),
    }),
    spiceLevel: z.number().min(0).max(100),
  }),
  mobility: z.object({
    level: z.enum(["none", "low", "medium", "high"]),
    requirements: z.object({
      wheelchair: z.boolean(),
      walker: z.boolean(),
      cane: z.boolean(),
      crutches: z.boolean(),
    }),
    limitations: z.object({
      walkingDistance: z.number().min(0).max(100),
      standingTime: z.number().min(0).max(100),
      stairs: z.number().min(0).max(100),
    }),
  }),
  interests: z.object({
    culture: z.number().min(0).max(100),
    nature: z.number().min(0).max(100),
    adventure: z.number().min(0).max(100),
    relaxation: z.number().min(0).max(100),
    food: z.number().min(0).max(100),
    shopping: z.number().min(0).max(100),
    nightlife: z.number().min(0).max(100),
    history: z.number().min(0).max(100),
  }),
  budget: z.object({
    accommodation: z.enum(["budget", "moderate", "luxury"]),
    activities: z.enum(["budget", "moderate", "luxury"]),
    dining: z.enum(["budget", "moderate", "luxury"]),
    flexibility: z.enum(["strict", "moderate", "flexible"]),
    currency: z.enum(["USD", "EUR", "GBP", "JPY", "AUD", "CAD"]),
  }),
  accommodation: z.object({
    preferences: z.object({
      hotel: z.boolean(),
      hostel: z.boolean(),
      apartment: z.boolean(),
      resort: z.boolean(),
      bedAndBreakfast: z.boolean(),
      camping: z.boolean(),
    }),
    requirements: z.object({
      privateBathroom: z.boolean(),
      airConditioning: z.boolean(),
      wifi: z.boolean(),
      breakfast: z.boolean(),
      pool: z.boolean(),
      gym: z.boolean(),
    }),
    location: z.object({
      cityCenter: z.boolean(),
      beachfront: z.boolean(),
      mountains: z.boolean(),
      countryside: z.boolean(),
    }),
  }),
  activityComfort: z.object({
    physicalActivity: z.number().min(0).max(100),
    socialInteraction: z.number().min(0).max(100),
    noiseLevel: z.number().min(0).max(100),
    temperature: z.number().min(0).max(100),
    humidity: z.number().min(0).max(100),
    altitude: z.number().min(0).max(100),
  }),
  transportation: z.object({
    preferences: z.object({
      plane: z.boolean(),
      train: z.boolean(),
      bus: z.boolean(),
      car: z.boolean(),
      boat: z.boolean(),
      bicycle: z.boolean(),
      walking: z.boolean(),
    }),
    requirements: z.object({
      directRoutes: z.boolean(),
      flexibleDates: z.boolean(),
      windowSeat: z.boolean(),
      extraLegroom: z.boolean(),
      priorityBoarding: z.boolean(),
      luggageAllowance: z.boolean(),
    }),
    accessibility: z.object({
      wheelchairAccess: z.boolean(),
      assistanceService: z.boolean(),
      serviceAnimal: z.boolean(),
      oxygenEquipment: z.boolean(),
    }),
  }),
  travelStyle: z.object({
    pace: z.object({
      relaxed: z.boolean(),
      balanced: z.boolean(),
      fastPaced: z.boolean(),
    }),
    style: z.object({
      luxury: z.boolean(),
      adventure: z.boolean(),
      cultural: z.boolean(),
      nature: z.boolean(),
      urban: z.boolean(),
      rural: z.boolean(),
      beach: z.boolean(),
      mountain: z.boolean(),
    }),
    groupSize: z.object({
      solo: z.boolean(),
      couple: z.boolean(),
      family: z.boolean(),
      smallGroup: z.boolean(),
      largeGroup: z.boolean(),
    }),
    season: z.object({
      spring: z.boolean(),
      summer: z.boolean(),
      fall: z.boolean(),
      winter: z.boolean(),
    }),
  }),
  specialRequirements: z.object({
    medical: z.string().max(500).optional(),
    dietary: z.string().max(500).optional(),
    accessibility: z.string().max(500).optional(),
    other: z.string().max(500).optional(),
  }),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

interface PreferencesContextType {
  preferences: PreferencesFormData | null;
  isLoading: boolean;
  error: string | null;
  updatePreferences: (data: PreferencesFormData) => Promise<void>;
  loadPreferences: () => Promise<void>;
  resetPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<PreferencesFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePreferences = useCallback(async (data: PreferencesFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      // const response = await api.updatePreferences(data);
      // setPreferences(response.data);
      
      // Temporary mock implementation
      setPreferences(data);
    } catch (err) {
      setError('Failed to update preferences');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPreferences = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      // const response = await api.getPreferences();
      // setPreferences(response.data);
      
      // Temporary mock implementation
      setPreferences(null);
    } catch (err) {
      setError('Failed to load preferences');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(null);
    setError(null);
  }, []);

  const value = {
    preferences,
    isLoading,
    error,
    updatePreferences,
    loadPreferences,
    resetPreferences,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}; 