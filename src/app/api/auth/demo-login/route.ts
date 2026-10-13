import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  try {
    const demoUser = await prisma.user.findUnique({
      where: { email: "demo@novafinance.com" },
    });

    if (!demoUser) {
      return NextResponse.json(
        { error: "Demo user not found. Please run seed script first." },
        { status: 404 }
      );
    }

    const sessionUser = {
      id: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
      currency: demoUser.currency,
    };

    const token = signToken(sessionUser);

    const response = NextResponse.json({
      success: true,
      user: sessionUser,
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Demo login error:", error);
    return NextResponse.json(
      { error: "Failed to login demo user" },
      { status: 500 }
    );
  }
}
