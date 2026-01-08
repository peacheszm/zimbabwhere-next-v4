"use client";
import React, { useState, useEffect } from "react";
import {
  IconBrandWhatsapp,
  IconMail,
  IconBrandFacebook,
  IconBrandTwitter,
} from "@tabler/icons-react";

export default function Share({ post }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const pageurl = () => url;
  return (
    <div className="business_share">
      <h4>Share Listing</h4>
      <div className="share_items">
        <a
          className="icon_w"
          href={`https://wa.me/?text=I found this business on Zimbabwhere that you might be interested in. Check it out at: ${pageurl()}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconBrandWhatsapp size={20} />
        </a>
        <a
          className="icon_m"
          href={`mailto:?subject=${post.title?.rendered}&body=${pageurl()}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconMail size={20} />
        </a>
        <a
          className="icon_f"
          href={`https://www.facebook.com/sharer/sharer.php?u=${pageurl()}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconBrandFacebook size={20} />
        </a>
        <a
          className="icon_t"
          href={`https://twitter.com/intent/tweet?text=${
            post.title?.rendered
          }&url=${pageurl()}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconBrandTwitter size={20} />
        </a>
      </div>
    </div>
  );
}
