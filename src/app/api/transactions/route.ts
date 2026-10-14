import { NextRequest, NextResponse } from "next/server";
import { getRequestSession, getRequestSessionOrDemo } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createTxSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
  amountCents: z.number().int().positive("Amount must be greater than zero"),
  accountId: z.string().min(1, "Account is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  transferAccountId: z.string().nullable().optional(),
  notes: z.string().optional(),
});

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getRequestSessionOrDemo(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "ALL";
    const accountId = searchParams.get("accountId") || "ALL";
    const categoryId = searchParams.get("categoryId") || "ALL";
    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    const where: Record<string, unknown> = {
      userId: session.id,
    };

    if (search) {
      where.description = { contains: search };
    }

    if (type !== "ALL") {
      where.type = type;
    }

    if (accountId !== "ALL") {
      where.OR = [
        { accountId: accountId },
        { transferAccountId: accountId },
      ];
    }

    if (categoryId !== "ALL") {
      where.categoryId = categoryId;
    }

    const [total, transactions] = await prisma.$transaction([
      prisma.transaction.count({ where }),
      prisma.transaction.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          account: true,
          category: true,
        },
      }),
    ]);

    return NextResponse.json({
      transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("Fetch transactions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
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
    const parsed = createTxSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Verify account ownership
    const sourceAccount = await prisma.account.findFirst({
      where: { id: data.accountId, userId: session.id },
    });

    if (!sourceAccount) {
      return NextResponse.json({ error: "Source account not found" }, { status: 404 });
    }

    if (data.type === "TRANSFER") {
      if (!data.transferAccountId) {
        return NextResponse.json(
          { error: "Destination account is required for transfers" },
          { status: 400 }
        );
      }
      if (data.transferAccountId === data.accountId) {
        return NextResponse.json(
          { error: "Cannot transfer to the same account" },
          { status: 400 }
        );
      }

      const destAccount = await prisma.account.findFirst({
        where: { id: data.transferAccountId, userId: session.id },
      });
      if (!destAccount) {
        return NextResponse.json({ error: "Destination account not found" }, { status: 404 });
      }

      if (sourceAccount.type !== "CREDIT_CARD" && sourceAccount.balanceCents < data.amountCents) {
        return NextResponse.json(
          { error: "Insufficient funds in source account for this transfer" },
          { status: 400 }
        );
      }

      // Execute atomic transfer
      const tx = await prisma.$transaction(async (txClient) => {
        // Debit source account
        await txClient.account.update({
          where: { id: sourceAccount.id },
          data: { balanceCents: { decrement: data.amountCents } },
        });

        // Credit destination account
        await txClient.account.update({
          where: { id: destAccount.id },
          data: { balanceCents: { increment: data.amountCents } },
        });

        // Create transaction record
        return txClient.transaction.create({
          data: {
            userId: session.id,
            accountId: sourceAccount.id,
            transferAccountId: destAccount.id,
            categoryId: data.categoryId || null,
            type: "TRANSFER",
            amountCents: data.amountCents,
            description: data.description,
            date: data.date ? new Date(data.date) : new Date(),
            notes: data.notes || null,
            status: "COMPLETED",
          },
          include: {
            account: true,
            category: true,
          },
        });
      });

      return NextResponse.json({ success: true, transaction: tx });
    }

    // INCOME or EXPENSE
    const tx = await prisma.$transaction(async (txClient) => {
      if (data.type === "INCOME") {
        await txClient.account.update({
          where: { id: sourceAccount.id },
          data: { balanceCents: { increment: data.amountCents } },
        });
      } else if (data.type === "EXPENSE") {
        await txClient.account.update({
          where: { id: sourceAccount.id },
          data: { balanceCents: { decrement: data.amountCents } },
        });
      }

      return txClient.transaction.create({
        data: {
          userId: session.id,
          accountId: sourceAccount.id,
          categoryId: data.categoryId || null,
          type: data.type,
          amountCents: data.amountCents,
          description: data.description,
          date: data.date ? new Date(data.date) : new Date(),
          notes: data.notes || null,
          status: "COMPLETED",
        },
        include: {
          account: true,
          category: true,
        },
      });
    });

    return NextResponse.json({ success: true, transaction: tx });
  } catch (error) {
    console.error("Create transaction error:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
