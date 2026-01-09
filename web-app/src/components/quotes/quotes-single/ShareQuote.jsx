"use client";

import { useState } from "react";
import {
  IconShare,
  IconBrandWhatsapp,
  IconMail,
  IconBrandFacebook,
  IconBrandX,
} from "@tabler/icons-react";

function getPageUrl() {
  if (typeof window === "undefined") return "";
  return window.location.href;
}

export default function ShareQuote({ title }) {
  const [show, setShow] = useState(false);
  const pageUrl = getPageUrl();

  const emailHref = `mailto:?subject=${encodeURIComponent(
    title || "Quote"
  )}&body=${encodeURIComponent(pageUrl)}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
    `I found this quote on Zimbabwhere that you might be interested in. Check it out at: ${pageUrl}`
  )}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    pageUrl
  )}`;
  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title || "Quote"
  )}&url=${encodeURIComponent(pageUrl)}`;

  return (
    <div className="share_quote">
      <div className="btn_group">
        <button
          className="share_quote_toggle btn btn-green"
          onClick={() => setShow((v) => !v)}
        >
          <span className="icon">
            <IconShare size={16} />
          </span>
          Share Quote To A Friend
        </button>
      </div>
      {show ? (
        <div className="share_options btn_group">
          <a
            className="btn icon_w"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="icon">
              <IconBrandWhatsapp size={16} />
            </span>
            share on whatsapp
          </a>
          <a
            className="btn icon_m"
            href={emailHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="icon">
              <IconMail size={16} />
            </span>
            share on email
          </a>
          <a
            className="btn icon_f"
            href={facebookHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="icon">
              <IconBrandFacebook size={16} />
            </span>
            share on facebook
          </a>
          <a
            className="btn icon_t"
            href={twitterHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="icon">
              <IconBrandX size={16} />
            </span>
            share on twitter
          </a>
        </div>
      ) : null}
    </div>
  );
}
