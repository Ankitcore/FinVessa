import { NextRequest, NextResponse } from "next/server";
import { getRequestSession, getRequestSessionOrDemo } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createBillSchema = z.object({
  name: z.string().min(2, "Bill name is required"),
  amountCents: z.number().int().positive("Amount must be greater than zero"),
  dueDate: z.string().min(1, "Due date is required"),
  recurrence: z.enum(["ONCE", "WEEKLY", "MONTHLY", "YEARLY"]).default("MONTHLY"),
  category: z.string().default("Utilities"),
  accountId: z.string().nullable().optional(),
  autoPay: z.boolean().default(false),
});

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getRequestSessionOrDemo(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    const bills = await prisma.bill.findMany({
      where: { userId: session.id },
      include: { account: true },
      orderBy: { dueDate: "asc" },
    });

    // Mark bills overdue dynamically if dueDate has passed and status is UNPAID
    const categorizedBills = bills.map((bill) => {
      let currentStatus = bill.status;
      if (currentStatus === "UNPAID" && new Date(bill.dueDate) < now) {
        currentStatus = "OVERDUE";
      }
      return {
        ...bill,
        status: currentStatus,
      };
    });

    const upcoming = categorizedBills.filter((b) => b.status === "UNPAID");
    const overdue = categorizedBills.filter((b) => b.status === "OVERDUE");
    const paid = categorizedBills.filter((b) => b.status === "PAID");

    const upcomingTotalCents = upcoming.reduce((sum, b) => sum + b.amountCents, 0);
    const overdueTotalCents = overdue.reduce((sum, b) => sum + b.amountCents, 0);

    return NextResponse.json({
      bills: categorizedBills,
      upcoming,
      overdue,
      paid,
      summary: {
        upcomingCount: upcoming.length,
        upcomingTotalCents,
        overdueCount: overdue.length,
        overdueTotalCents,
      },
    });
  } catch (error) {
    console.error("Fetch bills error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bills" },
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
    const parsed = createBillSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const bill = await prisma.bill.create({
      data: {
        userId: session.id,
        name: data.name,
        amountCents: data.amountCents,
        dueDate: new Date(data.dueDate),
        recurrence: data.recurrence,
        category: data.category,
        accountId: data.accountId || null,
        autoPay: data.autoPay,
        status: "UNPAID",
      },
      include: { account: true },
    });

    return NextResponse.json({ success: true, bill });
  } catch (error) {
    console.error("Create bill error:", error);
    return NextResponse.json(
      { error: "Failed to create bill" },
      { status: 500 }
    );
  }
}
