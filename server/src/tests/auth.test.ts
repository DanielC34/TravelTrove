import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { register, login } from "../controllers/auth.controller";
import { User } from "../models/user.model";
import mongoose from "mongoose";

describe("Auth Controller", () => {
  const mockRequest = {
    body: {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    },
  };

  const mockResponse = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  beforeAll(async () => {
    // Clear users collection before tests
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Clean up after tests
    await User.deleteMany({});
  });

  describe("Registration", () => {
    it("should register a new user successfully", async () => {
      await register(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String),
          token: expect.any(String),
          user: expect.objectContaining({
            email: mockRequest.body.email,
            name: mockRequest.body.name,
          }),
        })
      );
    });

    it("should not register a user with existing email", async () => {
      // First registration
      await register(mockRequest as any, mockResponse as any);
      // Reset mocks
      vi.clearAllMocks();
      // Try to register again
      await register(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String),
        })
      );
    });
  });

  describe("Login", () => {
    it("should login successfully with correct credentials", async () => {
      // First register a user
      await register(mockRequest as any, mockResponse as any);
      // Reset mocks
      vi.clearAllMocks();
      // Try to login
      await login(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String),
          token: expect.any(String),
          user: expect.objectContaining({
            email: mockRequest.body.email,
            name: mockRequest.body.name,
          }),
        })
      );
    });

    it("should not login with incorrect password", async () => {
      const invalidRequest = {
        ...mockRequest,
        body: {
          ...mockRequest.body,
          password: "wrongpassword",
        },
      };

      await login(invalidRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String),
        })
      );
    });

    it("should not login with non-existent email", async () => {
      const invalidRequest = {
        ...mockRequest,
        body: {
          ...mockRequest.body,
          email: "nonexistent@example.com",
        },
      };

      await login(invalidRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String),
        })
      );
    });
  });
});
