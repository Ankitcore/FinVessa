import { NextRequest, NextResponse } from "next/server";
import { getRequestSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = getRequestSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const monthsBack = parseInt(searchParams.get("months") || "6");

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1), 1);

    const [transactions, accounts, categories] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          userId: session.id,
          status: "COMPLETED",
          date: { gte: startDate },
        },
        include: {
          category: true,
          account: true,
        },
        orderBy: { date: "asc" },
      }),
      prisma.account.findMany({
        where: { userId: session.id, isArchived: false },
      }),
      prisma.category.findMany({
        where: {
          OR: [{ userId: session.id }, { userId: null }],
        },
      }),
    ]);

    // Monthly breakdown data
    const monthBuckets: Record<
      string,
      { month: string; income: number; expense: number; net: number; savingsRate: number }
    > = {};

    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
      monthBuckets[key] = {
        month: key,
        income: 0,
        expense: 0,
        net: 0,
        savingsRate: 0,
      };
    }

    // Category breakdown
    const categoryTotals: Record<string, { name: string; color: string; amountCents: number; count: number }> = {};

    let totalIncomeCents = 0;
    let totalExpenseCents = 0;

    for (const tx of transactions) {
      const txDate = new Date(tx.date);
      const monthKey = txDate.toLocaleString("en-US", { month: "short", year: "2-digit" });

      if (tx.type === "INCOME") {
        totalIncomeCents += tx.amountCents;
        if (monthBuckets[monthKey]) {
          monthBuckets[monthKey].income += Math.round(tx.amountCents / 100);
        }
      } else if (tx.type === "EXPENSE") {
        totalExpenseCents += tx.amountCents;
        if (monthBuckets[monthKey]) {
          monthBuckets[monthKey].expense += Math.round(tx.amountCents / 100);
        }

        const catName = tx.category?.name || "Other";
        const catColor = tx.category?.color || "#0284C7";
        if (!categoryTotals[catName]) {
          categoryTotals[catName] = { name: catName, color: catColor, amountCents: 0, count: 0 };
        }
        categoryTotals[catName].amountCents += tx.amountCents;
        categoryTotals[catName].count += 1;
      }
    }

    // Compute net and savings rate for each month
    for (const key of Object.keys(monthBuckets)) {
      const bucket = monthBuckets[key];
      bucket.net = bucket.income - bucket.expense;
      bucket.savingsRate =
        bucket.income > 0
          ? Math.max(0, Math.min(100, Math.round(((bucket.income - bucket.expense) / bucket.income) * 100)))
          : 0;
    }

    const monthlyTrends = Object.values(monthBuckets);

    // Sorted categories by spend
    const spendingByCategory = Object.values(categoryTotals)
      .map((cat) => ({
        ...cat,
        percentage:
          totalExpenseCents > 0
            ? Math.round((cat.amountCents / totalExpenseCents) * 1000) / 10
            : 0,
      }))
      .sort((a, b) => b.amountCents - a.amountCents);

    // Account distribution
    const totalAssetsCents = accounts
      .filter((a) => a.type !== "CREDIT_CARD")
      .reduce((sum, a) => sum + a.balanceCents, 0);

    const accountDistribution = accounts.map((acc) => ({
      name: acc.name,
      type: acc.type,
      color: acc.color,
      balanceCents: acc.balanceCents,
      percentage:
        totalAssetsCents > 0 && acc.type !== "CREDIT_CARD"
          ? Math.round((acc.balanceCents / totalAssetsCents) * 1000) / 10
          : 0,
    }));

    return NextResponse.json({
      monthlyTrends,
      spendingByCategory,
      accountDistribution,
      summary: {
        totalIncomeCents,
        totalExpenseCents,
        netCashFlowCents: totalIncomeCents - totalExpenseCents,
        overallSavingsRate:
          totalIncomeCents > 0
            ? Math.max(
                0,
                Math.min(
                  100,
                  Math.round(
                    ((totalIncomeCents - totalExpenseCents) / totalIncomeCents) * 100
                  )
                )
              )
            : 0,
      },
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to generate analytics" },
      { status: 500 }
    );
  }
}
