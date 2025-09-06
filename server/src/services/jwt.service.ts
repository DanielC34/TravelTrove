import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";
import { Document } from "mongoose";

// JWT payload interface
export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

// Validate JWT secret on startup
if (!JWT_SECRET || JWT_SECRET === "your-secret-key") {
  console.error("❌ CRITICAL: JWT_SECRET is not properly configured!");
  console.error("   Please set a strong JWT_SECRET in your .env file");
  console.error("   Example: JWT_SECRET=your-super-secure-secret-key-here");
  process.exit(1);
}

export class JWTService {
  /**
   * Generate JWT token for user
   */
  static generateToken(user: IUser & Document): string {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const payload: JWTPayload = {
      userId: (user._id as any).toString(),
      email: user.email,
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: "travel-trove-api",
      audience: "travel-trove-client",
    } as jwt.SignOptions);
  }

  /**
   * Generate refresh token for user
   */
  static generateRefreshToken(user: IUser & Document): string {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const payload: JWTPayload = {
      userId: (user._id as any).toString(),
      email: user.email,
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: "travel-trove-api",
      audience: "travel-trove-client",
    } as jwt.SignOptions);
  }

  /**
   * Verify and decode JWT token
   */
  static verifyToken(token: string): JWTPayload {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: "travel-trove-api",
        audience: "travel-trove-client",
      }) as JWTPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Token expired");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid token");
      } else if (error instanceof jwt.NotBeforeError) {
        throw new Error("Token not active");
      } else {
        throw new Error("Token verification failed");
      }
    }
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(" ");
    
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return null;
    }

    return parts[1];
  }

  /**
   * Get token expiration time
   */
  static getTokenExpiration(token: string): Date | null {
    try {
      const decoded = jwt.decode(token) as JWTPayload;
      if (decoded && decoded.exp) {
        return new Date(decoded.exp * 1000);
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) {
      return true;
    }
    return expiration < new Date();
  }
}

// Export default instance
export default JWTService;
