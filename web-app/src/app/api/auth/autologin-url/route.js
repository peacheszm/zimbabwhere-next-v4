import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  const url = `https://stage.justlime.com/zimbabwhere21/?rest_route=/simple-jwt-login/v1/autologin&JWT=${encodeURIComponent(
    token
  )}&AUTH_KEY=${process.env.NEXTAUTH_SECRET}`;

  return NextResponse.redirect(url);
}
