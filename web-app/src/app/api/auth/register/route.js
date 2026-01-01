import { NextResponse } from "next/server";
import { registerUser } from "@/lib/endpoints/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { first_name, last_name, phone_number, email, password } = body;

    // Validate required fields
    if (!first_name || !last_name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
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
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Register user with WordPress
    const userData = await registerUser({
      first_name,
      last_name,
      phone_number,
      email,
      password,
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        userData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Handle specific WordPress errors
    if (error.message.includes("already exists")) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}
