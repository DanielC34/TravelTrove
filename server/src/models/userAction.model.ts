import mongoose, { Schema, Document } from "mongoose";

// User action types
export enum UserActionType {
  SEARCH = "search",
  ADD_POI = "add_poi", // Add Point of Interest
  LIKE = "like",
  VIEW_PLACE = "view_place",
  ADD_TO_ITINERARY = "add_to_itinerary",
  REMOVE_FROM_ITINERARY = "remove_from_itinerary",
  SHARE = "share",
  BOOKMARK = "bookmark",
}

// Action metadata interface
export interface ActionMetadata {
  query?: string; // For search actions
  placeId?: string; // For place-related actions
  placeName?: string;
  placeCategory?: string;
  tripId?: string; // For itinerary actions
  dayNumber?: number; // For itinerary actions
  priority?: string; // For itinerary actions
  source?: string; // Where the action originated (map, search, etc.)
  resultCount?: number; // For search actions
  sessionId?: string; // For session tracking
  userAgent?: string;
  ipAddress?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  [key: string]: any; // Allow additional metadata
}

// User action document interface
export interface IUserAction extends Document {
  userId: mongoose.Types.ObjectId;
  actionType: UserActionType;
  metadata: ActionMetadata;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Static methods interface
export interface IUserActionModel extends mongoose.Model<IUserAction> {
  getUserActionStats(
    userId: mongoose.Types.ObjectId,
    startDate?: Date,
    endDate?: Date
  ): Promise<Array<{ _id: string; count: number; lastAction: Date }>>;

  getPopularPlaces(
    limit?: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<
    Array<{
      _id: string;
      placeName: string;
      placeCategory: string;
      actionCount: number;
      lastAction: Date;
      actions: string[];
    }>
  >;

  getSearchAnalytics(
    startDate?: Date,
    endDate?: Date
  ): Promise<
    Array<{
      _id: string;
      searchCount: number;
      avgResultCount: number;
      lastSearch: Date;
      uniqueUserCount: number;
    }>
  >;
}

// User action schema
const UserActionSchema = new Schema<IUserAction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    actionType: {
      type: String,
      enum: Object.values(UserActionType),
      required: true,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add compound indexes for efficient queries
UserActionSchema.index({ userId: 1, actionType: 1, timestamp: -1 });
UserActionSchema.index({ actionType: 1, timestamp: -1 });
UserActionSchema.index({ "metadata.placeId": 1, actionType: 1 });
UserActionSchema.index({ "metadata.query": 1, actionType: 1 });

// Add methods for analytics
UserActionSchema.statics.getUserActionStats = async function (
  userId: mongoose.Types.ObjectId,
  startDate?: Date,
  endDate?: Date
) {
  const matchStage: any = { userId };

  if (startDate || endDate) {
    matchStage.timestamp = {};
    if (startDate) matchStage.timestamp.$gte = startDate;
    if (endDate) matchStage.timestamp.$lte = endDate;
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$actionType",
        count: { $sum: 1 },
        lastAction: { $max: "$timestamp" },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

UserActionSchema.statics.getPopularPlaces = async function (
  limit: number = 10,
  startDate?: Date,
  endDate?: Date
) {
  const matchStage: any = {
    actionType: {
      $in: [
        UserActionType.ADD_POI,
        UserActionType.LIKE,
        UserActionType.ADD_TO_ITINERARY,
      ],
    },
    "metadata.placeId": { $exists: true },
  };

  if (startDate || endDate) {
    matchStage.timestamp = {};
    if (startDate) matchStage.timestamp.$gte = startDate;
    if (endDate) matchStage.timestamp.$lte = endDate;
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$metadata.placeId",
        placeName: { $first: "$metadata.placeName" },
        placeCategory: { $first: "$metadata.placeCategory" },
        actionCount: { $sum: 1 },
        lastAction: { $max: "$timestamp" },
        actions: { $push: "$actionType" },
      },
    },
    { $sort: { actionCount: -1 } },
    { $limit: limit },
  ]);
};

UserActionSchema.statics.getSearchAnalytics = async function (
  startDate?: Date,
  endDate?: Date
) {
  const matchStage: any = { actionType: UserActionType.SEARCH };

  if (startDate || endDate) {
    matchStage.timestamp = {};
    if (startDate) matchStage.timestamp.$gte = startDate;
    if (endDate) matchStage.timestamp.$lte = endDate;
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$metadata.query",
        searchCount: { $sum: 1 },
        avgResultCount: { $avg: "$metadata.resultCount" },
        lastSearch: { $max: "$timestamp" },
        uniqueUsers: { $addToSet: "$userId" },
      },
    },
    {
      $addFields: {
        uniqueUserCount: { $size: "$uniqueUsers" },
      },
    },
    { $sort: { searchCount: -1 } },
    { $limit: 20 },
  ]);
};

// Create and export the model
export const UserAction = mongoose.model<IUserAction, IUserActionModel>(
  "UserAction",
  UserActionSchema
);
