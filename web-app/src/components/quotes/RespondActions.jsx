"use client";
import { IconPhone, IconBrandWhatsapp, IconMail } from "@tabler/icons-react";

import { useModal } from "@/contexts/ModalContext";

import RespondToQuote from "@/components/modals/RespondToQuote";

function normalizePhoneForWhatsapp(phone) {
  if (!phone) return "";
  return String(phone).replace(/\D/g, "");
}

export default function RespondActions({ title, postId, phone, email }) {
  const { openModal, closeModal } = useModal();
  return (
    <div className="inner_container">
      <div className="quote_actions btn_group">
        <a href={`tel:${phone || ""}`} className="">
          <span className="icon">
            <IconPhone size={16} />
          </span>
          Via Call
        </a>
        <a
          href={`https://wa.me/${normalizePhoneForWhatsapp(phone)}`}
          target="_blank"
          rel="noopener noreferrer"
          className=""
        >
          <span className="icon">
            <IconBrandWhatsapp size={16} />
          </span>
          Via Whatsapp
        </a>
        <a
          type="button"
          className=""
          onClick={() =>
            openModal("RespondToQuote", {
              title: title,
              postId: postId,
              phone: phone,
              email: email,
            })
          }
        >
          <span className="icon">
            <IconMail size={16} />
          </span>
          Via Email
        </a>
      </div>

      <RespondToQuote />
    </div>
  );
}
