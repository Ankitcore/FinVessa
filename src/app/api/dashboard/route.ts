import { NextRequest, NextResponse } from "next/server";
import { getRequestSessionOrDemo } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateFinancialMetrics } from "@/lib/financial";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getRequestSessionOrDemo(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const accountFilter = searchParams.get("accountId") || "all";
    const rangeFilter = searchParams.get("range") || "month"; // "month", "last30", "year", "all"

    // Calculate date filter boundaries
    const now = new Date();
    let startDate: Date | undefined;
    const endDate: Date = now;

    if (rangeFilter === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (rangeFilter === "last30") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
    } else if (rangeFilter === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    // Build Prisma where conditions
    const txWhere: Record<string, unknown> = {
      userId: session.id,
    };

    if (accountFilter !== "all") {
      txWhere.OR = [
        { accountId: accountFilter },
        { transferAccountId: accountFilter },
      ];
    }

    // Fetch user accounts
    const accounts = await prisma.account.findMany({
      where: { userId: session.id, isArchived: false },
      orderBy: { createdAt: "asc" },
    });

    const totalBalanceCents = accounts.reduce((acc, a) => {
      // Credit card balances are liabilities (subtract) or separate
      if (a.type === "CREDIT_CARD") {
        return acc - a.balanceCents;
      }
      return acc + a.balanceCents;
    }, 0);

    // Fetch all user transactions for calculations
    const allTransactions = await prisma.transaction.findMany({
      where: txWhere,
      orderBy: { date: "desc" },
      include: {
        category: true,
        account: true,
      },
    });

    // Fetch user bills
    const bills = await prisma.bill.findMany({
      where: { userId: session.id },
      orderBy: { dueDate: "asc" },
      include: { account: true },
    });

    // Authoritative financial metrics
    const metrics = calculateFinancialMetrics(
      allTransactions,
      totalBalanceCents,
      bills,
      startDate,
      endDate
    );

    // Monthly chart data (last 6 months)
    const monthlyDataMap: Record<string, { month: string; income: number; expense: number }> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString("en-US", { month: "short" });
      monthlyDataMap[key] = {
        month: key,
        income: 0,
        expense: 0,
      };
    }

    for (const tx of allTransactions) {
      if (tx.status !== "COMPLETED") continue;
      const txDate = new Date(tx.date);
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      if (txDate >= sixMonthsAgo && txDate <= now) {
        const key = txDate.toLocaleString("en-US", { month: "short" });
        if (monthlyDataMap[key]) {
          if (tx.type === "INCOME") {
            monthlyDataMap[key].income += Math.round(tx.amountCents / 100);
          } else if (tx.type === "EXPENSE") {
            monthlyDataMap[key].expense += Math.round(tx.amountCents / 100);
          }
        }
      }
    }
    const chartData = Object.values(monthlyDataMap);

    // Category spending breakdown (for donut / breakdown list) within active date range
    const categoryMap: Record<string, { name: string; color: string; amountCents: number; amount: number }> = {};
    for (const tx of allTransactions) {
      if (tx.type === "EXPENSE" && tx.status === "COMPLETED") {
        const txDate = new Date(tx.date);
        if (startDate && txDate < startDate) continue;
        if (endDate && txDate > endDate) continue;

        const catName = tx.category?.name || "General";
        const catColor = tx.category?.color || "#0284C7";
        if (!categoryMap[catName]) {
          categoryMap[catName] = { name: catName, color: catColor, amountCents: 0, amount: 0 };
        }
        categoryMap[catName].amountCents += tx.amountCents;
        categoryMap[catName].amount += tx.amountCents;
      }
    }

    const categoryBreakdown = Object.values(categoryMap)
      .sort((a, b) => b.amountCents - a.amountCents)
      .slice(0, 6);

    // Recent transactions (latest 6)
    const recentTransactions = allTransactions.slice(0, 6);

    // Upcoming payments (unpaid, due in future or today)
    const upcomingPayments = bills
      .filter((b) => b.status === "UNPAID")
      .slice(0, 4);

    // Primary Virtual Card
    const virtualCard = await prisma.virtualCard.findFirst({
      where: { userId: session.id },
      include: { account: true },
    });

    return NextResponse.json({
      metrics,
      accounts,
      chartData,
      categoryBreakdown,
      recentTransactions,
      upcomingPayments,
      virtualCard,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
