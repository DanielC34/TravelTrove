import mongoose, { Document, Schema } from "mongoose";

export interface IActivity extends Document {
  name: string;
  description?: string;
  location: {
    name: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  duration: number; // in minutes
  category:
    | "attraction"
    | "restaurant"
    | "transport"
    | "accommodation"
    | "activity"
    | "other";
  cost?: {
    amount: number;
    currency: string;
  };
  bookingInfo?: {
    provider: string;
    confirmationNumber?: string;
    url?: string;
  };
  notes?: string;
  isFlexible: boolean;
  priority: "must-see" | "recommended" | "optional";
}

export interface IDayPlan extends Document {
  date: Date;
  dayNumber: number;
  activities: IActivity[];
  notes?: string;
  weather?: {
    forecast: string;
    temperature: number;
    conditions: string;
  };
}

export interface IItinerary extends Document {
  tripId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  days: IDayPlan[];
  totalCost?: {
    amount: number;
    currency: string;
  };
  status: "draft" | "confirmed" | "completed";
  version: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  location: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  startTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // HH:MM format
  },
  endTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // HH:MM format
  },
  duration: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    enum: [
      "attraction",
      "restaurant",
      "transport",
      "accommodation",
      "activity",
      "other",
    ],
    required: true,
  },
  cost: {
    amount: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
  },
  bookingInfo: {
    provider: {
      type: String,
      trim: true,
    },
    confirmationNumber: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
  },
  notes: {
    type: String,
    trim: true,
  },
  isFlexible: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ["must-see", "recommended", "optional"],
    default: "recommended",
  },
});

const dayPlanSchema = new Schema<IDayPlan>({
  date: {
    type: Date,
    required: true,
  },
  dayNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  activities: [activitySchema],
  notes: {
    type: String,
    trim: true,
  },
  weather: {
    forecast: {
      type: String,
      trim: true,
    },
    temperature: {
      type: Number,
    },
    conditions: {
      type: String,
      trim: true,
    },
  },
});

const itinerarySchema = new Schema<IItinerary>(
  {
    tripId: {
      type: Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    days: [dayPlanSchema],
    totalCost: {
      amount: {
        type: Number,
        min: 0,
      },
      currency: {
        type: String,
        default: "USD",
      },
    },
    status: {
      type: String,
      enum: ["draft", "confirmed", "completed"],
      default: "draft",
    },
    version: {
      type: Number,
      default: 1,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
itinerarySchema.index({ tripId: 1 });
itinerarySchema.index({ userId: 1 });
itinerarySchema.index({ status: 1 });

export const Itinerary = mongoose.model<IItinerary>(
  "Itinerary",
  itinerarySchema
);
