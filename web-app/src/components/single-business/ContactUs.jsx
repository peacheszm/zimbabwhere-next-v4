import Link from "next/link";
import {
  IconPhone,
  IconBrandWhatsapp,
  IconMail,
  IconFileText,
  IconWorldWww,
} from "@tabler/icons-react";

import FloatingContact from "@/components/single-business/FloatingContact";
import { formatZimPhone, displayZimPhone } from "@/lib/utils/phone";
import { cleanWebsiteUrl } from "@/lib/utils/url";

export default function ContactUs({ post }) {
  const phone = post.acf?.phone_number;
  const email = post.acf?.business_email;
  const whatsapp =
    post.acf?.business_whatsapp ||
    (post.acf?.same_as_whatsapp ? post.acf?.phone_number : "");

  const websiteUrl = cleanWebsiteUrl(post.acf?.business_website);

  const quoteHref = `/get-a-quote?bid=${post.id}`;
  const phoneHref = phone ? `tel:${formatZimPhone(phone, "tel")}` : null;
  const whatsappHref = whatsapp
    ? `https://wa.me/${formatZimPhone(whatsapp, "wa")}`
    : null;

  return (
    <>
      <section
        id="business_contact"
        className="contact_method"
        aria-labelledby="business_contact_title"
      >
        <h4 id="business_contact_title">Get in Touch</h4>

        <div className="contact_actions">
          {/* Primary action first, the direct contact options sit below it */}
          <Link href={quoteHref} className="contact_action quote">
            <span className="icon">
              <IconFileText size={22} />
            </span>
            <span className="text">
              <span className="label">Get a Quote</span>
              <span className="value">Send a request</span>
            </span>
          </Link>

          {phoneHref && (
            <a href={phoneHref} className="contact_action phone">
              <span className="icon">
                <IconPhone size={22} />
              </span>
              <span className="text">
                <span className="label">Call</span>
                <span className="value">{displayZimPhone(phone)}</span>
              </span>
            </a>
          )}

          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="contact_action whatsapp"
            >
              <span className="icon">
                <IconBrandWhatsapp size={22} />
              </span>
              <span className="text">
                <span className="label">WhatsApp</span>
                <span className="value">Chat now</span>
              </span>
            </a>
          )}

          {email && (
            <a href={`mailto:${email}`} className="contact_action email">
              <span className="icon">
                <IconMail size={22} />
              </span>
              <span className="text">
                <span className="label">Email</span>
                <span className="value">{email}</span>
              </span>
            </a>
          )}

          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact_action website"
            >
              <span className="icon">
                <IconWorldWww size={22} />
              </span>
              <span className="text">
                <span className="label">Website</span>
                <span className="value">Visit website</span>
              </span>
            </a>
          )}
        </div>
      </section>

      <FloatingContact
        phoneHref={phoneHref}
        whatsappHref={whatsappHref}
        quoteHref={quoteHref}
      />
    </>
  );
}
