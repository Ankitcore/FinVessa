import { NextRequest, NextResponse } from "next/server";
import { getRequestSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const limitSchema = z.object({
  spendingLimitCents: z.number().int().positive("Limit must be greater than zero"),
});

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
    const existing = await prisma.virtualCard.findFirst({
      where: { id, userId: session.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = limitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid limit" },
        { status: 400 }
      );
    }

    const updated = await prisma.virtualCard.update({
      where: { id },
      data: { spendingLimitCents: parsed.data.spendingLimitCents },
    });

    return NextResponse.json({
      success: true,
      card: updated,
      message: "Card spending limit updated successfully",
    });
  } catch (error) {
    console.error("Update card limit error:", error);
    return NextResponse.json(
      { error: "Failed to update spending limit" },
      { status: 500 }
    );
  }
}
