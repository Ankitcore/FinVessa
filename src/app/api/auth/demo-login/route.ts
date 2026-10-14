import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken, AUTH_COOKIE_NAME, hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    let demoUser =
      (await prisma.user.findFirst({
        where: { email: "spershika@finvessa.in" },
      })) ||
      (await prisma.user.findFirst({
        where: {
          OR: [
            { email: "demo@finvessa.in" },
            { email: "aarav@finvessa.in" },
          ],
        },
      })) ||
      (await prisma.user.findFirst());

    // Auto-provision demo account if missing so demo login NEVER fails
    if (!demoUser) {
      const defaultPasswordHash = await hashPassword("Demo@1234");
      demoUser = await prisma.user.create({
        data: {
          email: "spershika@finvessa.in",
          name: "Spershika Sharma",
          passwordHash: defaultPasswordHash,
          currency: "INR",
        },
      });

      const account = await prisma.account.create({
        data: {
          userId: demoUser.id,
          name: "HDFC Salary Account",
          type: "CHECKING",
          balanceCents: 45000000,
          currency: "INR",
          color: "#0284c7",
        },
      });

      await prisma.virtualCard.create({
        data: {
          userId: demoUser.id,
          accountId: account.id,
          cardholderName: "SPERSHIKA SHARMA",
          cardNumberMasked: "•••• •••• •••• 8820",
          fullNumber: "6521 8820 9012 8820",
          cardExpiry: "08/29",
          cardCvv: "482",
          cardType: "RUPAY",
          cardStyle: "SAPPHIRE_CYAN",
          spendingLimitCents: 15000000,
        },
      });
    }

    const sessionUser = {
      id: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
      currency: demoUser.currency || "INR",
    };

    const token = signToken(sessionUser);

    const response = NextResponse.json({
      success: true,
      user: sessionUser,
    });

    // Detect HTTPS vs plain HTTP across proxies, local IPs, and Vercel
    const isHttps =
      req.headers.get("x-forwarded-proto") === "https" ||
      req.url.startsWith("https://");

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Demo login error:", error);
    return NextResponse.json(
      { error: "Failed to login demo user" },
      { status: 500 }
    );
  }
}
