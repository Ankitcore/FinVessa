import { NextRequest, NextResponse } from "next/server";
import { getRequestSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createAccountSchema = z.object({
  name: z.string().min(2, "Account name is required"),
  type: z.enum(["CHECKING", "SAVINGS", "CREDIT_CARD", "INVESTMENT", "CASH"]),
  balanceCents: z.number().int().default(0),
  color: z.string().default("#8B5CF6"),
  currency: z.string().default("USD"),
});

export async function GET(req: NextRequest) {
  try {
    const session = getRequestSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accounts = await prisma.account.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "asc" },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error("Fetch accounts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getRequestSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createAccountSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const account = await prisma.account.create({
      data: {
        userId: session.id,
        name: data.name.trim(),
        type: data.type,
        balanceCents: data.balanceCents,
        color: data.color,
        currency: data.currency,
      },
    });

    // If initial balance is not zero, create initial balance transaction
    if (data.balanceCents > 0) {
      await prisma.transaction.create({
        data: {
          userId: session.id,
          accountId: account.id,
          type: "INCOME",
          amountCents: data.balanceCents,
          description: "Initial Account Deposit",
          status: "COMPLETED",
        },
      });
    }

    return NextResponse.json({ success: true, account });
  } catch (error) {
    console.error("Create account error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
