import { Request, Response } from "express";
import { Trip } from "../models/trip.model";
import { Itinerary } from "../models/itinerary.model";
import { openaiService } from "../services/openai.service";

// Define the authenticated request type
type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    email?: string;
    name?: string;
  };
};

export const aiController = {
  // Generate itinerary for a trip
  async generateItinerary(req: AuthenticatedRequest, res: Response) {
    try {
      const { tripId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Get trip data
      const trip = await Trip.findOne({ _id: tripId, userId });
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      // Check if itinerary already exists
      const existingItinerary = await Itinerary.findOne({ tripId });
      if (existingItinerary) {
        return res
          .status(400)
          .json({ message: "Itinerary already exists for this trip" });
      }

      // Check if OpenAI API key is configured
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          message:
            "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.",
        });
      }

      // Generate itinerary using OpenAI
      const itineraryData = await openaiService.generateItinerary({
        destination: trip.destination,
        startDate: trip.startDate.toISOString().split("T")[0],
        endDate: trip.endDate.toISOString().split("T")[0],
        travelers: trip.travelers,
        budget: trip.budget,
      });

      // Create itinerary
      const itinerary = new Itinerary({
        tripId,
        userId,
        ...itineraryData,
      });

      const savedItinerary = await itinerary.save();

      res.status(201).json(savedItinerary);
    } catch (error: any) {
      console.error("Error generating itinerary:", error);

      // Handle specific OpenAI errors
      if (error.message.includes("OpenAI API key")) {
        return res.status(500).json({
          message:
            "AI service not configured. Please check your OpenAI API key.",
        });
      }

      if (error.message.includes("Invalid response format")) {
        return res.status(500).json({
          message: "AI generated invalid response. Please try again.",
        });
      }

      res.status(500).json({ message: "Error generating itinerary" });
    }
  },

  // Regenerate itinerary
  async regenerateItinerary(req: AuthenticatedRequest, res: Response) {
    try {
      const { tripId } = req.params;
      const userId = req.user?.id; // SECURITY FIX: Use actual authenticated user

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Get trip data
      const trip = await Trip.findOne({ _id: tripId, userId });
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      // Check if OpenAI API key is configured
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          message:
            "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.",
        });
      }

      // Delete existing itinerary
      await Itinerary.deleteMany({ tripId });

      // Generate new itinerary using OpenAI
      const itineraryData = await openaiService.generateItinerary({
        destination: trip.destination,
        startDate: trip.startDate.toISOString().split("T")[0],
        endDate: trip.endDate.toISOString().split("T")[0],
        travelers: trip.travelers,
        budget: trip.budget,
      });

      // Create new itinerary
      const itinerary = new Itinerary({
        tripId,
        userId,
        ...itineraryData,
        version: 2, // Increment version
      });

      const savedItinerary = await itinerary.save();

      res.json(savedItinerary);
    } catch (error: any) {
      console.error("Error regenerating itinerary:", error);

      // Handle specific OpenAI errors
      if (error.message.includes("OpenAI API key")) {
        return res.status(500).json({
          message:
            "AI service not configured. Please check your OpenAI API key.",
        });
      }

      if (error.message.includes("Invalid response format")) {
        return res.status(500).json({
          message: "AI generated invalid response. Please try again.",
        });
      }

      res.status(500).json({ message: "Error regenerating itinerary" });
    }
  },

  // Get AI suggestions for activities
  async getActivitySuggestions(req: Request, res: Response) {
    try {
      const { destination, interests, budget } = req.body;

      if (!destination) {
        return res.status(400).json({ message: "Destination is required" });
      }

      // Check if OpenAI API key is configured
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          message:
            "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.",
        });
      }

      // Get AI suggestions using OpenAI
      const suggestionsData = await openaiService.getActivitySuggestions(
        destination,
        interests,
        budget
      );

      res.json(suggestionsData);
    } catch (error: any) {
      console.error("Error getting activity suggestions:", error);

      // Handle specific OpenAI errors
      if (error.message.includes("OpenAI API key")) {
        return res.status(500).json({
          message:
            "AI service not configured. Please check your OpenAI API key.",
        });
      }

      if (error.message.includes("Invalid response format")) {
        return res.status(500).json({
          message: "AI generated invalid response. Please try again.",
        });
      }

      res.status(500).json({ message: "Error getting activity suggestions" });
    }
  },

  // Get travel recommendations
  async getTravelRecommendations(req: Request, res: Response) {
    try {
      const { destination, tripType, budget } = req.body;

      if (!destination) {
        return res.status(400).json({ message: "Destination is required" });
      }

      // Check if OpenAI API key is configured
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          message:
            "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.",
        });
      }

      // Get travel recommendations using OpenAI
      const recommendationsData = await openaiService.getTravelRecommendations(
        destination,
        tripType || "general",
        budget || "moderate"
      );

      res.json(recommendationsData);
    } catch (error: any) {
      console.error("Error getting travel recommendations:", error);

      // Handle specific OpenAI errors
      if (error.message.includes("OpenAI API key")) {
        return res.status(500).json({
          message:
            "AI service not configured. Please check your OpenAI API key.",
        });
      }

      if (error.message.includes("Invalid response format")) {
        return res.status(500).json({
          message: "AI generated invalid response. Please try again.",
        });
      }

      res.status(500).json({ message: "Error getting travel recommendations" });
    }
  },
};
