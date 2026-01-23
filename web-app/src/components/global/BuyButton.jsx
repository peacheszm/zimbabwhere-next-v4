"use client";
import { useSession } from "next-auth/react";
export default function BuyButton({ title }) {
  const { data: session } = useSession();
  const autologinUrl = session?.jwt
    ? `/api/auth/autologin-url?token=${encodeURIComponent(session.jwt)}`
    : "#";
  return (
    <a
      href={autologinUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="buy_link"
    >
      {title}
    </a>
  );
}
