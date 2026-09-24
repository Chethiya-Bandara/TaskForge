import type { Request, Response } from "express";
import type { NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

export interface AuthRequest extends Request {
  user?: { userId: string; email: string; name?: string; sid: string };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Invalid authorization header",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId?: string; email?: string; name?: string; sid?: string };

    if (!decoded.userId || !decoded.email || !decoded.sid) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const session = await prisma.session.findFirst({
      where: {
        id: decoded.sid,
        userId: decoded.userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!session) {
      return res.status(401).json({ message: "Session is no longer active" });
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      ...(decoded.name ? { name: decoded.name } : {}),
      sid: decoded.sid,
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
