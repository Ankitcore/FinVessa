import { NextRequest, NextResponse } from "next/server";
import { getRequestSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = getRequestSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user, accounts, transactions, budgets, bills, cards] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.id },
        select: { id: true, name: true, email: true, currency: true, createdAt: true },
      }),
      prisma.account.findMany({ where: { userId: session.id } }),
      prisma.transaction.findMany({
        where: { userId: session.id },
        include: { account: true, category: true },
        orderBy: { date: "desc" },
      }),
      prisma.budget.findMany({ where: { userId: session.id }, include: { category: true } }),
      prisma.bill.findMany({ where: { userId: session.id } }),
      prisma.virtualCard.findMany({
        where: { userId: session.id },
        select: {
          id: true,
          cardholderName: true,
          cardNumberMasked: true,
          cardExpiry: true,
          cardType: true,
          cardStyle: true,
          isFrozen: true,
          spendingLimitCents: true,
          createdAt: true,
        },
      }),
    ]);

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      user,
      accounts,
      transactions,
      budgets,
      bills,
      cards,
    };

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="finvessa-export-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    console.error("Export data error:", error);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}
