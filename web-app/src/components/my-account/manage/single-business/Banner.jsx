"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";

// Modal Stuff
import { useModal } from "@/contexts/ModalContext";
import EditBanner from "@/components/modals/single-business/EditBanner";

export default function Banner({ data }) {
  const { data: session } = useSession();
  const { openModal } = useModal();
  const currentBanner = data?.acf?.business_banner;
  const bannerUrl = currentBanner?.url || currentBanner;

  const handleOpenModal = () => {
    openModal("EditBanner", data);
  };

  const autologinUrl = session?.jwt
    ? `/api/auth/autologin-url?token=${encodeURIComponent(session.jwt)}`
    : "#";

  return (
    <div className="manage_section banner">
      <div className="ms_title">
        <h3>Business Banner</h3>
        <a
          href={autologinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="buy_link"
        >
          Buy Home Page Billboard
        </a>
      </div>
      <div className="ms_desc">
        <h4>Home Page Banner</h4>
        <p>
          This is a PAID for option. Upgrade to advertise your business with a
          banner image that will be displayed on the home page of our website
          every time the website opens. Once you have a billboard banner optoin
          you can Choose an eye-catching, high-quality image that represents
          your business well and apply it here.
        </p>
      </div>

      <div className="ms_body banner_preview">
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            width={800}
            height={300}
            alt="Business Banner"
            style={{ objectFit: "cover", width: "100%", height: "auto" }}
          />
        ) : (
          <div className="placeholder_banner">No uploads provided yet.</div>
        )}
      </div>

      <div className="ms_footer">
        <button onClick={handleOpenModal}>Edit Banner</button>
      </div>

      <EditBanner />
    </div>
  );
}
