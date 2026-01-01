import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { IconX } from "@tabler/icons-react";

export default function Modal({ onClose, title, children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className="page_modal">
      <div className="modal_underlay" onClick={onClose}></div>
      <div className="modal_overlay">
        <div className="modal_inner">
          <div className="modal_header">
            <h5>{title}</h5>

            <div className="close_button" onClick={onClose}>
              <IconX />
            </div>
          </div>
          <div className="modal_body">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}
