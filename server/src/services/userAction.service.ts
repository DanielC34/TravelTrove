import {
  UserAction,
  UserActionType,
  ActionMetadata,
  IUserAction,
  IUserActionModel,
} from "../models/userAction.model";
import { Types } from "mongoose";

export interface CreateUserActionData {
  userId: string;
  actionType: UserActionType;
  metadata: ActionMetadata;
}

export interface UserActionStats {
  actionType: string;
  count: number;
  lastAction: Date;
}

export interface PopularPlace {
  placeId: string;
  placeName: string;
  placeCategory: string;
  actionCount: number;
  lastAction: Date;
  actions: string[];
}

export interface SearchAnalytics {
  query: string;
  searchCount: number;
  avgResultCount: number;
  lastSearch: Date;
  uniqueUserCount: number;
}

class UserActionService {
  /**
   * Record a user action
   */
  async recordAction(data: CreateUserActionData): Promise<IUserAction> {
    try {
      const userAction = new UserAction({
        userId: new Types.ObjectId(data.userId),
        actionType: data.actionType,
        metadata: data.metadata,
        timestamp: new Date(),
      });

      return await userAction.save();
    } catch (error) {
      console.error("Error recording user action:", error);
      throw new Error("Failed to record user action");
    }
  }

  /**
   * Record multiple actions in batch
   */
  async recordActions(actions: CreateUserActionData[]): Promise<IUserAction[]> {
    try {
      const userActions = actions.map((action) => ({
        userId: new Types.ObjectId(action.userId),
        actionType: action.actionType,
        metadata: action.metadata,
        timestamp: new Date(),
      }));

      return await UserAction.insertMany(userActions);
    } catch (error) {
      console.error("Error recording user actions:", error);
      throw new Error("Failed to record user actions");
    }
  }

  /**
   * Get user action statistics
   */
  async getUserActionStats(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<UserActionStats[]> {
    try {
      const results = await UserAction.getUserActionStats(
        new Types.ObjectId(userId),
        startDate,
        endDate
      );

      // Transform the results to match the expected interface
      return results.map((result) => ({
        actionType: result._id,
        count: result.count,
        lastAction: result.lastAction,
      }));
    } catch (error) {
      console.error("Error getting user action stats:", error);
      throw new Error("Failed to get user action statistics");
    }
  }

  /**
   * Get popular places based on user actions
   */
  async getPopularPlaces(
    limit: number = 10,
    startDate?: Date,
    endDate?: Date
  ): Promise<PopularPlace[]> {
    try {
      const results = await UserAction.getPopularPlaces(
        limit,
        startDate,
        endDate
      );

      // Transform the results to match the expected interface
      return results.map((result) => ({
        placeId: result._id,
        placeName: result.placeName,
        placeCategory: result.placeCategory,
        actionCount: result.actionCount,
        lastAction: result.lastAction,
        actions: result.actions,
      }));
    } catch (error) {
      console.error("Error getting popular places:", error);
      throw new Error("Failed to get popular places");
    }
  }

  /**
   * Get search analytics
   */
  async getSearchAnalytics(
    startDate?: Date,
    endDate?: Date
  ): Promise<SearchAnalytics[]> {
    try {
      const results = await UserAction.getSearchAnalytics(startDate, endDate);

      // Transform the results to match the expected interface
      return results.map((result) => ({
        query: result._id,
        searchCount: result.searchCount,
        avgResultCount: result.avgResultCount,
        lastSearch: result.lastSearch,
        uniqueUserCount: result.uniqueUserCount,
      }));
    } catch (error) {
      console.error("Error getting search analytics:", error);
      throw new Error("Failed to get search analytics");
    }
  }

  /**
   * Get user's recent actions
   */
  async getUserRecentActions(
    userId: string,
    limit: number = 20,
    actionTypes?: UserActionType[]
  ): Promise<IUserAction[]> {
    try {
      const query: any = { userId: new Types.ObjectId(userId) };

      if (actionTypes && actionTypes.length > 0) {
        query.actionType = { $in: actionTypes };
      }

      return await UserAction.find(query)
        .sort({ timestamp: -1 })
        .limit(limit)
        .populate("userId", "name email");
    } catch (error) {
      console.error("Error getting user recent actions:", error);
      throw new Error("Failed to get user recent actions");
    }
  }

  /**
   * Get actions for a specific place
   */
  async getPlaceActions(
    placeId: string,
    actionTypes?: UserActionType[]
  ): Promise<IUserAction[]> {
    try {
      const query: any = { "metadata.placeId": placeId };

      if (actionTypes && actionTypes.length > 0) {
        query.actionType = { $in: actionTypes };
      }

      return await UserAction.find(query)
        .sort({ timestamp: -1 })
        .populate("userId", "name email");
    } catch (error) {
      console.error("Error getting place actions:", error);
      throw new Error("Failed to get place actions");
    }
  }

  /**
   * Delete old actions (for cleanup)
   */
  async deleteOldActions(olderThanDays: number = 365): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      const result = await UserAction.deleteMany({
        timestamp: { $lt: cutoffDate },
      });

      return result.deletedCount || 0;
    } catch (error) {
      console.error("Error deleting old actions:", error);
      throw new Error("Failed to delete old actions");
    }
  }

  /**
   * Get action counts by type for a user
   */
  async getUserActionCounts(userId: string): Promise<Record<string, number>> {
    try {
      const stats = await this.getUserActionStats(userId);

      return stats.reduce((acc, stat) => {
        acc[stat.actionType] = stat.count;
        return acc;
      }, {} as Record<string, number>);
    } catch (error) {
      console.error("Error getting user action counts:", error);
      throw new Error("Failed to get user action counts");
    }
  }
}

export const userActionService = new UserActionService();
