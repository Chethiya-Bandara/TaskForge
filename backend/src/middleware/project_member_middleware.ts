import { Response, NextFunction } from "express";
import prisma from "../prisma/client.js";
import { AuthRequest } from "../types/auth";

export const checkProjectOwner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params.id as string;

    const isOwner = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId: req.user!.userId,
        role: "owner",
      },
    });

    if (!isOwner) {
      return res.status(403).json({
        message: "Only project owners can perform this action",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Authorization check failed",
    });
  }
};

export const checkProjectMember = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params.id as string;

    const isMember = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId: req.user!.userId,
      },
    });

    if (!isMember) {
      return res.status(403).json({ message: "Only project members can view other members" });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Authorization check failed",
    });
  }
};