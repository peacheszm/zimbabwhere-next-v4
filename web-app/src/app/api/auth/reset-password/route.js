import { NextResponse } from "next/server";
import {
  requestPasswordReset,
  resetPasswordWithCode,
} from "@/lib/endpoints/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Request password reset
    const result = await requestPasswordReset(email);

    return NextResponse.json(
      {
        message: "Password reset email sent successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset request error:", error);

    return NextResponse.json(
      { message: error.message || "Failed to send reset email" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { email, code, new_password } = body;

    // Validate required fields
    if (!email || !code || !new_password) {
      return NextResponse.json(
        { message: "Email, code, and new password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (new_password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Reset password with code
    const result = await resetPasswordWithCode(email, code, new_password);

    return NextResponse.json(
      {
        message: "Password reset successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);

    // Handle specific WordPress errors
    if (error.message.includes("invalid code")) {
      return NextResponse.json(
        { message: "Invalid or expired reset code" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error.message || "Password reset failed" },
      { status: 500 }
    );
  }
}
