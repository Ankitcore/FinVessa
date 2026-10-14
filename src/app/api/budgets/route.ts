import { NextRequest, NextResponse } from "next/server";
import { getRequestSession, getRequestSessionOrDemo } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateBudgetUtilization } from "@/lib/financial";
import { z } from "zod";

const createBudgetSchema = z.object({
  name: z.string().min(2, "Budget name is required"),
  limitCents: z.number().int().positive("Limit must be greater than zero"),
  categoryId: z.string().nullable().optional(),
  period: z.string().default("MONTHLY"),
});

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getRequestSessionOrDemo(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [budgets, monthlyExpenses] = await Promise.all([
      prisma.budget.findMany({
        where: { userId: session.id },
        include: { category: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.transaction.findMany({
        where: {
          userId: session.id,
          type: "EXPENSE",
          status: "COMPLETED",
          date: { gte: startOfMonth },
        },
      }),
    ]);

    const budgetsWithProgress = budgets.map((b) => {
      const util = calculateBudgetUtilization(b, monthlyExpenses);
      return {
        ...b,
        spentCents: util.spentCents,
        remainingCents: util.remainingCents,
        percentageUsed: util.percentageUsed,
        isExceeded: util.isExceeded,
      };
    });

    const totalBudgetLimitCents = budgets.reduce((sum, b) => sum + b.limitCents, 0);
    const totalSpentCents = budgetsWithProgress.reduce((sum, b) => sum + b.spentCents, 0);

    return NextResponse.json({
      budgets: budgetsWithProgress,
      summary: {
        totalBudgetLimitCents,
        totalSpentCents,
        totalRemainingCents: totalBudgetLimitCents - totalSpentCents,
        percentageUsed:
          totalBudgetLimitCents > 0
            ? Math.round((totalSpentCents / totalBudgetLimitCents) * 1000) / 10
            : 0,
      },
    });
  } catch (error) {
    console.error("Fetch budgets error:", error);
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
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
    const parsed = createBudgetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const budget = await prisma.budget.create({
      data: {
        userId: session.id,
        name: data.name,
        limitCents: data.limitCents,
        categoryId: data.categoryId || null,
        period: data.period,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, budget });
  } catch (error) {
    console.error("Create budget error:", error);
    return NextResponse.json(
      { error: "Failed to create budget" },
      { status: 500 }
    );
  }
}
