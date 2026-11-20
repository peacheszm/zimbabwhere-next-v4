import Link from "next/link";
import Image from "next/image";
import { IconMapPin, IconEdit, IconEye, IconPlus } from "@tabler/icons-react";
import NotificationPrompt from "@/components/ui/NotificationPrompt";

const FALLBACK_LOGO =
  "https://admin.zimbabwhere.com/wp-content/themes/zimbabwhere/images/placeholder.webp";

// Pick the sharpest image we have. The 150px thumbnail was being stretched to
// 200px, which made logos look soft, so prefer the larger sizes first.
function getLogoSrc(meta) {
  const logo = meta?.logo;
  if (typeof logo === "string" && logo) return logo;
  const banner = meta?.business_banner;
  return (
    logo?.sizes?.medium ||
    logo?.url ||
    logo?.sizes?.thumbnail ||
    banner?.sizes?.medium ||
    banner?.sizes?.thumbnail ||
    FALLBACK_LOGO
  );
}

export default function MyBusinessList({ data }) {
  return (
    <div className="my_business_list">
      <NotificationPrompt />
      <div className="page_title">
        <h1 style={{ marginBottom: "32px" }}>My Businesses</h1>
        <h3 style={{ marginBottom: "16px" }}>
          CONGRATULATIONS! Your listed businesses are shown below:
        </h3>
        <p>
          Please click 'edit' to update or add for free to your business page -
          any Photos, Brochures, menus, opening hours, social media links ..etc
          to best represent your business.
        </p>
      </div>

      <div className="my_business_listings">
        {data.map((business) => (
          <div key={business.id} className="card_main">
            <div className="card_image">
              <Image
                decoding="async"
                src={getLogoSrc(business.meta)}
                alt={business.title || "Business logo"}
                width={240}
                height={240}
                sizes="(min-width: 768px) 140px, 100px"
              />
            </div>

            <div className="card_body">
              <div className="card_title">
                <h5>{business.title}</h5>

                <div className="address">
                  <div className="icon">
                    <IconMapPin size={16} style={{ opacity: 0.7 }} />
                  </div>
                  {business.meta?.suburb?.name ||
                    business.meta?.area?.name ||
                    business.meta?.town?.name ||
                    business.meta?.province?.name ||
                    "Location not specified"}
                </div>
              </div>
              <div className="card_actions">
                <Link
                  href={`/my-account/manage/${business.slug}/`}
                  className="btn edit"
                >
                  <div className="icon">
                    <IconEdit size={16} />
                  </div>
                  Edit
                </Link>
                <Link
                  href={`/business/${business.slug}`}
                  className="btn view"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="icon">
                    <IconEye size={16} />
                  </div>
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
