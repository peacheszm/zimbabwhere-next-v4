"use client";
import React from "react";
import {
  IconBrandFacebook,
  IconBrandX,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandYoutube,
} from "@tabler/icons-react";

// Modal Stuff
import { useModal } from "@/contexts/ModalContext";
import EditSocial from "@/components/modals/single-business/EditSocial";

const PLATFORM_ICONS = {
  Facebook: IconBrandFacebook,
  Twitter: IconBrandX,
  Instagram: IconBrandInstagram,
  Linkedin: IconBrandLinkedin,
  Youtube: IconBrandYoutube,
};

export default function Social({ data }) {
  const { openModal } = useModal();

  const socialProfiles = data?.acf?.social || [];

  const handleOpenModal = () => {
    openModal("EditSocial", data);
  };

  return (
    <div className="manage_section social">
      <div className="ms_title">
        <h3>Social Media</h3>
      </div>
      <div className="ms_desc">
        <h4>Online Presence</h4>
        <p>
          Connect your social media profiles to your business listing. This
          makes it easier for customers to follow and engage with you across
          platforms. These will be accessible through your business page.
        </p>
      </div>

      <div className="ms_body">
        <div className="social_list">
          {socialProfiles.length > 0 ? (
            <div className="social_grid">
              {socialProfiles.map((profile, index) => {
                const Icon =
                  PLATFORM_ICONS[profile.social_platform] || IconBrandFacebook;
                return (
                  <div key={index} className="social_item">
                    <div className="icon">
                      <Icon size={24} />
                    </div>

                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="url"
                    >
                      View Profile
                    </a>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>
              No social profiles provided yet. Please add all the social links
              you use for your business. These will be accessible through your
              business page.
            </p>
          )}
        </div>
      </div>

      <div className="ms_footer">
        <button onClick={handleOpenModal}>Edit Social Links</button>
      </div>

      <EditSocial />
    </div>
  );
}
