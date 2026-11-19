"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/global/Modal";
import BuyButton from "@/components/global/BuyButton";
import DoubleUpOffer from "@/components/global/DoubleUpOffer";

// Pops the "Double Headings" offer up once per browser session, a moment after
// the page loads. `storageKey` lets different areas of the site each show it
// once (e.g. the premium services page and the account headings pages).
// Closing it (X, Escape, the dark background, or "Maybe later") marks it as
// seen so it doesn't nag on every page change.
export default function DoubleUpPopup({
  storageKey = "double_up_popup_seen",
  delay = 2000,
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(storageKey) === "1";
    } catch {
      // Storage blocked (private window etc.): fall through and show it once
      // per page load rather than never.
    }
    if (seen) return;

    const timer = setTimeout(() => setOpen(true), delay);
    return () => clearTimeout(timer);
  }, [storageKey, delay]);

  const close = () => {
    setOpen(false);
    try {
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // Nothing to do: it just may show again on the next page load
    }
  };

  if (!open) return null;

  return (
    <Modal title="Double your headings!" onClose={close} className="double_up_popup">
      <DoubleUpOffer />
      <div className="btn_group double_up_popup_actions">
        <BuyButton title="$35 / Heading / Year" subTitle="Buy Extra Headings" />
        <button type="button" className="btn btn-green" onClick={close}>
          Maybe later
        </button>
      </div>
    </Modal>
  );
}
