import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    // Define a more specific user type
    interface User extends JwtPayload {
      id: string;
      email?: string;
      name?: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
