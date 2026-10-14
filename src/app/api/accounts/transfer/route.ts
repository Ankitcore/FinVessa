import { NextRequest, NextResponse } from "next/server";
import { getRequestSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const transferSchema = z.object({
  fromAccountId: z.string().min(1, "Source account is required"),
  toAccountId: z.string().min(1, "Destination account is required"),
  amountCents: z.number().int().positive("Transfer amount must be greater than zero"),
  description: z.string().default("Account Transfer"),
});

export async function POST(req: NextRequest) {
  try {
    const session = getRequestSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = transferSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid transfer input" },
        { status: 400 }
      );
    }

    const { fromAccountId, toAccountId, amountCents, description } = parsed.data;

    if (fromAccountId === toAccountId) {
      return NextResponse.json(
        { error: "Source and destination accounts must be different" },
        { status: 400 }
      );
    }

    // Verify ownership of both accounts
    const [fromAcc, toAcc] = await Promise.all([
      prisma.account.findFirst({ where: { id: fromAccountId, userId: session.id } }),
      prisma.account.findFirst({ where: { id: toAccountId, userId: session.id } }),
    ]);

    if (!fromAcc || !toAcc) {
      return NextResponse.json(
        { error: "One or both accounts could not be found" },
        { status: 404 }
      );
    }

    if (fromAcc.type !== "CREDIT_CARD" && fromAcc.balanceCents < amountCents) {
      return NextResponse.json(
        { error: "Insufficient funds in source account for this transfer" },
        { status: 400 }
      );
    }

    // Atomic database transaction
    const result = await prisma.$transaction(async (txClient) => {
      // 1. Debit from source account
      const updatedFrom = await txClient.account.update({
        where: { id: fromAccountId },
        data: { balanceCents: { decrement: amountCents } },
      });

      // 2. Credit to destination account
      const updatedTo = await txClient.account.update({
        where: { id: toAccountId },
        data: { balanceCents: { increment: amountCents } },
      });

      // 3. Create transfer record
      const transferTx = await txClient.transaction.create({
        data: {
          userId: session.id,
          accountId: fromAccountId,
          transferAccountId: toAccountId,
          type: "TRANSFER",
          amountCents,
          description: description || `Transfer: ${fromAcc.name} → ${toAcc.name}`,
          status: "COMPLETED",
          date: new Date(),
        },
      });

      return { updatedFrom, updatedTo, transferTx };
    });

    return NextResponse.json({
      success: true,
      message: "Transfer completed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Transfer error:", error);
    return NextResponse.json(
      { error: "Failed to execute transfer" },
      { status: 500 }
    );
  }
}
