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
    const existing = await prisma.virtualCard.findFirst({
      where: { id, userId: session.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const updated = await prisma.virtualCard.update({
      where: { id },
      data: { isFrozen: !existing.isFrozen },
    });

    return NextResponse.json({
      success: true,
      card: updated,
      message: updated.isFrozen ? "Card frozen safely" : "Card unfrozen and active",
    });
  } catch (error) {
    console.error("Toggle freeze error:", error);
    return NextResponse.json(
      { error: "Failed to toggle card status" },
      { status: 500 }
    );
  }
}
