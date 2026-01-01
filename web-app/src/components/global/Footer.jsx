import Link from "next/link";
import Image from "next/image";
import { IconPhone, IconBrandWhatsapp } from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="site_footer">
      <div className="footer_top">
        <div className="container">
          <div className="footer_wrapper">
            <div className="col footer_logo_body">
              <a href="/" className="footer_logo" aria-current="page">
                <Image
                  src="/img/logo-black.png"
                  alt="Zimbabwhere"
                  width={54}
                  height={54}
                />
              </a>
              <div className="footer_desc">
                We offer Zimbabwe’s first free online Quoting Service and free
                Business Advertising for all local businesses…
              </div>
            </div>
            <div className="col app_button"></div>
            <div className="col contact">
              <h3>Contact Us</h3>
              <ul>
                <li>
                  <p>Chegutu, Zimbabwe</p>
                </li>
                <li className="tel_group">
                  <div className="icon_group">
                    <div className="call">
                      <a href="tel:+263773765485">
                        <IconPhone />
                      </a>
                    </div>
                    <div className="whatsapp">
                      <a href="https://wa.me/+263773765485" target="_blank">
                        <IconBrandWhatsapp />
                      </a>
                    </div>
                  </div>
                  <a href="tel:+263773765485"> +263 (0)77 3765 485</a>
                </li>
                <li className="tel_group">
                  <div className="icon_group">
                    <div className="call">
                      <a href="tel:+263776404936">
                        <IconPhone />
                      </a>
                    </div>
                    <div className="whatsapp">
                      <a href="https://wa.me/+263776404936" target="_blank">
                        <IconBrandWhatsapp />
                      </a>
                    </div>
                  </div>
                  <a href="tel:+263776404936"> +263 (0)77 6404 936</a>
                </li>
                <li>
                  <a href="mailto:zimbabadvertising@gmail.com">
                    zimbabadvertising@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="footer_bottom">
        <div className="container">
          <a href="/terms-and-conditions" className="">
            Terms &amp; Conditions
          </a>
          |
          <a href="/privacy-policy" className="">
            Privacy Policy
          </a>
        </div>
      </div>
      <div className="footer_copyright">
        © 2022 All rights reserved{" "}
        <a href="https://Zimbabwhere.com">Zimbabwhere.com</a>
      </div>
    </footer>
  );
}
