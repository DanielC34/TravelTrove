import mongoose, { Document, Schema } from "mongoose";
import { UserPreferences } from "../interfaces/preferences";

export interface IUserPreferences extends UserPreferences, Document {
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DietaryPreferencesSchema = new Schema({
  restrictions: {
    type: [String],
    enum: ["vegetarian", "vegan", "gluten-free", "kosher", "halal", "none"],
    default: [],
  },
  allergies: {
    type: [String],
    default: [],
  },
  additionalNotes: {
    type: String,
    trim: true,
  },
});

const MobilityPreferencesSchema = new Schema({
  hasMobilityNeeds: {
    type: Boolean,
    default: false,
  },
  requiresWheelchair: {
    type: Boolean,
    default: false,
  },
  requiresElevator: {
    type: Boolean,
    default: false,
  },
  additionalNotes: {
    type: String,
    trim: true,
  },
});

const TravelInterestsSchema = new Schema({
  preferredActivities: {
    type: [String],
    default: [],
  },
  preferredDestinations: {
    type: [String],
    default: [],
  },
  preferredAccommodationTypes: {
    type: [String],
    enum: ["hotel", "hostel", "apartment", "resort", "camping"],
    default: [],
  },
  preferredTransportation: {
    type: [String],
    enum: ["public", "private", "walking", "cycling"],
    default: [],
  },
  additionalNotes: {
    type: String,
    trim: true,
  },
});

const NotificationPreferencesSchema = new Schema({
  email: {
    type: Boolean,
    default: true,
  },
  push: {
    type: Boolean,
    default: true,
  },
  sms: {
    type: Boolean,
    default: false,
  },
});

const BudgetRangeSchema = new Schema({
  currency: {
    type: String,
    required: true,
    default: "USD",
  },
  minPerDay: {
    type: Number,
    required: true,
    min: 0,
  },
  maxPerDay: {
    type: Number,
    required: true,
    min: 0,
  },
  preferredAccommodationLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

const DailyBudgetSchema = new Schema({
  min: {
    type: Number,
    required: true,
    min: 0,
  },
  max: {
    type: Number,
    required: true,
    min: 0,
  },
});

const AccommodationPreferencesSchema = new Schema({
  preferredTypes: {
    type: [String],
    enum: ["hotel", "hostel", "apartment", "resort"],
    default: [],
  },
  mustHaveAmenities: {
    type: [String],
    default: [],
  },
  preferredLocation: {
    type: [String],
    enum: ["city-center", "quiet", "beach", "suburban"],
    default: [],
  },
});

const ActivityComfortLevelsSchema = new Schema({
  hiking: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  water: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  heights: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  crowdedPlaces: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

const UserPreferencesSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    dietary: {
      type: DietaryPreferencesSchema,
      required: true,
      default: () => ({}),
    },
    mobility: {
      type: MobilityPreferencesSchema,
      required: true,
      default: () => ({}),
    },
    travelInterests: {
      type: TravelInterestsSchema,
      required: true,
      default: () => ({}),
    },
    notificationPreferences: {
      type: NotificationPreferencesSchema,
      required: true,
      default: () => ({}),
    },
    languagePreference: {
      type: String,
      default: "en",
    },
    currencyPreference: {
      type: String,
      default: "USD",
    },
    timezonePreference: {
      type: String,
      default: "UTC",
    },
    budget: {
      type: BudgetRangeSchema,
      required: true,
      default: () => ({
        currency: "USD",
        minPerDay: 0,
        maxPerDay: 0,
        preferredAccommodationLevel: 3,
      }),
    },
    dailyBudget: {
      type: DailyBudgetSchema,
      required: true,
      default: () => ({
        min: 0,
        max: 0,
      }),
    },
    accommodation: {
      type: AccommodationPreferencesSchema,
      required: true,
      default: () => ({}),
    },
    activityLevels: {
      type: ActivityComfortLevelsSchema,
      required: true,
      default: () => ({
        hiking: 3,
        water: 3,
        heights: 3,
        crowdedPlaces: 3,
      }),
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

// Add indexing for efficient queries
UserPreferencesSchema.index({ userId: 1 }, { unique: true });

// Add validation methods
UserPreferencesSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

const UserPreferencesModel = mongoose.model<IUserPreferences>(
  "UserPreferences",
  UserPreferencesSchema
);

export default UserPreferencesModel;
