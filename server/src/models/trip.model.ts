import mongoose, { Document, Schema } from "mongoose";

export interface ITrip extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  travelers: {
    count: number;
    type: "solo" | "couple" | "family" | "group";
    details?: string;
  };
  budget: {
    amount: number;
    currency: string;
    type: "budget" | "moderate" | "premium" | "luxury";
  };
  status: "draft" | "planning" | "confirmed" | "completed" | "cancelled";
  description?: string;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const tripSchema = new Schema<ITrip>(
  {
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
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    travelers: {
      count: {
        type: Number,
        required: true,
        min: 1,
      },
      type: {
        type: String,
        enum: ["solo", "couple", "family", "group"],
        required: true,
      },
      details: {
        type: String,
        trim: true,
      },
    },
    budget: {
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: "USD",
      },
      type: {
        type: String,
        enum: ["budget", "moderate", "premium", "luxury"],
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["draft", "planning", "confirmed", "completed", "cancelled"],
      default: "draft",
    },
    description: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
tripSchema.index({ userId: 1, status: 1 });
tripSchema.index({ destination: 1 });
tripSchema.index({ startDate: 1 });

export const Trip = mongoose.model<ITrip>("Trip", tripSchema);
