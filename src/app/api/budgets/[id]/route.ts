import { NextRequest, NextResponse } from "next/server";
import { getRequestSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateBudgetSchema = z.object({
  name: z.string().optional(),
  limitCents: z.number().int().positive().optional(),
  categoryId: z.string().nullable().optional(),
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
    const existing = await prisma.budget.findFirst({
      where: { id, userId: session.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = updateBudgetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const updated = await prisma.budget.update({
      where: { id },
      data: parsed.data,
      include: { category: true },
    });

    return NextResponse.json({ success: true, budget: updated });
  } catch (error) {
    console.error("Update budget error:", error);
    return NextResponse.json(
      { error: "Failed to update budget" },
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
    const existing = await prisma.budget.findFirst({
      where: { id, userId: session.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    await prisma.budget.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Budget deleted" });
  } catch (error) {
    console.error("Delete budget error:", error);
    return NextResponse.json(
      { error: "Failed to delete budget" },
      { status: 500 }
    );
  }
}
