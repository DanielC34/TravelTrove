import { Request, Response } from "express";
import {
  userActionService,
  CreateUserActionData,
} from "../services/userAction.service";
import { UserActionType } from "../models/userAction.model";
import { asyncHandler } from "../utils/errorHandler";
import {
  sendErrorResponse,
  createValidationError,
} from "../utils/errorHandler";

export const userActionController = {
  /**
   * Record a single user action
   */
  recordAction: asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { actionType, metadata } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        sendErrorResponse(
          res,
          createValidationError("User ID is required"),
          req.path
        );
        return;
      }

      if (!actionType || !Object.values(UserActionType).includes(actionType)) {
        sendErrorResponse(
          res,
          createValidationError("Valid action type is required"),
          req.path
        );
        return;
      }

      if (!metadata || typeof metadata !== "object") {
        sendErrorResponse(
          res,
          createValidationError("Metadata is required"),
          req.path
        );
        return;
      }

      const actionData: CreateUserActionData = {
        userId,
        actionType,
        metadata: {
          ...metadata,
          userAgent: req.get("User-Agent"),
          ipAddress: req.ip,
          timestamp: new Date().toISOString(),
        },
      };

      const userAction = await userActionService.recordAction(actionData);

      res.status(201).json({
        success: true,
        data: {
          id: userAction._id,
          actionType: userAction.actionType,
          metadata: userAction.metadata,
          timestamp: userAction.timestamp,
        },
      });
    }
  ),

  /**
   * Record multiple user actions in batch
   */
  recordActions: asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { actions } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        sendErrorResponse(
          res,
          createValidationError("User ID is required"),
          req.path
        );
        return;
      }

      if (!Array.isArray(actions) || actions.length === 0) {
        sendErrorResponse(
          res,
          createValidationError("Actions array is required"),
          req.path
        );
        return;
      }

      // Validate each action
      for (const action of actions) {
        if (
          !action.actionType ||
          !Object.values(UserActionType).includes(action.actionType)
        ) {
          sendErrorResponse(
            res,
            createValidationError(
              "Valid action type is required for all actions"
            ),
            req.path
          );
          return;
        }
        if (!action.metadata || typeof action.metadata !== "object") {
          sendErrorResponse(
            res,
            createValidationError("Metadata is required for all actions"),
            req.path
          );
          return;
        }
      }

      const actionData: CreateUserActionData[] = actions.map((action) => ({
        userId,
        actionType: action.actionType,
        metadata: {
          ...action.metadata,
          userAgent: req.get("User-Agent"),
          ipAddress: req.ip,
          timestamp: new Date().toISOString(),
        },
      }));

      const userActions = await userActionService.recordActions(actionData);

      res.status(201).json({
        success: true,
        data: userActions.map((action) => ({
          id: action._id,
          actionType: action.actionType,
          metadata: action.metadata,
          timestamp: action.timestamp,
        })),
      });
    }
  ),

  /**
   * Get user action statistics
   */
  getUserStats: asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.id;
      const { startDate, endDate } = req.query;

      if (!userId) {
        sendErrorResponse(
          res,
          createValidationError("User ID is required"),
          req.path
        );
        return;
      }

      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;

      const stats = await userActionService.getUserActionStats(
        userId,
        start,
        end
      );

      res.json({
        success: true,
        data: stats,
      });
    }
  ),

  /**
   * Get user's recent actions
   */
  getUserRecentActions: asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.id;
      const { limit = "20", actionTypes } = req.query;

      if (!userId) {
        sendErrorResponse(
          res,
          createValidationError("User ID is required"),
          req.path
        );
        return;
      }

      const limitNum = parseInt(limit as string, 10);
      const actionTypesArray = actionTypes
        ? ((actionTypes as string)
            .split(",")
            .filter((type) =>
              Object.values(UserActionType).includes(type as UserActionType)
            ) as UserActionType[])
        : undefined;

      const actions = await userActionService.getUserRecentActions(
        userId,
        limitNum,
        actionTypesArray
      );

      res.json({
        success: true,
        data: actions,
      });
    }
  ),

  /**
   * Get popular places (admin/analytics endpoint)
   */
  getPopularPlaces: asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { limit = "10", startDate, endDate } = req.query;

      const limitNum = parseInt(limit as string, 10);
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;

      const popularPlaces = await userActionService.getPopularPlaces(
        limitNum,
        start,
        end
      );

      res.json({
        success: true,
        data: popularPlaces,
      });
    }
  ),

  /**
   * Get search analytics (admin/analytics endpoint)
   */
  getSearchAnalytics: asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { startDate, endDate } = req.query;

      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;

      const analytics = await userActionService.getSearchAnalytics(start, end);

      res.json({
        success: true,
        data: analytics,
      });
    }
  ),

  /**
   * Get actions for a specific place
   */
  getPlaceActions: asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { placeId } = req.params;
      const { actionTypes } = req.query;

      if (!placeId) {
        sendErrorResponse(
          res,
          createValidationError("Place ID is required"),
          req.path
        );
        return;
      }

      const actionTypesArray = actionTypes
        ? ((actionTypes as string)
            .split(",")
            .filter((type) =>
              Object.values(UserActionType).includes(type as UserActionType)
            ) as UserActionType[])
        : undefined;

      const actions = await userActionService.getPlaceActions(
        placeId,
        actionTypesArray
      );

      res.json({
        success: true,
        data: actions,
      });
    }
  ),

  /**
   * Get user action counts by type
   */
  getUserActionCounts: asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.id;

      if (!userId) {
        sendErrorResponse(
          res,
          createValidationError("User ID is required"),
          req.path
        );
        return;
      }

      const counts = await userActionService.getUserActionCounts(userId);

      res.json({
        success: true,
        data: counts,
      });
    }
  ),
};
