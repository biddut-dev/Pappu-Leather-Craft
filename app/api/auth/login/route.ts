import { NextResponse } from "next/server";
import { comparePassword, findUserByEmail, signToken, AUTH_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Please provide both email and password." },
        { status: 400 }
      );
    }

    const userWithHash = await findUserByEmail(email);
    if (!userWithHash || !userWithHash.isActive) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, userWithHash.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const { passwordHash: _, ...safeUser } = userWithHash;
    const token = signToken(safeUser);

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      message: "Logged in successfully.",
    });

    response.cookies.set({
      name: AUTH_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Login error", error: (err as Error).message },
      { status: 500 }
    );
  }
}
