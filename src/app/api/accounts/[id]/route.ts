import { NextRequest, NextResponse } from "next/server";
import { getRequestSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateAccountSchema = z.object({
  name: z.string().optional(),
  color: z.string().optional(),
  isArchived: z.boolean().optional(),
});

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
    const existing = await prisma.account.findFirst({
      where: { id, userId: session.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = updateAccountSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const updated = await prisma.account.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, account: updated });
  } catch (error) {
    console.error("Update account error:", error);
    return NextResponse.json(
      { error: "Failed to update account" },
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
    const existing = await prisma.account.findFirst({
      where: { id, userId: session.id },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // If account has transactions, archive it safely instead of breaking foreign keys
    if (existing._count.transactions > 0) {
      const archived = await prisma.account.update({
        where: { id },
        data: { isArchived: true },
      });
      return NextResponse.json({
        success: true,
        message: "Account has transaction history and was archived safely.",
        account: archived,
      });
    }

    // If no transactions, hard delete
    await prisma.account.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Account deleted." });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
