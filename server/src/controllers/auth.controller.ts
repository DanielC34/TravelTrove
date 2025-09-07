// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { User } from "../models/user.model";
import JWTService from "../services/jwt.service";
import passport from "passport";
import {
  createAuthenticationError,
  createValidationError,
  createConflictError,
  createNotFoundError,
  ErrorCodes,
  sendErrorResponse,
} from "../utils/errorHandler";

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      const error = createValidationError(
        ErrorCodes.INVALID_INPUT,
        "Email, password, and name are required"
      );
      sendErrorResponse(res, error, req.path);
      return;
    }

    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      const error = createConflictError("User with this email already exists");
      sendErrorResponse(res, error, req.path);
      return;
    }

    const user = new User({
      email,
      passwordHash: password,
      name,
      providers: ["local"],
    });

    await user.save();

    const token = JWTService.generateToken(user);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error("❌ Register error:", error);
    const authError = createAuthenticationError(
      ErrorCodes.UNKNOWN_ERROR,
      "Registration failed"
    );
    sendErrorResponse(res, authError, req.path);
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = createValidationError(
        ErrorCodes.INVALID_INPUT,
        "Email and password are required"
      );
      sendErrorResponse(res, error, req.path);
      return;
    }

    const user = await User.findOne({ email }).exec();
    if (!user || !(await user.comparePassword(password))) {
      const error = createAuthenticationError(
        ErrorCodes.INVALID_CREDENTIALS,
        "Invalid email or password"
      );
      sendErrorResponse(res, error, req.path);
      return;
    }

    const token = JWTService.generateToken(user);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error("❌ Login error:", error);
    const authError = createAuthenticationError(
      ErrorCodes.UNKNOWN_ERROR,
      "Login failed"
    );
    sendErrorResponse(res, authError, req.path);
  }
};

/**
 * Get logged-in user's profile
 */
export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      const error = createAuthenticationError(
        ErrorCodes.TOKEN_MISSING,
        "Authentication required"
      );
      sendErrorResponse(res, error, req.path);
      return;
    }

    const user = await User.findById(req.user.id).exec();
    if (!user) {
      const error = createNotFoundError("User");
      sendErrorResponse(res, error, req.path);
      return;
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error("❌ GetProfile error:", error);
    const authError = createAuthenticationError(
      ErrorCodes.UNKNOWN_ERROR,
      "Fetching profile failed"
    );
    sendErrorResponse(res, authError, req.path);
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      const error = createAuthenticationError(
        ErrorCodes.TOKEN_MISSING,
        "Authentication required"
      );
      sendErrorResponse(res, error, req.path);
      return;
    }

    const user = await User.findById(req.user.id).exec();
    if (!user) {
      const error = createNotFoundError("User");
      sendErrorResponse(res, error, req.path);
      return;
    }

    const token = JWTService.generateToken(user);

    res.json({
      success: true,
      data: { token },
    });
  } catch (error: any) {
    console.error("❌ RefreshToken error:", error);
    const authError = createAuthenticationError(
      ErrorCodes.UNKNOWN_ERROR,
      "Refreshing token failed"
    );
    sendErrorResponse(res, authError, req.path);
  }
};

/**
 * Logout user
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      const error = createAuthenticationError(
        ErrorCodes.TOKEN_MISSING,
        "Authentication required"
      );
      sendErrorResponse(res, error, req.path);
      return;
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    console.error("❌ Logout error:", error);
    const authError = createAuthenticationError(
      ErrorCodes.UNKNOWN_ERROR,
      "Logout failed"
    );
    sendErrorResponse(res, authError, req.path);
  }
};

/**
 * Google OAuth success callback
 */
export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.redirect(`${process.env.CLIENT_URL}/auth?error=oauth_failed`);
      return;
    }

    const user = req.user as any;
    const token = JWTService.generateToken(user);
    
    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id: user._id,
      email: user.email,
      name: user.name
    }))}`);;
  } catch (error: any) {
    console.error("❌ Google callback error:", error);
    res.redirect(`${process.env.CLIENT_URL}/auth?error=oauth_failed`);
  }
};
