import { Request, Response, NextFunction } from "express";
import { ADMIN_API_KEY } from "../config/envConfig";
import DBconfig from "../config/dbConfig";
import ErrorHandler from "../utils/ErrorHandler";
import { jwtVerify } from "../utils/jwtUtils";

const prisma = DBconfig.getInstance();

interface JwtPayload {
  userId: number;
  role: string;
}

export const userAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new ErrorHandler("Authorization header is missing", 401));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new ErrorHandler("Bearer token is missing", 401));
  }

  try {
    const decoded = jwtVerify(token) as JwtPayload;

    if (decoded.role !== "USER") {
      return next(new ErrorHandler("Access denied", 403));
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return next(new ErrorHandler("Unauthorized", 404));
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    next(new ErrorHandler("Invalid token", 401));
  }
};

export const adminAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const apiKey = req.headers["x-api-key"];

  if (!authHeader) {
    return next(new ErrorHandler("Authorization header is missing", 401));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new ErrorHandler("Bearer token is missing", 401));
  }

  if (!apiKey || apiKey !== ADMIN_API_KEY) {
    return next(new ErrorHandler("Invalid API key", 403));
  }

  try {
    const decoded = jwtVerify(token) as JwtPayload;

    if (decoded.role !== "ADMIN") {
      return next(new ErrorHandler("Access denied", 403));
    }

    const admin = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!admin) {
      return next(new ErrorHandler("Admin not found", 404));
    }

    req.user = admin;

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    next(new ErrorHandler("Invalid token", 401));
  }
};
