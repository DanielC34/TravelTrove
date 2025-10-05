import { Request, Response } from "express";
import { Itinerary } from "../models/itinerary.model";
import { Trip } from "../models/trip.model";
import { asyncHandler, sendErrorResponse, createNotFoundError, createValidationError } from "../utils/errorHandler";

type AuthenticatedRequest = Request & {
  user?: { id: string; email?: string; name?: string; };
};

export const itineraryController = {
  // Add activity to day
  addActivity: asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { tripId, dayNumber } = req.params;
    const userId = req.user?.id;
    
    const itinerary = await Itinerary.findOne({ tripId, userId });
    if (!itinerary) {
      sendErrorResponse(res, createNotFoundError("Itinerary"), req.path);
      return;
    }

    const day = itinerary.days.find(d => d.dayNumber === parseInt(dayNumber));
    if (!day) {
      sendErrorResponse(res, createNotFoundError("Day"), req.path);
      return;
    }

    day.activities.push(req.body);
    await itinerary.save();

    res.json({ success: true, data: itinerary });
  }),

  // Remove activity from day
  removeActivity: asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { tripId, dayNumber, activityIndex } = req.params;
    const userId = req.user?.id;
    
    const itinerary = await Itinerary.findOne({ tripId, userId });
    if (!itinerary) {
      sendErrorResponse(res, createNotFoundError("Itinerary"), req.path);
      return;
    }

    const day = itinerary.days.find(d => d.dayNumber === parseInt(dayNumber));
    if (!day) {
      sendErrorResponse(res, createNotFoundError("Day"), req.path);
      return;
    }

    day.activities.splice(parseInt(activityIndex), 1);
    await itinerary.save();

    res.json({ success: true, data: itinerary });
  }),

  // Reorder activities in day
  reorderActivities: asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { tripId, dayNumber } = req.params;
    const { activities } = req.body;
    const userId = req.user?.id;
    
    const itinerary = await Itinerary.findOne({ tripId, userId });
    if (!itinerary) {
      sendErrorResponse(res, createNotFoundError("Itinerary"), req.path);
      return;
    }

    const day = itinerary.days.find(d => d.dayNumber === parseInt(dayNumber));
    if (!day) {
      sendErrorResponse(res, createNotFoundError("Day"), req.path);
      return;
    }

    day.activities = activities;
    await itinerary.save();

    res.json({ success: true, data: itinerary });
  }),

  // Update activity
  updateActivity: asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { tripId, dayNumber, activityIndex } = req.params;
    const userId = req.user?.id;
    
    const itinerary = await Itinerary.findOne({ tripId, userId });
    if (!itinerary) {
      sendErrorResponse(res, createNotFoundError("Itinerary"), req.path);
      return;
    }

    const day = itinerary.days.find(d => d.dayNumber === parseInt(dayNumber));
    if (!day || !day.activities[parseInt(activityIndex)]) {
      sendErrorResponse(res, createNotFoundError("Activity"), req.path);
      return;
    }

    Object.assign(day.activities[parseInt(activityIndex)], req.body);
    await itinerary.save();

    res.json({ success: true, data: itinerary });
  }),

  // Get itinerary
  getItinerary: asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { tripId } = req.params;
    const userId = req.user?.id;
    
    const itinerary = await Itinerary.findOne({ tripId, userId });
    if (!itinerary) {
      sendErrorResponse(res, createNotFoundError("Itinerary"), req.path);
      return;
    }

    res.json({ success: true, data: itinerary });
  }),

  // Create itinerary
  createItinerary: asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { tripId } = req.params;
    const userId = req.user?.id;
    
    const trip = await Trip.findOne({ _id: tripId, userId });
    if (!trip) {
      sendErrorResponse(res, createNotFoundError("Trip"), req.path);
      return;
    }

    const itinerary = new Itinerary({ tripId, userId, ...req.body });
    await itinerary.save();

    res.status(201).json({ success: true, data: itinerary });
  }),

  // Update itinerary
  updateItinerary: asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { tripId } = req.params;
    const userId = req.user?.id;
    
    const itinerary = await Itinerary.findOneAndUpdate(
      { tripId, userId },
      req.body,
      { new: true }
    );
    
    if (!itinerary) {
      sendErrorResponse(res, createNotFoundError("Itinerary"), req.path);
      return;
    }

    res.json({ success: true, data: itinerary });
  }),

  // Delete itinerary
  deleteItinerary: asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { tripId } = req.params;
    const userId = req.user?.id;
    
    const itinerary = await Itinerary.findOneAndDelete({ tripId, userId });
    if (!itinerary) {
      sendErrorResponse(res, createNotFoundError("Itinerary"), req.path);
      return;
    }

    res.json({ success: true, message: "Itinerary deleted successfully" });
  }),
};