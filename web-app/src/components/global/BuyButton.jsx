"use client";
import { useSession } from "next-auth/react";
export default function BuyButton({ title, subTitle = "" }) {
  const { data: session } = useSession();
  const autologinUrl = session?.jwt
    ? `/api/auth/autologin-url?token=${encodeURIComponent(session.jwt)}`
    : "#";
  return (
    <div className="buy_link_wrapper">
      <a
        href={autologinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="buy_link"
      >
        <div className="title">{title}</div>
        <div className="sub_title">{subTitle}</div>
      </a>
    </div>
  );
}
