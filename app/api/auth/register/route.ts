import { NextResponse } from "next/server";
import { registerUser, signToken, AUTH_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { message: "All fields (name, email, phone, password) are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const safeUser = await registerUser(name, email, phone, password);
    const token = signToken(safeUser);

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      message: "Account created successfully.",
    });

    response.cookies.set({
      name: AUTH_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: unknown) {
    return NextResponse.json(
      { message: (err as Error).message || "Registration failed." },
      { status: 400 }
    );
  }
}
