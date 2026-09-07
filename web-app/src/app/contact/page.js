import { IconPhone, IconBrandWhatsapp, IconMail, IconMapPin } from "@tabler/icons-react";

import ContactForm from "@/components/contact/ContactForm";
import SiteSideBar from "@/components/global/Sidebar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact Us | Zimbabwhere",
  description:
    "Get in touch with the Zimbabwhere team. Send us a message and we'll get back to you as soon as possible.",
};

export default async function ContactPage() {
  return (
    <div className="page_wrapper">
      <div className="container">
        <main className="main">
          <div className="page_title">
            <h1>Contact Us</h1>
            <p style={{ marginTop: "8px", fontSize: "14px", color: "#bbb" }}>
              Got a question, suggestion, or need a hand with something?
              Send us a message below and our team will get back to you as
              soon as possible.
            </p>
          </div>

          <div className="contact_details_list">
            <div className="contact_detail_item">
              <IconMapPin />
              <span>Chegutu, Zimbabwe</span>
            </div>
            <div className="contact_detail_item">
              <IconPhone />
              <a href="tel:+263773765485">+263 (0)77 3765 485</a>
            </div>
            <div className="contact_detail_item">
              <IconBrandWhatsapp />
              <a href="https://wa.me/+263773765485" target="_blank">
                +263 (0)77 3765 485
              </a>
            </div>
            <div className="contact_detail_item">
              <IconMail />
              <a href="mailto:zimbabadvertising@gmail.com">
                zimbabadvertising@gmail.com
              </a>
            </div>
          </div>

          <ContactForm />
        </main>
        <aside className="aside">
          <SiteSideBar />
        </aside>
      </div>
    </div>
  );
}
