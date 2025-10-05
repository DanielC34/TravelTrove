import api from "./api";

// User action types (matching backend enum)
export enum UserActionType {
  SEARCH = "search",
  ADD_POI = "add_poi",
  LIKE = "like",
  VIEW_PLACE = "view_place",
  ADD_TO_ITINERARY = "add_to_itinerary",
  REMOVE_FROM_ITINERARY = "remove_from_itinerary",
  SHARE = "share",
  BOOKMARK = "bookmark",
}

// Action metadata interface
export interface ActionMetadata {
  query?: string;
  placeId?: string;
  placeName?: string;
  placeCategory?: string;
  tripId?: string;
  dayNumber?: number;
  priority?: string;
  source?: string;
  resultCount?: number;
  sessionId?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  [key: string]: any;
}

// User action data interface
export interface UserActionData {
  actionType: UserActionType;
  metadata: ActionMetadata;
}

// User action response interface
export interface UserActionResponse {
  id: string;
  actionType: UserActionType;
  metadata: ActionMetadata;
  timestamp: string;
}

// User action statistics interface
export interface UserActionStats {
  actionType: string;
  count: number;
  lastAction: string;
}

// Popular place interface
export interface PopularPlace {
  placeId: string;
  placeName: string;
  placeCategory: string;
  actionCount: number;
  lastAction: string;
  actions: string[];
}

// Search analytics interface
export interface SearchAnalytics {
  query: string;
  searchCount: number;
  avgResultCount: number;
  lastSearch: string;
  uniqueUserCount: number;
}

class UserActionService {
  private sessionId: string;
  private actionQueue: UserActionData[] = [];
  private isProcessingQueue = false;
  private queueProcessingInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Generate or retrieve session ID
    this.sessionId = this.getOrCreateSessionId();

    // Start processing queue periodically
    this.startQueueProcessing();

    // Process queue before page unload
    window.addEventListener("beforeunload", () => {
      this.processQueue();
    });
  }

  /**
   * Get or create a session ID for tracking user sessions
   */
  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem("userActionSessionId");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      localStorage.setItem("userActionSessionId", sessionId);
    }
    return sessionId;
  }

  /**
   * Start processing the action queue periodically
   */
  private startQueueProcessing(): void {
    // Process queue every 30 seconds
    this.queueProcessingInterval = setInterval(() => {
      this.processQueue();
    }, 30000);
  }

  /**
   * Stop processing the action queue
   */
  private stopQueueProcessing(): void {
    if (this.queueProcessingInterval) {
      clearInterval(this.queueProcessingInterval);
      this.queueProcessingInterval = null;
    }
  }

  /**
   * Add an action to the queue
   */
  private addToQueue(actionData: UserActionData): void {
    this.actionQueue.push({
      ...actionData,
      metadata: {
        ...actionData.metadata,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
      },
    });

    // Process queue immediately if it gets too large
    if (this.actionQueue.length >= 10) {
      this.processQueue();
    }
  }

  /**
   * Process the action queue by sending actions to the server
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.actionQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    try {
      const actionsToProcess = [...this.actionQueue];
      this.actionQueue = [];

      if (actionsToProcess.length > 0) {
        await this.recordActionsBatch(actionsToProcess);
      }
    } catch (error) {
      console.error("Error processing action queue:", error);
      // Re-add failed actions to the queue (with limit to prevent infinite retry)
      if (this.actionQueue.length < 50) {
        this.actionQueue.unshift(...this.actionQueue);
      }
    } finally {
      this.isProcessingQueue = false;
    }
  }

  /**
   * Record a single user action
   */
  async recordAction(
    actionType: UserActionType,
    metadata: ActionMetadata = {}
  ): Promise<void> {
    const actionData: UserActionData = {
      actionType,
      metadata: {
        ...metadata,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
      },
    };

    // Add to queue for batch processing
    this.addToQueue(actionData);
  }

  /**
   * Record multiple actions in batch (for immediate processing)
   */
  async recordActionsBatch(
    actions: UserActionData[]
  ): Promise<UserActionResponse[]> {
    try {
      const response = await api.post("/user-actions/batch", { actions });
      return response.data.data;
    } catch (error) {
      console.error("Error recording user actions:", error);
      throw error;
    }
  }

  /**
   * Record a search action
   */
  async recordSearch(
    query: string,
    resultCount: number,
    source: string = "map"
  ): Promise<void> {
    await this.recordAction(UserActionType.SEARCH, {
      query,
      resultCount,
      source,
    });
  }

  /**
   * Record an add POI action
   */
  async recordAddPOI(
    place: {
      id: string;
      name: string;
      category?: string;
      coordinates?: { lat: number; lng: number };
    },
    source: string = "map"
  ): Promise<void> {
    await this.recordAction(UserActionType.ADD_POI, {
      placeId: place.id,
      placeName: place.name,
      placeCategory: place.category,
      coordinates: place.coordinates,
      source,
    });
  }

  /**
   * Record a like action
   */
  async recordLike(
    place: {
      id: string;
      name: string;
      category?: string;
    },
    source: string = "map"
  ): Promise<void> {
    await this.recordAction(UserActionType.LIKE, {
      placeId: place.id,
      placeName: place.name,
      placeCategory: place.category,
      source,
    });
  }

  /**
   * Record a view place action
   */
  async recordViewPlace(
    place: {
      id: string;
      name: string;
      category?: string;
    },
    source: string = "map"
  ): Promise<void> {
    await this.recordAction(UserActionType.VIEW_PLACE, {
      placeId: place.id,
      placeName: place.name,
      placeCategory: place.category,
      source,
    });
  }

  /**
   * Record an add to itinerary action
   */
  async recordAddToItinerary(
    place: {
      id: string;
      name: string;
      category?: string;
    },
    tripId: string,
    dayNumber: number,
    priority?: string,
    source: string = "map"
  ): Promise<void> {
    await this.recordAction(UserActionType.ADD_TO_ITINERARY, {
      placeId: place.id,
      placeName: place.name,
      placeCategory: place.category,
      tripId,
      dayNumber,
      priority,
      source,
    });
  }

  /**
   * Record a bookmark action
   */
  async recordBookmark(
    place: {
      id: string;
      name: string;
      category?: string;
    },
    source: string = "map"
  ): Promise<void> {
    await this.recordAction(UserActionType.BOOKMARK, {
      placeId: place.id,
      placeName: place.name,
      placeCategory: place.category,
      source,
    });
  }

  /**
   * Get user action statistics
   */
  async getUserStats(
    startDate?: Date,
    endDate?: Date
  ): Promise<UserActionStats[]> {
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate.toISOString();
      if (endDate) params.endDate = endDate.toISOString();

      const response = await api.get("/user-actions/stats", { params });
      return response.data.data;
    } catch (error) {
      console.error("Error getting user stats:", error);
      throw error;
    }
  }

  /**
   * Get user's recent actions
   */
  async getUserRecentActions(
    limit: number = 20,
    actionTypes?: UserActionType[]
  ): Promise<UserActionResponse[]> {
    try {
      const params: any = { limit };
      if (actionTypes && actionTypes.length > 0) {
        params.actionTypes = actionTypes.join(",");
      }

      const response = await api.get("/user-actions/recent", { params });
      return response.data.data;
    } catch (error) {
      console.error("Error getting user recent actions:", error);
      throw error;
    }
  }

  /**
   * Get popular places
   */
  async getPopularPlaces(
    limit: number = 10,
    startDate?: Date,
    endDate?: Date
  ): Promise<PopularPlace[]> {
    try {
      const params: any = { limit };
      if (startDate) params.startDate = startDate.toISOString();
      if (endDate) params.endDate = endDate.toISOString();

      const response = await api.get("/user-actions/analytics/popular-places", {
        params,
      });
      return response.data.data;
    } catch (error) {
      console.error("Error getting popular places:", error);
      throw error;
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
      const params: any = {};
      if (startDate) params.startDate = startDate.toISOString();
      if (endDate) params.endDate = endDate.toISOString();

      const response = await api.get("/user-actions/analytics/search", {
        params,
      });
      return response.data.data;
    } catch (error) {
      console.error("Error getting search analytics:", error);
      throw error;
    }
  }

  /**
   * Get user action counts by type
   */
  async getUserActionCounts(): Promise<Record<string, number>> {
    try {
      const response = await api.get("/user-actions/counts");
      return response.data.data;
    } catch (error) {
      console.error("Error getting user action counts:", error);
      throw error;
    }
  }

  /**
   * Cleanup method to stop processing and clear queue
   */
  cleanup(): void {
    this.stopQueueProcessing();
    this.actionQueue = [];
  }
}

// Create and export a singleton instance
export const userActionService = new UserActionService();
