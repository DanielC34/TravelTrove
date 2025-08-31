import { Request, Response } from "express";
import { User, IUser } from "../models/user.model";
import JWTService from "../services/jwt.service";
import { 
  createAuthenticationError, 
  createValidationError, 
  createConflictError,
  ErrorCodes,
  sendErrorResponse,
  asyncHandler 
} from "../utils/errorHandler";
import { registerSchema, loginSchema } from "../schemas/auth";

/**
 * Register a new user
 */
export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input using Zod schema
    const validatedData = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email }).exec();
    if (existingUser) {
      const error = createConflictError("User with this email already exists");
      sendErrorResponse(res, error, req.path);
      return;
    }

    // Create new user
    const user = new User(validatedData);
    await user.save();

    // Generate JWT token
    const token = JWTService.generateToken(user);

    // Return success response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error: any) {
    // Handle Zod validation errors
    if (error.name === "ZodError") {
      const validationError = createValidationError(
        "Invalid input data",
        error.errors
      );
      sendErrorResponse(res, validationError, req.path);
      return;
    }

    // Handle other errors
    console.error("🔒 Registration error:", {
      error: error.message,
      stack: error.stack,
      email: req.body.email,
      timestamp: new Date().toISOString(),
    });

    const authError = createAuthenticationError(
      ErrorCodes.UNKNOWN_ERROR,
      "Registration failed. Please try again."
    );
    sendErrorResponse(res, authError, req.path);
  }
});

/**
 * Login user
 */
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input using Zod schema
    const validatedData = loginSchema.parse(req.body);

    // Find user by email
    const user = await User.findOne({ email: validatedData.email }).exec();
    if (!user) {
      const error = createAuthenticationError(
        ErrorCodes.INVALID_CREDENTIALS,
        "Invalid email or password"
      );
      sendErrorResponse(res, error, req.path);
      return;
    }

    // Verify password
    const isValidPassword = await user.comparePassword(validatedData.password);
    if (!isValidPassword) {
      const error = createAuthenticationError(
        ErrorCodes.INVALID_CREDENTIALS,
        "Invalid email or password"
      );
      sendErrorResponse(res, error, req.path);
      return;
    }

    // Generate JWT token
    const token = JWTService.generateToken(user);

    // Log successful login (for security monitoring)
    console.log("🔓 Successful login:", {
      userId: user._id,
      email: user.email,
      timestamp: new Date().toISOString(),
      userAgent: req.headers["user-agent"],
      ip: req.ip || req.connection.remoteAddress,
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error: any) {
    // Handle Zod validation errors
    if (error.name === "ZodError") {
      const validationError = createValidationError(
        "Invalid input data",
        error.errors
      );
      sendErrorResponse(res, validationError, req.path);
      return;
    }

    // Handle other errors
    console.error("🔒 Login error:", {
      error: error.message,
      stack: error.stack,
      email: req.body.email,
      timestamp: new Date().toISOString(),
    });

    const authError = createAuthenticationError(
      ErrorCodes.UNKNOWN_ERROR,
      "Login failed. Please try again."
    );
    sendErrorResponse(res, authError, req.path);
  }
});

/**
 * Get current user profile
 */
export const getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    // User is already authenticated by auth middleware
    const userId = (req as any).user?.id;
    
    if (!userId) {
      const error = createAuthenticationError(
        ErrorCodes.TOKEN_MISSING,
        "Authentication required"
      );
      sendErrorResponse(res, error, req.path);
      return;
    }

    // Get user from database
    const user = await User.findById(userId).select("-password").exec();
    if (!user) {
      const error = createAuthenticationError(
        ErrorCodes.USER_NOT_FOUND,
        "User not found"
      );
      sendErrorResponse(res, error, req.path);
      return;
    }

    // Return user profile
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error: any) {
    console.error("🔒 Get profile error:", {
      error: error.message,
      userId: (req as any).user?.id,
      timestamp: new Date().toISOString(),
    });

    const authError = createAuthenticationError(
      ErrorCodes.UNKNOWN_ERROR,
      "Failed to get user profile"
    );
    sendErrorResponse(res, authError, req.path);
  }
});

/**
 * Refresh JWT token
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    // Get current user from request (set by auth middleware)
    const userId = (req as any).user?.id;
    
    if (!userId) {
      const error = createAuthenticationError(
        ErrorCodes.TOKEN_MISSING,
        "Authentication required"
      );
      sendErrorResponse(res, error, req.path);
      return;
    }

    // Get user from database
    const user = await User.findById(userId).exec();
    if (!user) {
      const error = createAuthenticationError(
        ErrorCodes.USER_NOT_FOUND,
        "User not found"
      );
      sendErrorResponse(res, error, req.path);
      return;
    }

    // Generate new token
    const newToken = JWTService.generateToken(user);

    // Return new token
    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        token: newToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error: any) {
    console.error("🔒 Refresh token error:", {
      error: error.message,
      userId: (req as any).user?.id,
      timestamp: new Date().toISOString(),
    });

    const authError = createAuthenticationError(
      ErrorCodes.UNKNOWN_ERROR,
      "Failed to refresh token"
    );
    sendErrorResponse(res, authError, req.path);
  }
});

/**
 * Logout user (client-side token removal)
 */
export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    
    if (userId) {
      // Log logout event for security monitoring
      console.log("🔒 User logout:", {
        userId,
        timestamp: new Date().toISOString(),
        userAgent: req.headers["user-agent"],
        ip: req.ip || req.connection.remoteAddress,
      });
    }

    // Return success response (client should remove token)
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error: any) {
    console.error("🔒 Logout error:", {
      error: error.message,
      userId: (req as any).user?.id,
      timestamp: new Date().toISOString(),
    });

    const authError = createAuthenticationError(
      ErrorCodes.UNKNOWN_ERROR,
      "Logout failed"
    );
    sendErrorResponse(res, authError, req.path);
  }
});
