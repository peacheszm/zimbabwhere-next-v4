"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconX } from "@tabler/icons-react";
import { DOUBLE_UP_TEXT } from "@/components/global/DoubleUpOffer";

const STORAGE_KEY = "double_up_bar_closed";

// Slim banner above the header on every page, so the Double Headings offer is
// seen by people who land somewhere other than the premium services page. It
// sits outside the sticky header, so it scrolls away with the page. Closing
// it hides it for the rest of the browser session.
export default function DoubleUpBar() {
  const pathname = usePathname();
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(STORAGE_KEY) === "1") setClosed(true);
    } catch {
      // Storage blocked: just keep showing it
    }
  }, []);

  const close = () => {
    setClosed(true);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // It may show again on the next page load, which is fine
    }
  };

  // The offer is already spelled out on the premium services page
  if (closed || pathname === "/premium-services") return null;

  return (
    <div className="double_up_bar" role="region" aria-label="Double Headings offer">
      <div className="container">
        <p>
          <strong>Double Headings Offer:</strong> {DOUBLE_UP_TEXT}{" "}
          <Link href="/premium-services">Find out more</Link>
        </p>
        <button
          type="button"
          className="double_up_bar_close"
          onClick={close}
          aria-label="Close offer"
        >
          <IconX size={18} />
        </button>
      </div>
    </div>
  );
}
