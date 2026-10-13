import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "finvessa-secure-jwt-secret-key-32-chars-long-2026";
export const AUTH_COOKIE_NAME = "finvessa_session";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  currency: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(user: SessionUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      currency: user.currency,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): SessionUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as SessionUser;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Server-side session extraction for Server Components & Actions
 */
export async function getServerSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

/**
 * Route handler session extraction from NextRequest
 */
export function getRequestSession(req: NextRequest): SessionUser | null {
  try {
    // Check cookie first
    const tokenCookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (tokenCookie) {
      const user = verifyToken(tokenCookie);
      if (user) return user;
    }

    // Check authorization header
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      return verifyToken(token);
    }

    return null;
  } catch {
    return null;
  }
}
