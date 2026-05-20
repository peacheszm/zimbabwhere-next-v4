"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function BuyButton({ title, subTitle = "" }) {
  const { data: session } = useSession();
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.pathname + window.location.search);
  }, []);

  const isLoggedIn = !!session?.jwt;

  const autologinUrl = isLoggedIn
    ? `/api/auth/autologin-url?token=${encodeURIComponent(session.jwt)}`
    : "#";

  const loginUrl = `/auth/login${
    currentUrl ? `?callbackUrl=${encodeURIComponent(currentUrl)}` : ""
  }`;

  return (
    <div className="buy_link_wrapper">
      <a
        href={isLoggedIn ? autologinUrl : loginUrl}
        target={isLoggedIn ? "_blank" : "_self"}
        rel={isLoggedIn ? "noopener noreferrer" : undefined}
        className="buy_link"
      >
        <div className="title">{title}</div>
        <div className="sub_title">{subTitle}</div>
      </a>
    </div>
  );
}

