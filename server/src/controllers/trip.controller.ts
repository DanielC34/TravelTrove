import { Request, Response } from "express";
import { Trip } from "../models/trip.model";
import { Itinerary } from "../models/itinerary.model";
import mongoose from "mongoose";
import { 
  createAuthenticationError, 
  createValidationError, 
  createNotFoundError,
  createConflictError,
  ErrorCodes,
  sendErrorResponse,
  asyncHandler 
} from "../utils/errorHandler";

// Define the request type that includes the user property
type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    email?: string;
    name?: string;
  };
};

export const tripController = {
  // Get all trips for a user
  getTrips: asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const userId = req.user?.id;
      if (!userId) {
        const error = createAuthenticationError(
          ErrorCodes.TOKEN_MISSING,
          "Authentication required"
        );
        sendErrorResponse(res, error, req.path);
        return;
      }

      const { status, destination } = req.query;
      const filter: any = { userId };

      if (status) {
        filter.status = status;
      }

      if (destination) {
        filter.destination = { $regex: destination as string, $options: "i" };
      }

      const trips = await Trip.find(filter)
        .sort({ startDate: 1 })
        .populate("userId", "name email");

      res.status(200).json({
        success: true,
        data: {
          trips,
          count: trips.length,
        },
      });
    }
  ),

  // Get a single trip by ID
  getTrip: asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        const error = createAuthenticationError(
          ErrorCodes.TOKEN_MISSING,
          "Authentication required"
        );
        sendErrorResponse(res, error, req.path);
        return;
      }

      // Validate trip ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = createValidationError("Invalid trip ID format");
        sendErrorResponse(res, error, req.path);
        return;
      }

      const trip = await Trip.findOne({ _id: id, userId }).populate(
        "userId",
        "name email"
      );

      if (!trip) {
        const error = createNotFoundError("Trip");
        sendErrorResponse(res, error, req.path);
        return;
      }

      // Get associated itinerary
      const itinerary = await Itinerary.findOne({ tripId: id });

      res.status(200).json({
        success: true,
        data: {
          trip,
          itinerary: itinerary || null,
        },
      });
    }
  ),

  // Create a new trip
  createTrip: asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const userId = req.user?.id;
      if (!userId) {
        const error = createAuthenticationError(
          ErrorCodes.TOKEN_MISSING,
          "Authentication required"
        );
        sendErrorResponse(res, error, req.path);
        return;
      }

      const {
        name,
        destination,
        startDate,
        endDate,
        travelers,
        budget,
        description,
        tags,
      } = req.body;

      // Validate required fields
      const requiredFields = {
        name,
        destination,
        startDate,
        endDate,
        travelers,
        budget,
      };
      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key, _]) => key);

      if (missingFields.length > 0) {
        const error = createValidationError(
          `Missing required fields: ${missingFields.join(", ")}`,
          { missingFields }
        );
        sendErrorResponse(res, error, req.path);
        return;
      }

      // Validate dates
      const start = new Date(startDate);
      const end = new Date(endDate);
      const now = new Date();

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        const error = createValidationError("Invalid date format");
        sendErrorResponse(res, error, req.path);
        return;
      }

      if (start < now) {
        const error = createValidationError("Start date cannot be in the past");
        sendErrorResponse(res, error, req.path);
        return;
      }

      if (end <= start) {
        const error = createValidationError(
          "End date must be after start date"
        );
        sendErrorResponse(res, error, req.path);
        return;
      }

      // Validate travelers
      if (!travelers.count || travelers.count < 1) {
        const error = createValidationError(
          "At least one traveler is required"
        );
        sendErrorResponse(res, error, req.path);
        return;
      }

      // Validate budget
      if (!budget.amount || budget.amount < 0) {
        const error = createValidationError("Budget amount must be positive");
        sendErrorResponse(res, error, req.path);
        return;
      }

      const trip = new Trip({
        userId,
        name: name.trim(),
        destination: destination.trim(),
        startDate: start,
        endDate: end,
        travelers,
        budget,
        description: description?.trim() || "",
        tags: tags || [],
        status: "planning",
      });

      const savedTrip = await trip.save();

      res.status(201).json({
        success: true,
        message: "Trip created successfully",
        data: {
          trip: savedTrip,
        },
      });
    }
  ),

  // Update a trip
  updateTrip: asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        const error = createAuthenticationError(
          ErrorCodes.TOKEN_MISSING,
          "Authentication required"
        );
        sendErrorResponse(res, error, req.path);
        return;
      }

      // Validate trip ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = createValidationError("Invalid trip ID format");
        sendErrorResponse(res, error, req.path);
        return;
      }

      const trip = await Trip.findOne({ _id: id, userId });
      if (!trip) {
        const error = createNotFoundError("Trip");
        sendErrorResponse(res, error, req.path);
        return;
      }

      // Update trip fields
      const updateData = req.body;

      // Validate dates if provided
      if (updateData.startDate || updateData.endDate) {
        const start = updateData.startDate
          ? new Date(updateData.startDate)
          : trip.startDate;
        const end = updateData.endDate
          ? new Date(updateData.endDate)
          : trip.endDate;

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          const error = createValidationError("Invalid date format");
          sendErrorResponse(res, error, req.path);
          return;
        }

        if (end <= start) {
          const error = createValidationError(
            "End date must be after start date"
          );
          sendErrorResponse(res, error, req.path);
          return;
        }
      }

      // Update the trip
      Object.assign(trip, updateData);
      const updatedTrip = await trip.save();

      res.status(200).json({
        success: true,
        message: "Trip updated successfully",
        data: {
          trip: updatedTrip,
        },
      });
    }
  ),

  // Update trip status
  updateTripStatus: asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        const error = createAuthenticationError(
          ErrorCodes.TOKEN_MISSING,
          "Authentication required"
        );
        sendErrorResponse(res, error, req.path);
        return;
      }

      // Validate trip ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = createValidationError("Invalid trip ID format");
        sendErrorResponse(res, error, req.path);
        return;
      }

      // Validate status
      const validStatuses = [
        "draft",
        "planning",
        "confirmed",
        "completed",
        "cancelled",
      ];
      if (!validStatuses.includes(status)) {
        const error = createValidationError(
          `Invalid status. Must be one of: ${validStatuses.join(", ")}`
        );
        sendErrorResponse(res, error, req.path);
        return;
      }

      const trip = await Trip.findOne({ _id: id, userId });
      if (!trip) {
        const error = createNotFoundError("Trip");
        sendErrorResponse(res, error, req.path);
        return;
      }

      trip.status = status;
      const updatedTrip = await trip.save();

      res.status(200).json({
        success: true,
        message: "Trip status updated successfully",
        data: {
          trip: updatedTrip,
        },
      });
    }
  ),

  // Delete a trip
  deleteTrip: asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        const error = createAuthenticationError(
          ErrorCodes.TOKEN_MISSING,
          "Authentication required"
        );
        sendErrorResponse(res, error, req.path);
        return;
      }

      // Validate trip ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = createValidationError("Invalid trip ID format");
        sendErrorResponse(res, error, req.path);
        return;
      }

      const trip = await Trip.findOne({ _id: id, userId });
      if (!trip) {
        const error = createNotFoundError("Trip");
        sendErrorResponse(res, error, req.path);
        return;
      }

      // Delete associated itinerary if it exists
      await Itinerary.deleteOne({ tripId: id });

      // Delete the trip
      await Trip.deleteOne({ _id: id });

      res.status(200).json({
        success: true,
        message: "Trip deleted successfully",
      });
    }
  ),

  // Get trip statistics
  getTripStats: asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const userId = req.user?.id;
      if (!userId) {
        const error = createAuthenticationError(
          ErrorCodes.TOKEN_MISSING,
          "Authentication required"
        );
        sendErrorResponse(res, error, req.path);
        return;
      }

      const [totalTrips, upcomingTrips, statusStats] = await Promise.all([
        Trip.countDocuments({ userId }),
        Trip.countDocuments({
          userId,
          startDate: { $gte: new Date() },
          status: { $in: ["planning", "confirmed"] },
        }),
        Trip.aggregate([
          { $match: { userId: new mongoose.Types.ObjectId(userId) } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
      ]);

      const byStatus = statusStats.reduce((acc: any, stat: any) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {});

      res.status(200).json({
        success: true,
        data: {
          totalTrips,
          upcomingTrips,
          byStatus,
        },
      });
    }
  ),
};
