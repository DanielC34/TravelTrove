import { Request, Response } from "express";
import UserPreferencesModel from "../models/preferences.model";
import { Types } from "mongoose";
import { Error as MongooseError } from "mongoose";

interface AuthRequest extends Request {
  user?: any;
}

// Custom error type for our application
interface AppError extends Error {
  name: string;
  message: string;
  statusCode?: number;
}

// Type guard for mongoose validation errors
function isValidationError(
  error: unknown
): error is MongooseError.ValidationError {
  return error instanceof Error && error.name === "ValidationError";
}

export const preferencesController = {
  // Get user preferences
  async getPreferences(req: AuthRequest, res: Response) {
    try {
      const preferences = await UserPreferencesModel.findOne({
        userId: req.user._id,
      });

      if (!preferences) {
        return res.status(404).json({ error: "Preferences not found" });
      }

      res.status(200).json(preferences);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Create or update user preferences
  async updatePreferences(req: AuthRequest, res: Response) {
    try {
      const updates = {
        ...req.body,
        userId: new Types.ObjectId(req.user._id),
        lastUpdated: new Date(),
      };

      const options = {
        new: true,
        upsert: true,
        runValidators: true,
      };

      const preferences = await UserPreferencesModel.findOneAndUpdate(
        { userId: req.user._id },
        updates,
        options
      );

      res.status(200).json(preferences);
    } catch (error: unknown) {
      console.error("Error updating preferences:", error);

      if (isValidationError(error)) {
        return res.status(400).json({ error: error.message });
      }

      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }

      res.status(500).json({ error: "Server error" });
    }
  },

  // Delete user preferences
  async deletePreferences(req: AuthRequest, res: Response) {
    try {
      const preferences = await UserPreferencesModel.findOneAndDelete({
        userId: req.user._id,
      });

      if (!preferences) {
        return res.status(404).json({ error: "Preferences not found" });
      }

      res.status(200).json({ message: "Preferences deleted successfully" });
    } catch (error) {
      console.error("Error deleting preferences:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Update specific preference section
  async updatePreferenceSection(req: AuthRequest, res: Response) {
    try {
      const { section } = req.params;
      const updates = req.body;
      const options = { new: true, runValidators: true };

      const validSections = [
        "dietary",
        "mobility",
        "travelInterests",
        "notificationPreferences",
        "budget",
        "dailyBudget",
        "accommodation",
        "activityLevels",
      ];

      if (!validSections.includes(section)) {
        return res.status(400).json({ error: "Invalid preference section" });
      }

      const updateData = {
        [section]: updates,
        lastUpdated: new Date(),
      };

      const preferences = await UserPreferencesModel.findOneAndUpdate(
        { userId: req.user._id },
        { $set: updateData },
        options
      );

      if (!preferences) {
        return res.status(404).json({ error: "Preferences not found" });
      }

      res.status(200).json(preferences);
    } catch (error: unknown) {
      console.error("Error updating preference section:", error);

      if (isValidationError(error)) {
        return res.status(400).json({ error: error.message });
      }

      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }

      res.status(500).json({ error: "Server error" });
    }
  },
};
