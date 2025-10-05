import { Router } from "express";
import { userActionController } from "../controllers/userAction.controller";
import { auth } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(auth);

// Record user actions
router.post("/", userActionController.recordAction);
router.post("/batch", userActionController.recordActions);

// Get user-specific data
router.get("/stats", userActionController.getUserStats);
router.get("/recent", userActionController.getUserRecentActions);
router.get("/counts", userActionController.getUserActionCounts);

// Get place-specific data
router.get("/place/:placeId", userActionController.getPlaceActions);

// Analytics endpoints (could be restricted to admin users in the future)
router.get("/analytics/popular-places", userActionController.getPopularPlaces);
router.get("/analytics/search", userActionController.getSearchAnalytics);

export default router;
