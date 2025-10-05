import express from "express";
import { placesController } from "../controllers/places.controller";
import { auth } from "../middleware/auth";

const router = express.Router();

// Test endpoints (no authentication required for development)
if (process.env.NODE_ENV === "development") {
  router.get("/test/search", placesController.searchPlaces);
  router.get("/test/:id", placesController.getPlaceDetails);
}

// All production routes require authentication
router.use(auth);

// Search places
router.get("/search", placesController.searchPlaces);

// Get place details
router.get("/:id", placesController.getPlaceDetails);

export const placesRouter = router;
