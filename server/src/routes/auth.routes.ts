import { Router } from "express";
import { 
  register, 
  login, 
  getProfile, 
  refreshToken, 
  logout,
  googleCallback
} from "../controllers/auth.controller";
import { auth, rateLimit } from "../middleware/auth";
import passport from "passport";
import "../config/passport";

const router = Router();

// Apply rate limiting to auth endpoints
const authRateLimit = rateLimit(5, 15 * 60 * 1000); // 5 requests per 15 minutes

// Public routes (no authentication required)
router.post("/register", authRateLimit, register);
router.post("/login", authRateLimit, login);

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/auth" }), googleCallback);

// Protected routes (authentication required)
router.get("/profile", auth, getProfile);
router.post("/refresh", auth, refreshToken);
router.post("/logout", auth, logout);

export const authRouter = router;
