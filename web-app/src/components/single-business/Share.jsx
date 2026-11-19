"use client";
import React, { useState, useEffect } from "react";
import {
  IconBrandWhatsapp,
  IconMail,
  IconBrandFacebook,
  IconBrandTwitter,
} from "@tabler/icons-react";
import { decodeHtml } from "@/lib/utils/decodeHtml";

export default function Share({ post }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    // Without the query string, so everyone shares (and WhatsApp previews) the same link
    setUrl(window.location.origin + window.location.pathname);
  }, []);

  // The title comes back from WordPress with entities in it ("Smith &amp; Sons").
  // Everything is encoded, so a "&" in the name can't cut the link short.
  const name = decodeHtml(post.title?.rendered) || "this business";
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="business_share" style={{ paddingTop: "24px" }}>
      <h4>Share Listing</h4>
      <div className="share_items">
        <a
          className="icon_w"
          aria-label="Share on WhatsApp"
          href={`https://wa.me/?text=${encodeURIComponent(
            `I found ${name} on Zimbabwhere that you might be interested in. Check it out at: ${url}`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconBrandWhatsapp size={20} />
        </a>
        <a
          className="icon_m"
          aria-label="Share by email"
          href={`mailto:?subject=${encodeURIComponent(
            `${name} on Zimbabwhere`,
          )}&body=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconMail size={20} />
        </a>
        <a
          className="icon_f"
          aria-label="Share on Facebook"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconBrandFacebook size={20} />
        </a>
        <a
          className="icon_t"
          aria-label="Share on X"
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `${name} on Zimbabwhere`,
          )}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconBrandTwitter size={20} />
        </a>
      </div>
    </div>
  );
}
