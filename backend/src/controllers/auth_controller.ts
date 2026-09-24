import type { Request, Response } from "express";
import prisma from "../prisma/client.js";
import bcrypt from "bcryptjs";
import { registerSchema, loginSchema, updateProfileSchema } from "../validators/auth_validator.js";
import type { AuthRequest } from "../middleware/auth_middleware.js";
import { createAccessToken, createSession, refreshCookieOptions, revokeAllUserSessions, revokeSession, rotateSession } from "../services/session_service.js";

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User created",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      data.password,
      user.passwordHash
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const { session, refreshToken } = await createSession(user.id);
    const token = createAccessToken(user, session.id);

    res.cookie("refresh_token", refreshToken, refreshCookieOptions).json({ token });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
    });
  }
};

const getCookie = (cookieHeader: string | undefined, name: string) =>
  cookieHeader?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);

export const refresh = async (req: Request, res: Response) => {
  const rawToken = getCookie(req.headers.cookie, "refresh_token");
  if (!rawToken) return res.status(401).json({ message: "No refresh token provided" });

  try {
    const replacement = await rotateSession(rawToken);
    if (!replacement) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const token = createAccessToken(replacement.user, replacement.session.id);
    res.cookie("refresh_token", replacement.refreshToken, refreshCookieOptions).json({ token });
  } catch {
    res.status(401).json({ message: "Unable to refresh session" });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  await revokeSession(req.user!.sid);
  res.clearCookie("refresh_token", refreshCookieOptions).sendStatus(204);
};

export const logoutAll = async (req: AuthRequest, res: Response) => {
  await revokeAllUserSessions(req.user!.userId);
  res.clearCookie("refresh_token", refreshCookieOptions).sendStatus(204);
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, name: true, email: true },
  });

  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const data = updateProfileSchema.parse(req.body);
    const existingUser = await prisma.user.findFirst({
    where: { email: data.email, NOT: { id: req.user!.userId } },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data,
      select: { id: true, name: true, email: true },
    });
    // An email change is security-sensitive; require a fresh login on every device.
    if (data.email !== req.user!.email) {
      await revokeAllUserSessions(req.user!.userId);
      res.clearCookie("refresh_token", refreshCookieOptions);
    }
    res.json(user);
  } catch {
    res.status(400).json({ message: "Unable to update profile" });
  }
};
