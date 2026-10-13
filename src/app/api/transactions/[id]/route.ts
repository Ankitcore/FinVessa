import { NextRequest, NextResponse } from "next/server";
import { getRequestSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateTxSchema = z.object({
  description: z.string().optional(),
  amountCents: z.number().int().positive().optional(),
  categoryId: z.string().nullable().optional(),
  accountId: z.string().optional(),
  date: z.string().optional(),
  notes: z.string().nullable().optional(),
});

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
    const existing = await prisma.transaction.findFirst({
      where: { id, userId: session.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Atomically reverse the account balance effect
    await prisma.$transaction(async (txClient) => {
      if (existing.type === "INCOME") {
        // Reverse income: decrement
        await txClient.account.update({
          where: { id: existing.accountId },
          data: { balanceCents: { decrement: existing.amountCents } },
        });
      } else if (existing.type === "EXPENSE") {
        // Reverse expense: increment
        await txClient.account.update({
          where: { id: existing.accountId },
          data: { balanceCents: { increment: existing.amountCents } },
        });
      } else if (existing.type === "TRANSFER" && existing.transferAccountId) {
        // Reverse transfer: refund source, debit destination
        await txClient.account.update({
          where: { id: existing.accountId },
          data: { balanceCents: { increment: existing.amountCents } },
        });
        await txClient.account.update({
          where: { id: existing.transferAccountId },
          data: { balanceCents: { decrement: existing.amountCents } },
        });
      }

      await txClient.transaction.delete({
        where: { id },
      });
    });

    return NextResponse.json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    console.error("Delete transaction error:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getRequestSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const existing = await prisma.transaction.findFirst({
      where: { id, userId: session.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const parsed = updateTxSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const newAmount = data.amountCents !== undefined ? data.amountCents : existing.amountCents;

    const updated = await prisma.$transaction(async (txClient) => {
      // If amount changed, adjust balance
      if (newAmount !== existing.amountCents && existing.type !== "TRANSFER") {
        const diff = newAmount - existing.amountCents;
        if (existing.type === "INCOME") {
          // If income increased, add diff; if decreased, diff is negative
          await txClient.account.update({
            where: { id: existing.accountId },
            data: { balanceCents: { increment: diff } },
          });
        } else if (existing.type === "EXPENSE") {
          // If expense increased, subtract diff
          await txClient.account.update({
            where: { id: existing.accountId },
            data: { balanceCents: { decrement: diff } },
          });
        }
      }

      return txClient.transaction.update({
        where: { id },
        data: {
          description: data.description !== undefined ? data.description : existing.description,
          amountCents: newAmount,
          categoryId: data.categoryId !== undefined ? data.categoryId : existing.categoryId,
          date: data.date ? new Date(data.date) : existing.date,
          notes: data.notes !== undefined ? data.notes : existing.notes,
        },
        include: {
          account: true,
          category: true,
        },
      });
    });

    return NextResponse.json({ success: true, transaction: updated });
  } catch (error) {
    console.error("Update transaction error:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}
