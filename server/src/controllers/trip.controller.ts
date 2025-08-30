import { Request, Response } from "express";
import { Trip } from "../models/trip.model";
import { Itinerary } from "../models/itinerary.model";

export const tripController = {
  // Get all trips for a user
  async getTrips(req: Request, res: Response) {
    try {
      // const userId = req.user?.id;
      const userId = "temp-user-id"; // Temporary fix
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
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

      res.json(trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
      res.status(500).json({ message: "Error fetching trips" });
    }
  },

  // Get a single trip by ID
  async getTrip(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // const userId = req.user?.id;
      const userId = "temp-user-id"; // Temporary fix

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const trip = await Trip.findOne({ _id: id, userId }).populate(
        "userId",
        "name email"
      );

      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      // Get associated itinerary
      const itinerary = await Itinerary.findOne({ tripId: id });

      res.json({
        trip,
        itinerary: itinerary || null,
      });
    } catch (error) {
      console.error("Error fetching trip:", error);
      res.status(500).json({ message: "Error fetching trip" });
    }
  },

  // Create a new trip
  async createTrip(req: Request, res: Response) {
    try {
      // const userId = req.user?.id;
      const userId = "temp-user-id"; // Temporary fix
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
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
      if (
        !name ||
        !destination ||
        !startDate ||
        !endDate ||
        !travelers ||
        !budget
      ) {
        return res.status(400).json({
          message:
            "Missing required fields: name, destination, startDate, endDate, travelers, budget",
        });
      }

      // Validate dates
      const start = new Date(startDate);
      const end = new Date(endDate);
      const now = new Date();

      if (start < now) {
        return res
          .status(400)
          .json({ message: "Start date cannot be in the past" });
      }

      if (end <= start) {
        return res
          .status(400)
          .json({ message: "End date must be after start date" });
      }

      // Validate travelers
      if (travelers.count < 1) {
        return res
          .status(400)
          .json({ message: "At least one traveler is required" });
      }

      // Validate budget
      if (budget.amount < 0) {
        return res
          .status(400)
          .json({ message: "Budget amount cannot be negative" });
      }

      const trip = new Trip({
        userId,
        name,
        destination,
        startDate: start,
        endDate: end,
        travelers,
        budget,
        description,
        tags: tags || [],
      });

      const savedTrip = await trip.save();

      res.status(201).json(savedTrip);
    } catch (error) {
      console.error("Error creating trip:", error);
      res.status(500).json({ message: "Error creating trip" });
    }
  },

  // Update a trip
  async updateTrip(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // const userId = req.user?.id;
      const userId = "temp-user-id"; // Temporary fix

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const trip = await Trip.findOne({ _id: id, userId });

      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      const updateData = req.body;

      // Validate dates if provided
      if (updateData.startDate || updateData.endDate) {
        const start = updateData.startDate
          ? new Date(updateData.startDate)
          : trip.startDate;
        const end = updateData.endDate
          ? new Date(updateData.endDate)
          : trip.endDate;
        const now = new Date();

        if (start < now) {
          return res
            .status(400)
            .json({ message: "Start date cannot be in the past" });
        }

        if (end <= start) {
          return res
            .status(400)
            .json({ message: "End date must be after start date" });
        }
      }

      // Validate travelers if provided
      if (updateData.travelers && updateData.travelers.count < 1) {
        return res
          .status(400)
          .json({ message: "At least one traveler is required" });
      }

      // Validate budget if provided
      if (updateData.budget && updateData.budget.amount < 0) {
        return res
          .status(400)
          .json({ message: "Budget amount cannot be negative" });
      }

      const updatedTrip = await Trip.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      res.json(updatedTrip);
    } catch (error) {
      console.error("Error updating trip:", error);
      res.status(500).json({ message: "Error updating trip" });
    }
  },

  // Delete a trip
  async deleteTrip(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // const userId = req.user?.id;
      const userId = "temp-user-id"; // Temporary fix

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const trip = await Trip.findOne({ _id: id, userId });

      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      // Delete associated itinerary
      await Itinerary.deleteMany({ tripId: id });

      // Delete the trip
      await Trip.findByIdAndDelete(id);

      res.json({ message: "Trip deleted successfully" });
    } catch (error) {
      console.error("Error deleting trip:", error);
      res.status(500).json({ message: "Error deleting trip" });
    }
  },

  // Update trip status
  async updateTripStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      // const userId = req.user?.id;
      const userId = "temp-user-id"; // Temporary fix

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const validStatuses = [
        "draft",
        "planning",
        "confirmed",
        "completed",
        "cancelled",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const trip = await Trip.findOneAndUpdate(
        { _id: id, userId },
        { status },
        { new: true }
      );

      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      res.json(trip);
    } catch (error) {
      console.error("Error updating trip status:", error);
      res.status(500).json({ message: "Error updating trip status" });
    }
  },

  // Get trip statistics
  async getTripStats(req: Request, res: Response) {
    try {
      // const userId = req.user?.id;
      const userId = "temp-user-id"; // Temporary fix

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const stats = await Trip.aggregate([
        {
          $match: { userId: new (require("mongoose").Types.ObjectId)(userId) },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const totalTrips = await Trip.countDocuments({ userId });
      const upcomingTrips = await Trip.countDocuments({
        userId,
        startDate: { $gte: new Date() },
        status: { $in: ["draft", "planning", "confirmed"] },
      });

      const result = {
        totalTrips,
        upcomingTrips,
        byStatus: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {} as Record<string, number>),
      };

      res.json(result);
    } catch (error) {
      console.error("Error fetching trip stats:", error);
      res.status(500).json({ message: "Error fetching trip statistics" });
    }
  },
};
