"use client";
import Image from "next/image";

// Modal Stuff
import { useModal } from "@/contexts/ModalContext";
import EditLogo from "@/components/modals/single-business/EditLogo";

export default function Logo({ data }) {
  const { openModal, closeModal } = useModal();
  const currentLogo = data?.acf.logo;
  const logoUrl = currentLogo?.url || currentLogo;

  const handleOpenModal = () => {
    openModal("EditLogo", data);
  };
  return (
    <div className="manage_section logo">
      <div className="ms_title">
        <h3>Business Logo</h3>
      </div>
      <div className="ms_desc">
        <h4>Business Identity</h4>
        <p>
          Your logo represents your business across the platform and appears on
          your business listing, in search results, and throughout your business
          profile. Upload a clear, professional logo that works well at
          different sizes.
        </p>
      </div>

      <div className="ms_body">
        <div className="site_logo">
          <Image
            src={logoUrl}
            width={200}
            height={200}
            alt={data.title.rendered}
          />
        </div>
      </div>

      <div className="ms_footer">
        <button onClick={() => handleOpenModal()}>Edit Logo</button>
      </div>

      <EditLogo />
    </div>
  );
}
