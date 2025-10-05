import { describe, it, expect, beforeEach, vi } from "vitest";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { itineraryController } from "../controllers/itinerary.controller";
import { Itinerary } from "../models/itinerary.model";

interface AuthRequest extends Request {
  user?: { id: string; name: string; email: string; };
}

describe("Itinerary Controller - Drag & Drop", () => {
  const mockRequest = {} as AuthRequest;
  const mockResponse = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response;

  const mockUserId = new mongoose.Types.ObjectId();
  const mockTripId = new mongoose.Types.ObjectId();

  const mockItinerary = {
    _id: new mongoose.Types.ObjectId(),
    tripId: mockTripId,
    userId: mockUserId,
    name: "Test Itinerary",
    days: [
      {
        dayNumber: 1,
        date: new Date("2024-01-01"),
        activities: [
          {
            name: "Activity 1",
            location: { name: "Location 1" },
            startTime: "09:00",
            endTime: "10:00",
            duration: 60,
            category: "attraction",
            isFlexible: true,
            priority: "must-see",
          },
          {
            name: "Activity 2", 
            location: { name: "Location 2" },
            startTime: "11:00",
            endTime: "12:00",
            duration: 60,
            category: "restaurant",
            isFlexible: false,
            priority: "recommended",
          },
        ],
      },
    ],
    save: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockRequest.user = {
      id: mockUserId.toString(),
      name: "Test User",
      email: "test@example.com",
    };
    mockRequest.params = {
      tripId: mockTripId.toString(),
      dayNumber: "1",
    };
  });

  describe("reorderActivities", () => {
    it("should reorder activities successfully", async () => {
      const reorderedActivities = [
        mockItinerary.days[0].activities[1], // Move second activity first
        mockItinerary.days[0].activities[0], // Move first activity second
      ];

      mockRequest.body = { activities: reorderedActivities };

      // Mock Itinerary.findOne to return our mock itinerary
      vi.spyOn(Itinerary, "findOne").mockResolvedValue(mockItinerary as any);

      await itineraryController.reorderActivities(mockRequest, mockResponse);

      expect(Itinerary.findOne).toHaveBeenCalledWith({
        tripId: mockTripId.toString(),
        userId: mockUserId.toString(),
      });

      expect(mockItinerary.days[0].activities).toEqual(reorderedActivities);
      expect(mockItinerary.save).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockItinerary,
      });
    });

    it("should return 404 when itinerary not found", async () => {
      mockRequest.body = { activities: [] };

      vi.spyOn(Itinerary, "findOne").mockResolvedValue(null);

      await itineraryController.reorderActivities(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it("should return 404 when day not found", async () => {
      mockRequest.params.dayNumber = "999"; // Non-existent day
      mockRequest.body = { activities: [] };

      vi.spyOn(Itinerary, "findOne").mockResolvedValue(mockItinerary as any);

      await itineraryController.reorderActivities(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe("addActivity", () => {
    it("should add activity to day successfully", async () => {
      const newActivity = {
        name: "New Activity",
        location: { name: "New Location" },
        startTime: "14:00",
        endTime: "15:00",
        duration: 60,
        category: "activity",
        isFlexible: true,
        priority: "optional",
      };

      mockRequest.body = newActivity;

      vi.spyOn(Itinerary, "findOne").mockResolvedValue(mockItinerary as any);

      await itineraryController.addActivity(mockRequest, mockResponse);

      expect(mockItinerary.days[0].activities).toContain(newActivity);
      expect(mockItinerary.save).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockItinerary,
      });
    });
  });

  describe("removeActivity", () => {
    it("should remove activity from day successfully", async () => {
      mockRequest.params.activityIndex = "0";
      const originalLength = mockItinerary.days[0].activities.length;

      vi.spyOn(Itinerary, "findOne").mockResolvedValue(mockItinerary as any);

      await itineraryController.removeActivity(mockRequest, mockResponse);

      expect(mockItinerary.days[0].activities).toHaveLength(originalLength - 1);
      expect(mockItinerary.save).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockItinerary,
      });
    });
  });
});