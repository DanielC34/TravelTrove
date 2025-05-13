import mongoose from "mongoose";
import {
  UserPreferences,
  DietaryRestriction,
  MobilityLevel,
  TravelStyle,
} from "../../interfaces/preferences";

const userPreferencesSchema = new mongoose.Schema<UserPreferences>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      ref: "User",
    },
    dietary: {
      restrictions: [
        {
          type: String,
          enum: Object.values(DietaryRestriction),
        },
      ],
      allergies: [String],
      additionalNotes: String,
    },
    mobility: {
      mobilityLevel: {
        type: String,
        enum: Object.values(MobilityLevel),
        required: true,
      },
      requiresWheelchairAccess: {
        type: Boolean,
        default: false,
      },
      maxWalkingDistance: Number,
      additionalNeeds: String,
    },
    interests: {
      preferredStyles: [
        {
          type: String,
          enum: Object.values(TravelStyle),
        },
      ],
      activityPreferences: {
        outdoor: Boolean,
        cultural: Boolean,
        nightlife: Boolean,
        shopping: Boolean,
      },
      mustAvoid: [String],
    },
    budget: {
      currency: {
        type: String,
        default: "USD",
      },
      minPerDay: {
        type: Number,
        required: true,
      },
      maxPerDay: {
        type: Number,
        required: true,
      },
      preferredAccommodationLevel: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
    },
    accommodation: {
      preferredTypes: [
        {
          type: String,
          enum: ["hotel", "hostel", "apartment", "resort"],
        },
      ],
      mustHaveAmenities: [String],
      preferredLocation: [
        {
          type: String,
          enum: ["city-center", "quiet", "beach", "suburban"],
        },
      ],
    },
    activityLevels: {
      hiking: { type: Number, min: 1, max: 5 },
      water: { type: Number, min: 1, max: 5 },
      heights: { type: Number, min: 1, max: 5 },
      crowdedPlaces: { type: Number, min: 1, max: 5 },
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const UserPreferencesModel = mongoose.model<UserPreferences>(
  "UserPreferences",
  userPreferencesSchema
);
