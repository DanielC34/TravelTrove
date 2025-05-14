import express from "express";
import { preferencesController } from "../controllers/preferences.controller";
import { auth } from "../middleware/auth";

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get user preferences
router.get("/", preferencesController.getPreferences);

// Create or update user preferences
router.put("/", preferencesController.updatePreferences);

// Delete user preferences
router.delete("/", preferencesController.deletePreferences);

// Update specific preference section
router.patch("/:section", preferencesController.updatePreferenceSection);

export const preferencesRouter = router;
