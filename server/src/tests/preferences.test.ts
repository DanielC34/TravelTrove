import { describe, it, expect, beforeEach, vi } from "vitest";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { preferencesController } from "../controllers/preferences.controller";
import UserPreferencesModel from "../models/preferences.model";

// Extend Request type to include user
interface AuthRequest extends Request {
  user?: { _id: mongoose.Types.ObjectId };
}

describe("Preferences Controller", () => {
  // Mock request and response objects
  const mockRequest = {} as AuthRequest;
  const mockResponse = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response;

  // Sample user ID for testing
  const mockUserId = new mongoose.Types.ObjectId();

  // Sample preferences data for testing
  const mockPreferences = {
    dietary: {
      restrictions: ["vegetarian"],
      allergies: ["nuts"],
      additionalNotes: "No spicy food",
    },
    mobility: {
      hasMobilityNeeds: false,
      requiresWheelchair: false,
      requiresElevator: false,
    },
    travelInterests: {
      preferredActivities: ["hiking", "swimming"],
      preferredDestinations: ["beach", "mountains"],
      preferredAccommodationTypes: ["hotel"],
      preferredTransportation: ["public"],
    },
  };

  // Setup before each test
  beforeEach(async () => {
    // Clear the database
    await UserPreferencesModel.deleteMany({});
    // Reset mocks
    vi.clearAllMocks();
    // Set up request user
    mockRequest.user = { _id: mockUserId };
  });

  describe("getPreferences", () => {
    it("should return 404 when preferences don't exist", async () => {
      await preferencesController.getPreferences(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Preferences not found",
        })
      );
    });

    it("should return preferences when they exist", async () => {
      // Create test data
      await UserPreferencesModel.create({
        userId: mockUserId,
        ...mockPreferences,
      });

      await preferencesController.getPreferences(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserId,
          dietary: expect.objectContaining({
            restrictions: mockPreferences.dietary.restrictions,
            allergies: mockPreferences.dietary.allergies,
            additionalNotes: mockPreferences.dietary.additionalNotes,
          }),
        })
      );
    });
  });

  describe("updatePreferences", () => {
    it("should create new preferences", async () => {
      await preferencesController.updatePreferences(
        { ...mockRequest, body: mockPreferences } as any,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserId,
          dietary: expect.objectContaining({
            restrictions: mockPreferences.dietary.restrictions,
            allergies: mockPreferences.dietary.allergies,
            additionalNotes: mockPreferences.dietary.additionalNotes,
          }),
        })
      );

      // Verify database state
      const savedPreferences = await UserPreferencesModel.findOne({
        userId: mockUserId,
      });
      expect(savedPreferences).toBeTruthy();
      expect(savedPreferences?.dietary).toMatchObject(mockPreferences.dietary);
    });

    it("should update existing preferences", async () => {
      // Create initial preferences
      await UserPreferencesModel.create({
        userId: mockUserId,
        ...mockPreferences,
      });

      const updatedData = {
        ...mockPreferences,
        dietary: {
          ...mockPreferences.dietary,
          restrictions: ["vegan"],
        },
      };

      await preferencesController.updatePreferences(
        { ...mockRequest, body: updatedData } as any,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          dietary: expect.objectContaining({
            restrictions: ["vegan"],
          }),
        })
      );
    });

    it("should handle validation errors", async () => {
      const invalidData = {
        dietary: {
          restrictions: ["invalid-restriction"], // Invalid value
        },
      };

      await preferencesController.updatePreferences(
        { ...mockRequest, body: invalidData } as any,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });
  });

  describe("deletePreferences", () => {
    it("should delete existing preferences", async () => {
      // Create test data
      await UserPreferencesModel.create({
        userId: mockUserId,
        ...mockPreferences,
      });

      await preferencesController.deletePreferences(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Preferences deleted successfully",
        })
      );

      // Verify deletion
      const deletedPreferences = await UserPreferencesModel.findOne({
        userId: mockUserId,
      });
      expect(deletedPreferences).toBeNull();
    });

    it("should return 404 when preferences don't exist", async () => {
      await preferencesController.deletePreferences(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Preferences not found",
        })
      );
    });
  });

  describe("updatePreferenceSection", () => {
    it("should update a specific section", async () => {
      // Create initial preferences
      await UserPreferencesModel.create({
        userId: mockUserId,
        ...mockPreferences,
      });

      const newDietary = {
        restrictions: ["vegan"],
        allergies: ["shellfish"],
        additionalNotes: "No seafood",
      };

      await preferencesController.updatePreferenceSection(
        {
          ...mockRequest,
          params: { section: "dietary" },
          body: newDietary,
        } as any,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          dietary: expect.objectContaining({
            restrictions: newDietary.restrictions,
            allergies: newDietary.allergies,
            additionalNotes: newDietary.additionalNotes,
          }),
        })
      );
    });

    it("should return 400 for invalid section", async () => {
      await preferencesController.updatePreferenceSection(
        {
          ...mockRequest,
          params: { section: "invalidSection" },
          body: {},
        } as any,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Invalid preference section",
        })
      );
    });

    it("should handle validation errors in section update", async () => {
      await UserPreferencesModel.create({
        userId: mockUserId,
        ...mockPreferences,
      });

      const invalidDietary = {
        restrictions: ["invalid-restriction"],
      };

      await preferencesController.updatePreferenceSection(
        {
          ...mockRequest,
          params: { section: "dietary" },
          body: invalidDietary,
        } as any,
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });
  });
});
