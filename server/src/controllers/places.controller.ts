import { Request, Response } from "express";
import { placesService } from "../services/places.service";
import {
  asyncHandler,
  sendErrorResponse,
  createValidationError,
} from "../utils/errorHandler";

export const placesController = {
  // Search places
  searchPlaces: asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { q: query, limit } = req.query;

      if (!query || typeof query !== "string") {
        sendErrorResponse(
          res,
          createValidationError("Query parameter 'q' is required"),
          req.path
        );
        return;
      }

      const searchLimit = limit ? parseInt(limit as string, 10) : 10;

      if (isNaN(searchLimit) || searchLimit < 1 || searchLimit > 50) {
        sendErrorResponse(
          res,
          createValidationError("Limit must be between 1 and 50"),
          req.path
        );
        return;
      }

      const results = await placesService.searchPlaces(query, searchLimit);

      res.json({
        success: true,
        data: results,
      });
    }
  ),

  // Get place details
  getPlaceDetails: asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        sendErrorResponse(
          res,
          createValidationError("Place ID is required"),
          req.path
        );
        return;
      }

      const placeDetails = await placesService.getPlaceDetails(id);

      res.json({
        success: true,
        data: placeDetails,
      });
    }
  ),
};
