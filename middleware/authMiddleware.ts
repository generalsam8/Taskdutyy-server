import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../model/userModel";
import { AuthRequest } from "../types/AuthRequest";

interface DecodedToken extends JwtPayload {
  id: string;
}

const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Not authorized, no token",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, secret) as DecodedToken;

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({
        message: "User not found",
      });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Token failed",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export default protect;