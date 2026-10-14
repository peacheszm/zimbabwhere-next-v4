"use client";
import { useEffect, useState } from "react";
import {
  IconBrandWhatsapp,
  IconMail,
  IconBrandFacebook,
  IconBrandX,
} from "@tabler/icons-react";

export default function ShareHeading({ title, url }) {
  // Fall back to the browser URL if a canonical one isn't passed in
  const [pageUrl, setPageUrl] = useState(url || "");

  useEffect(() => {
    if (!url) setPageUrl(window.location.origin + window.location.pathname);
  }, [url]);

  const encodedUrl = encodeURIComponent(pageUrl);

  return (
    <div className="heading_share">
      <h4>Share this heading</h4>
      <div className="share_items">
        <a
          className="icon_w"
          aria-label="Share on WhatsApp"
          href={`https://wa.me/?text=${encodeURIComponent(
            `Find ${title} on Zimbabwhere: ${pageUrl}`,
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
            `${title} on Zimbabwhere`,
          )}&body=${encodedUrl}`}
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
            `${title} on Zimbabwhere`,
          )}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconBrandX size={20} />
        </a>
      </div>
    </div>
  );
}
