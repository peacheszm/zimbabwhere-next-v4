import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  const wordpressUrl =
    process.env.NEXT_PUBLIC_WP_SITE_URL ||
    "https://stage.justlime.com/zimbabwhere21";
  const authKey = process.env.NEXTAUTH_SECRET;

  // Use URL constructor for safer parameter handling and to avoid hardcoding
  const url = new URL(wordpressUrl);
  url.searchParams.set("rest_route", "/simple-jwt-login/v1/autologin");
  url.searchParams.set("JWT", token);
  url.searchParams.set("AUTH_KEY", authKey);

  return NextResponse.redirect(url.toString());
}
