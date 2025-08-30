import express from "express";
import { tripController } from "../controllers/trip.controller";
import { auth } from "../middleware/auth";

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all trips for the authenticated user
router.get("/", tripController.getTrips);

// Get trip statistics
router.get("/stats", tripController.getTripStats);

// Get a single trip by ID
router.get("/:id", tripController.getTrip);

// Create a new trip
router.post("/", tripController.createTrip);

// Update a trip
router.put("/:id", tripController.updateTrip);

// Update trip status
router.patch("/:id/status", tripController.updateTripStatus);

// Delete a trip
router.delete("/:id", tripController.deleteTrip);

export const tripRouter = router;
