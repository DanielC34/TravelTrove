import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/user.model";

interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as { _id: string };
    
    const user = await User.findOne({ _id: decoded._id }).exec();

    if (!user) {
      throw new Error();
    }

    // Set user with the correct structure - properly type the user object
    req.user = {
      id: (user as any)._id.toString(),
      name: user.name,
      email: user.email,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate." });
  }
};

export const checkOwnership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId || req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (req.user?.id !== userId.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
