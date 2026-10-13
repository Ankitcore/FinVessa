import { NextRequest, NextResponse } from "next/server";
import { getRequestSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getRequestSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const existing = await prisma.bill.findFirst({
      where: { id, userId: session.id },
      include: { account: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 });
    }

    const body = await req.json();
    const { action, recordTransaction = true } = body;

    if (action === "MARK_PAID") {
      const updated = await prisma.$transaction(async (txClient) => {
        // Mark bill as PAID
        const b = await txClient.bill.update({
          where: { id },
          data: { status: "PAID" },
        });

        // Optionally record expense transaction if account exists and recordTransaction is true
        if (recordTransaction && existing.accountId) {
          // Debit account balance
          await txClient.account.update({
            where: { id: existing.accountId },
            data: { balanceCents: { decrement: existing.amountCents } },
          });

          // Create transaction record
          await txClient.transaction.create({
            data: {
              userId: session.id,
              accountId: existing.accountId,
              type: "EXPENSE",
              amountCents: existing.amountCents,
              description: `Bill Payment: ${existing.name}`,
              status: "COMPLETED",
              date: new Date(),
            },
          });
        }

        return b;
      });

      return NextResponse.json({ success: true, bill: updated });
    }

    if (action === "MARK_UNPAID") {
      const updated = await prisma.bill.update({
        where: { id },
        data: { status: "UNPAID" },
      });
      return NextResponse.json({ success: true, bill: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Update bill status error:", error);
    return NextResponse.json(
      { error: "Failed to update bill" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getRequestSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const existing = await prisma.bill.findFirst({
      where: { id, userId: session.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 });
    }

    await prisma.bill.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Bill deleted" });
  } catch (error) {
    console.error("Delete bill error:", error);
    return NextResponse.json(
      { error: "Failed to delete bill" },
      { status: 500 }
    );
  }
}
