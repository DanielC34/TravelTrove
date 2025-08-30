import { Router } from "express";
import { aiController } from "../controllers/ai.controller";
import { auth } from "../middleware/auth";

export const aiRouter = Router();

// All routes require authentication
aiRouter.use(auth);

// Generate itinerary for a trip
aiRouter.post("/itinerary/:tripId", aiController.generateItinerary);

// Regenerate itinerary for a trip
aiRouter.put("/itinerary/:tripId/regenerate", aiController.regenerateItinerary);

// Get AI suggestions for activities
aiRouter.post("/suggestions", aiController.getActivitySuggestions);

// Get travel recommendations
aiRouter.post("/recommendations", aiController.getTravelRecommendations);
