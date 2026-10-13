import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;
    const lowerEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: lowerEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Create user and initial defaults
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: lowerEmail,
        passwordHash,
        currency: "USD",
        accounts: {
          create: [
            {
              name: "Primary Checking",
              type: "CHECKING",
              balanceCents: 500000, // $5,000 starter demo balance
              color: "#8B5CF6",
            },
            {
              name: "Emergency Savings",
              type: "SAVINGS",
              balanceCents: 1000000, // $10,000 starter demo balance
              color: "#06B6D4",
            },
          ],
        },
        categories: {
          create: [
            { name: "Salary & Wages", type: "INCOME", icon: "Briefcase", color: "#10B981" },
            { name: "Freelance", type: "INCOME", icon: "Laptop", color: "#06B6D4" },
            { name: "Rent & Housing", type: "EXPENSE", icon: "Home", color: "#F43F5E" },
            { name: "Groceries", type: "EXPENSE", icon: "ShoppingCart", color: "#F59E0B" },
            { name: "Dining & Food", type: "EXPENSE", icon: "Utensils", color: "#EC4899" },
            { name: "Tech & Software", type: "EXPENSE", icon: "Cpu", color: "#8B5CF6" },
            { name: "Utilities", type: "EXPENSE", icon: "Zap", color: "#06B6D4" },
            { name: "Entertainment", type: "EXPENSE", icon: "Film", color: "#A855F7" },
          ],
        },
      },
      include: {
        accounts: true,
      },
    });

    // Create default virtual card for new user
    const checking = newUser.accounts.find((a) => a.type === "CHECKING");
    await prisma.virtualCard.create({
      data: {
        userId: newUser.id,
        accountId: checking ? checking.id : null,
        cardholderName: newUser.name.toUpperCase(),
        cardNumberMasked: "•••• •••• •••• 5120",
        fullNumber: "4242 5100 8820 5120",
        cardExpiry: "09/30",
        cardCvv: "891",
        cardType: "VISA",
        cardStyle: "PURPLE_CYAN",
        spendingLimitCents: 500000,
      },
    });

    const sessionUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      currency: newUser.currency,
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
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Unable to create account. Please try again." },
      { status: 500 }
    );
  }
}
