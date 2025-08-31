import { Request, Response, NextFunction } from "express";
import { User, IUser } from "../models/user.model";
import JWTService from "../services/jwt.service";
import { 
  createAuthenticationError, 
  createNotFoundError, 
  ErrorCodes,
  sendErrorResponse 
} from "../utils/errorHandler";

// Extend Express Request interface with user property
interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Authentication middleware - validates JWT token and sets user context
 */
export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.header("Authorization");
    const token = JWTService.extractTokenFromHeader(authHeader);

    if (!token) {
      const error = createAuthenticationError(
        ErrorCodes.TOKEN_MISSING,
        "Authentication token is required"
      );
      sendErrorResponse(res, error, req.path);
      return;
    }

    // Verify and decode the token
    let payload;
    try {
      payload = JWTService.verifyToken(token);
    } catch (jwtError: any) {
      let errorCode: string = ErrorCodes.TOKEN_INVALID;
      let message = "Invalid authentication token";

      if (jwtError.message === "Token expired") {
        errorCode = ErrorCodes.TOKEN_EXPIRED;
        message = "Authentication token has expired";
      }

      const error = createAuthenticationError(errorCode, message);
      sendErrorResponse(res, error, req.path);
      return;
    }

    // Find user in database
    const user = await User.findById(payload.userId).exec();
    if (!user) {
      const error = createNotFoundError("User");
      sendErrorResponse(res, error, req.path);
      return;
    }

    // Set user context in request
    req.user = {
      id: (user._id as any).toString(),
      name: user.name,
      email: user.email,
    };

    // Add user info to response headers for debugging (remove in production)
    if (process.env.NODE_ENV === "development") {
      res.setHeader("X-User-ID", (user._id as any).toString());
      res.setHeader("X-User-Email", user.email);
    }

    next();
  } catch (error: any) {
    console.error("🔒 Authentication middleware error:", {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      userAgent: req.headers["user-agent"],
      ip: req.ip || req.connection.remoteAddress,
      timestamp: new Date().toISOString(),
    });

    const authError = createAuthenticationError(
      ErrorCodes.TOKEN_INVALID,
      "Authentication failed"
    );
    sendErrorResponse(res, authError, req.path);
  }
};

/**
 * Optional authentication middleware - sets user context if token is valid
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header("Authorization");
    const token = JWTService.extractTokenFromHeader(authHeader);

    if (!token) {
      // No token provided, continue without authentication
      next();
      return;
    }

    // Try to verify token
    try {
      const payload = JWTService.verifyToken(token);
      const user = await User.findById(payload.userId).exec();
      
      if (user) {
        req.user = {
          id: (user._id as any).toString(),
          name: user.name,
          email: user.email,
        };
      }
    } catch (jwtError) {
      // Token is invalid, but we continue without authentication
      console.warn("⚠️ Optional auth: Invalid token provided", {
        error: jwtError instanceof Error ? jwtError.message : "Unknown error",
        url: req.url,
        timestamp: new Date().toISOString(),
      });
    }

    next();
  } catch (error: any) {
    console.error("🔒 Optional authentication middleware error:", error);
    // Continue without authentication on error
    next();
  }
};

/**
 * Resource ownership check middleware
 */
export const checkOwnership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      const error = createAuthenticationError(
        ErrorCodes.TOKEN_MISSING,
        "Authentication required"
      );
      sendErrorResponse(res, error, req.path);
      return;
    }

    const resourceUserId = req.params.userId || req.body.userId;
    
    if (!resourceUserId) {
      const error = createAuthenticationError(
        ErrorCodes.INVALID_INPUT,
        "Resource user ID is required"
      );
      sendErrorResponse(res, error, req.path);
      return;
    }

    // Check if user owns the resource
    if (req.user.id !== resourceUserId.toString()) {
      const error = createAuthenticationError(
        ErrorCodes.INSUFFICIENT_PERMISSIONS,
        "Access denied: You can only access your own resources"
      );
      sendErrorResponse(res, error, req.path);
      return;
    }

    next();
  } catch (error: any) {
    console.error("🔒 Ownership check error:", {
      error: error.message,
      url: req.url,
      userId: req.user?.id,
      timestamp: new Date().toISOString(),
    });

    const authError = createAuthenticationError(
      ErrorCodes.INSUFFICIENT_PERMISSIONS,
      "Access denied"
    );
    sendErrorResponse(res, authError, req.path);
  }
};

/**
 * Role-based access control middleware
 */
export const requireRole = (allowedRoles: string[]) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        const error = createAuthenticationError(
          ErrorCodes.TOKEN_MISSING,
          "Authentication required"
        );
        sendErrorResponse(res, error, req.path);
        return;
      }

      // Get user with roles from database
      const user = await User.findById(req.user.id).exec();
      if (!user) {
        const error = createNotFoundError("User");
        sendErrorResponse(res, error, req.path);
        return;
      }

      // Check if user has required role (assuming user has a role field)
      // You can extend the User model to include roles if needed
      const userRole = (user as any).role || "user"; // Default to "user" role
      
      if (!allowedRoles.includes(userRole)) {
        const error = createAuthenticationError(
          ErrorCodes.INSUFFICIENT_PERMISSIONS,
          `Access denied: Requires one of [${allowedRoles.join(", ")}] roles`
        );
        sendErrorResponse(res, error, req.path);
        return;
      }

      next();
    } catch (error: any) {
      console.error("🔒 Role check error:", {
        error: error.message,
        url: req.url,
        userId: req.user?.id,
        allowedRoles,
        timestamp: new Date().toISOString(),
      });

      const authError = createAuthenticationError(
        ErrorCodes.INSUFFICIENT_PERMISSIONS,
        "Access denied"
      );
      sendErrorResponse(res, authError, req.path);
    }
  };
};

/**
 * Rate limiting middleware (basic implementation)
 */
export const rateLimit = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) => {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.connection.remoteAddress || "unknown";
    const now = Date.now();
    
    const userRequests = requests.get(ip);
    
    if (!userRequests || now > userRequests.resetTime) {
      // First request or window expired
      requests.set(ip, { count: 1, resetTime: now + windowMs });
      next();
    } else if (userRequests.count < maxRequests) {
      // Within limit
      userRequests.count++;
      next();
    } else {
      // Rate limit exceeded
      res.status(429).json({
        success: false,
        error: {
          type: "RATE_LIMIT_ERROR",
          message: "Too many requests, please try again later",
          code: "RATE_001",
          timestamp: new Date().toISOString(),
          path: req.path,
        },
      });
    }
  };
};
