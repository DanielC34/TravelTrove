import { Response } from "express";

// Error types for different scenarios
export enum ErrorType {
  VALIDATION = "VALIDATION_ERROR",
  AUTHENTICATION = "AUTHENTICATION_ERROR",
  AUTHORIZATION = "AUTHORIZATION_ERROR",
  NOT_FOUND = "NOT_FOUND_ERROR",
  CONFLICT = "CONFLICT_ERROR",
  INTERNAL = "INTERNAL_SERVER_ERROR",
  EXTERNAL = "EXTERNAL_SERVICE_ERROR",
}

// Standard error response interface
export interface ErrorResponse {
  success: false;
  error: {
    type: ErrorType;
    message: string;
    code: string;
    details?: any;
    timestamp: string;
    path?: string;
  };
}

// HTTP status codes mapping
const STATUS_CODES = {
  [ErrorType.VALIDATION]: 400,
  [ErrorType.AUTHENTICATION]: 401,
  [ErrorType.AUTHORIZATION]: 403,
  [ErrorType.NOT_FOUND]: 404,
  [ErrorType.CONFLICT]: 409,
  [ErrorType.INTERNAL]: 500,
  [ErrorType.EXTERNAL]: 502,
} as const;

// Error codes for specific scenarios
export const ErrorCodes = {
  // Authentication errors
  TOKEN_MISSING: "AUTH_001",
  TOKEN_INVALID: "AUTH_002",
  TOKEN_EXPIRED: "AUTH_003",
  INVALID_CREDENTIALS: "AUTH_004",
  USER_NOT_FOUND: "AUTH_005",
  
  // Authorization errors
  INSUFFICIENT_PERMISSIONS: "AUTHZ_001",
  RESOURCE_ACCESS_DENIED: "AUTHZ_002",
  
  // Validation errors
  INVALID_INPUT: "VAL_001",
  MISSING_REQUIRED_FIELD: "VAL_002",
  INVALID_FORMAT: "VAL_003",
  
  // Resource errors
  RESOURCE_NOT_FOUND: "RES_001",
  RESOURCE_ALREADY_EXISTS: "RES_002",
  
  // Server errors
  DATABASE_ERROR: "SRV_001",
  EXTERNAL_API_ERROR: "SRV_002",
  UNKNOWN_ERROR: "SRV_003",
} as const;

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: any;
  public readonly isOperational: boolean;

  constructor(
    type: ErrorType,
    message: string,
    code: string,
    details?: any,
    isOperational: boolean = true
  ) {
    super(message);
    this.type = type;
    this.code = code;
    this.statusCode = STATUS_CODES[type];
    this.details = details;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

// Security logging function
const logSecurityEvent = (event: string, details: any) => {
  const timestamp = new Date().toISOString();
  console.error(`🔒 SECURITY EVENT [${timestamp}]: ${event}`, {
    ...details,
    timestamp,
  });
};

// Standard error response function
export const sendErrorResponse = (
  res: Response,
  error: AppError | Error,
  path?: string
): void => {
  let appError: AppError;

  // Convert regular Error to AppError if needed
  if (error instanceof AppError) {
    appError = error;
  } else {
    appError = new AppError(
      ErrorType.INTERNAL,
      error.message || "Internal server error",
      ErrorCodes.UNKNOWN_ERROR,
      undefined,
      false
    );
  }

  // Log security events
  if (appError.type === ErrorType.AUTHENTICATION || appError.type === ErrorType.AUTHORIZATION) {
    logSecurityEvent("Authentication/Authorization Error", {
      type: appError.type,
      code: appError.code,
      message: appError.message,
      path,
      userAgent: res.req.headers["user-agent"],
      ip: res.req.ip || res.req.connection.remoteAddress,
    });
  }

  // Create standardized error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      type: appError.type,
      message: appError.message,
      code: appError.code,
      details: appError.details,
      timestamp: new Date().toISOString(),
      path,
    },
  };

  // Send response
  res.status(appError.statusCode).json(errorResponse);
};

// Convenience functions for common errors
export const createValidationError = (message: string, details?: any): AppError => {
  return new AppError(ErrorType.VALIDATION, message, ErrorCodes.INVALID_INPUT, details);
};

export const createAuthenticationError = (code: string, message: string): AppError => {
  return new AppError(ErrorType.AUTHENTICATION, message, code);
};

export const createAuthorizationError = (message: string): AppError => {
  return new AppError(ErrorType.AUTHORIZATION, message, ErrorCodes.INSUFFICIENT_PERMISSIONS);
};

export const createNotFoundError = (resource: string): AppError => {
  return new AppError(ErrorType.NOT_FOUND, `${resource} not found`, ErrorCodes.RESOURCE_NOT_FOUND);
};

export const createConflictError = (message: string): AppError => {
  return new AppError(ErrorType.CONFLICT, message, ErrorCodes.RESOURCE_ALREADY_EXISTS);
};

// Async error handler wrapper
export const asyncHandler = (fn: Function) => {
  return (req: any, res: Response, next?: any) => {
    Promise.resolve(fn(req, res, next)).catch((error: any) => {
      if (next) {
        next(error);
      } else {
        console.error("Unhandled async error:", error);
        sendErrorResponse(res, error, req.path);
      }
    });
  };
};

// Global error handler middleware
export const globalErrorHandler = (
  error: Error,
  req: any,
  res: Response,
  next: any
): void => {
  // Log all errors
  console.error("🚨 Unhandled Error:", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userAgent: req.headers["user-agent"],
    ip: req.ip || req.connection.remoteAddress,
    timestamp: new Date().toISOString(),
  });

  // Send error response
  sendErrorResponse(res, error, req.path);
};

// Validation error formatter
export const formatValidationErrors = (errors: any[]): any => {
  return errors.reduce((acc: any, error: any) => {
    const field = error.path?.join(".") || "unknown";
    acc[field] = error.message;
    return acc;
  }, {});
};
