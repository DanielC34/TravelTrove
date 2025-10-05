import express from "express";
import { itineraryController } from "../controllers/itinerary.controller";
import { auth } from "../middleware/auth";

const router = express.Router();
router.use(auth);

// Itinerary management
router.get("/:tripId", itineraryController.getItinerary);
router.post("/:tripId", itineraryController.createItinerary);
router.put("/:tripId", itineraryController.updateItinerary);
router.delete("/:tripId", itineraryController.deleteItinerary);

// Activity management
router.post("/:tripId/days/:dayNumber/activities", itineraryController.addActivity);
router.put("/:tripId/days/:dayNumber/activities/:activityIndex", itineraryController.updateActivity);
router.delete("/:tripId/days/:dayNumber/activities/:activityIndex", itineraryController.removeActivity);
router.patch("/:tripId/days/:dayNumber/activities/reorder", itineraryController.reorderActivities);

export const itineraryRouter = router;