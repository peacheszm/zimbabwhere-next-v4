"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  IconPhone,
  IconBrandWhatsapp,
  IconFileText,
} from "@tabler/icons-react";

// Mobile only (hidden from lg up in the styles). Only shown once the contact
// section has scrolled out of view, and hidden again over the footer.
export default function FloatingContact({
  phoneHref,
  whatsappHref,
  quoteHref,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const targets = [
      document.getElementById("business_contact"),
      document.querySelector(".site_footer"),
    ].filter(Boolean);
    const inView = new Set();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) inView.add(entry.target);
        else inView.delete(entry.target);
      });
      setVisible(inView.size === 0);
    });

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`contact_floating ${visible ? "visible" : ""}`}
      aria-label="Contact this business"
    >
      {phoneHref && (
        <a href={phoneHref} className="phone">
          <IconPhone size={20} />
          Call
        </a>
      )}
      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp"
        >
          <IconBrandWhatsapp size={20} />
          WhatsApp
        </a>
      )}
      <Link href={quoteHref} className="quote">
        <IconFileText size={20} />
        Get a Quote
      </Link>
    </div>
  );
}
