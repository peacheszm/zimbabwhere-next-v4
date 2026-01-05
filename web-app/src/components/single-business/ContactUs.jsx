import Link from "next/link";
import {
  IconPhone,
  IconBrandWhatsapp,
  IconMail,
  IconFileText,
} from "@tabler/icons-react";
export default function ContactUs({ post }) {
  const phoneNumber = (phone) => {
    if (!phone) return "";
    return phone.replace(/\D/g, "");
  };
  return (
    <div className="contact_method btn_group inner_container">
      <Link
        href={`/get-a-quote?bid=${post.id}`}
        className="menu_item get_a_quote_button"
      >
        <div className="icon">
          <IconFileText size={20} />
        </div>
        <span>Contact Us</span>
      </Link>

      {post.acf?.phone_number && (
        <a href={`tel:${phoneNumber(post.acf.phone_number)}`} className="phone">
          <div className="icon">
            <IconPhone size={20} />
          </div>
        </a>
      )}

      {post.acf?.business_whatsapp && (
        <a
          href={`https://wa.me/${phoneNumber(post.acf.business_whatsapp)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp"
        >
          <div className="icon">
            <IconBrandWhatsapp size={20} />
          </div>
        </a>
      )}
      {post.acf?.business_email && (
        <a
          href={`mailto:${post.acf?.business_email}`}
          target="_blank"
          className="email"
        >
          <div className="icon">
            <IconMail size={20} />
          </div>
        </a>
      )}
    </div>
  );
}
