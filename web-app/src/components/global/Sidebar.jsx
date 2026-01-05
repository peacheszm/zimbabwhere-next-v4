import Link from "next/link";
import Image from "next/image";
import { IconPhone, IconBrandWhatsapp } from "@tabler/icons-react";

export default function SiteSideBar() {
  return (
    <div className="advertbox">
      <div className="child">
        <Link
          href="/premium-services"
          title="Click For Additional Information &amp; Advertising Options"
          className="wht_its_free"
        >
          <div className="col col_left">
            <h2>Why Its Free</h2>
            <p>Click Here</p>
          </div>
          <div className="col col_right">
            <Image
              src="/img/logo.png"
              width={100}
              height={100}
              alt="Click For Additional Information &amp; Advertising Options"
            />
          </div>
        </Link>
      </div>
      <div className="child">
        <Link
          href="/my-account/add-a-business/"
          title="Advertise Your Business"
        >
          <img
            src="https://admin.zimbabwhere.com/wp-content/uploads/2022/08/AddYourBusiness02-300x300-1.jpeg"
            alt=""
          />
        </Link>
      </div>
      <div className="child">
        <a
          href="https://youtu.be/eSXKDLEUsnk"
          target="_blank"
          title="Featured Video"
        >
          <img
            src="https://admin.zimbabwhere.com/wp-content/uploads/2022/08/Screenshot-2022-06-14-at-10.42.24-300x167-1.png"
            alt=""
          />
        </a>
      </div>
      <div className="child">
        <Link
          href="/premium-services"
          title="Click For Additional Advertising Options"
        >
          <img
            src="https://admin.zimbabwhere.com/wp-content/uploads/2022/08/banner01-448x1024-1.jpeg"
            alt=""
          />
        </Link>
      </div>
    </div>
  );
}
