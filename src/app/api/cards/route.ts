import { NextRequest, NextResponse } from "next/server";
import { getRequestSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createCardSchema = z.object({
  cardholderName: z.string().min(2, "Cardholder name is required"),
  accountId: z.string().nullable().optional(),
  cardType: z.enum(["RUPAY", "VISA", "MASTERCARD"]).default("RUPAY"),
  cardStyle: z.enum(["SAPPHIRE_CYAN", "MIDNIGHT_DARK", "NEON_EMERALD"]).default("SAPPHIRE_CYAN"),
  spendingLimitCents: z.number().int().positive().default(500000),
});

export async function GET(req: NextRequest) {
  try {
    const session = getRequestSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cards = await prisma.virtualCard.findMany({
      where: { userId: session.id },
      include: { account: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ cards });
  } catch (error) {
    console.error("Fetch cards error:", error);
    return NextResponse.json(
      { error: "Failed to fetch virtual cards" },
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
    const parsed = createCardSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Generate random fictional masked number and CVV
    const last4 = Math.floor(1000 + Math.random() * 9000).toString();
    const masked = `•••• •••• •••• ${last4}`;
    const fullNumber = `4532 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${last4}`;
    const cvv = Math.floor(100 + Math.random() * 900).toString();
    const expiry = "10/30";

    const card = await prisma.virtualCard.create({
      data: {
        userId: session.id,
        accountId: data.accountId || null,
        cardholderName: data.cardholderName.toUpperCase(),
        cardNumberMasked: masked,
        fullNumber,
        cardExpiry: expiry,
        cardCvv: cvv,
        cardType: data.cardType,
        cardStyle: data.cardStyle,
        spendingLimitCents: data.spendingLimitCents,
        isFrozen: false,
      },
      include: { account: true },
    });

    return NextResponse.json({ success: true, card });
  } catch (error) {
    console.error("Create card error:", error);
    return NextResponse.json(
      { error: "Failed to create virtual card" },
      { status: 500 }
    );
  }
}
