import { NextRequest, NextResponse } from "next/server";
import { getRequestSession, getRequestSessionOrDemo, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSettingsSchema = z.object({
  name: z.string().min(2).optional(),
  avatar: z.string().nullable().optional(),
  currency: z.string().optional(),
  theme: z.string().optional(),
  balanceHidden: z.boolean().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
});

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getRequestSessionOrDemo(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        currency: true,
        theme: true,
        balanceHidden: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = getRequestSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const user = await prisma.user.findUnique({ where: { id: session.id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (data.name) updateData.name = data.name.trim();
    if (data.avatar !== undefined) updateData.avatar = data.avatar;
    if (data.currency) updateData.currency = data.currency;
    if (data.theme) updateData.theme = data.theme;
    if (data.balanceHidden !== undefined) updateData.balanceHidden = data.balanceHidden;

    // Handle password change if requested
    if (data.newPassword) {
      if (!data.currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password" },
          { status: 400 }
        );
      }
      const isMatch = await verifyPassword(data.currentPassword, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Current password does not match" },
          { status: 400 }
        );
      }
      updateData.passwordHash = await hashPassword(data.newPassword);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        currency: true,
        theme: true,
        balanceHidden: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
