"use client";
import { IconPhone, IconBrandWhatsapp, IconMail } from "@tabler/icons-react";

import { useModal } from "@/contexts/ModalContext";
import { formatZimPhone } from "@/lib/utils/phone";

import RespondToQuote from "@/components/modals/RespondToQuote";

export default function RespondActions({ title, postId, phone, email }) {
  const { openModal, closeModal } = useModal();
  return (
    <div className="inner_container">
      <div className="quote_actions btn_group">
        <a href={`tel:${formatZimPhone(phone, "tel")}`} className="">
          <span className="icon">
            <IconPhone size={16} />
          </span>
          Via Call
        </a>
        <a
          href={`https://wa.me/${formatZimPhone(phone, "wa")}`}
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
