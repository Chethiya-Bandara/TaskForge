import { createHash, randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL_DAYS = 30;

const jwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET must be configured");
  return secret;
};

export const hashRefreshToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

const createRefreshToken = () => randomBytes(48).toString("base64url");

export const createSession = async (userId: string) => {
  const refreshToken = createRefreshToken();
  const session = await prisma.session.create({
    data: {
      userId,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
    },
  });
  return { session, refreshToken };
};

export const createAccessToken = (user: { id: string; email: string; name: string }, sessionId: string) =>
  jwt.sign({ userId: user.id, email: user.email, name: user.name, sid: sessionId }, jwtSecret(), {
    expiresIn: ACCESS_TOKEN_TTL,
  });

export const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/auth",
  maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
};

export const revokeSession = (sessionId: string) =>
  prisma.session.updateMany({ where: { id: sessionId, revokedAt: null }, data: { revokedAt: new Date() } });

export const revokeAllUserSessions = (userId: string) =>
  prisma.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });

export const rotateSession = async (rawToken: string) => {
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashRefreshToken(rawToken) },
    select: {
      id: true,
      userId: true,
      expiresAt: true,
      revokedAt: true,
      user: { select: { id: true, email: true, name: true } },
    },
  });

  if (!session || session.expiresAt <= new Date()) return null;

  // A used refresh token is a compromise signal. Invalidate every device session.
  if (session.revokedAt) {
    await revokeAllUserSessions(session.userId);
    return null;
  }

  // Conditionally revoke so two simultaneous refresh attempts cannot both succeed.
  const revoked = await revokeSession(session.id);
  if (revoked.count !== 1) {
    await revokeAllUserSessions(session.userId);
    return null;
  }

  const replacement = await createSession(session.userId);
  return { user: session.user, ...replacement };
};
