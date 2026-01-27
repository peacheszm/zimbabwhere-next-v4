import Link from "next/link";
import Image from "next/image";
import { IconMapPin, IconEdit, IconEye, IconPlus } from "@tabler/icons-react";
export default function MyBusinessList({ data }) {
  return (
    <div className="my_business_list">
      <div className="page_title">
        <h1>My Businesses</h1>
      </div>

      <div className="my_business_listings">
        {data.map((business) => (
          <div key={business.id} className="card_main">
            <div className="card_image">
              <Image
                decoding="async"
                src={
                  typeof business.meta?.logo === "string"
                    ? business.meta.logo // if it's already a URL
                    : business.meta?.logo?.sizes?.thumbnail || // if it's an image object
                      business.meta?.business_banner?.sizes?.thumbnail || // fallback to banner
                      "https://admin.zimbabwhere.com/wp-content/themes/zimbabwhere/images/placeholder.webp" // final fallback
                }
                alt={business.title || "Business logo"}
                width={200}
                height={200}
              />
            </div>

            <div className="card_body">
              <div className="card_title">
                <h5>{business.title}</h5>
                <p>
                  Please click 'edit' to update or add for free to your business
                  page - any Photos, Brochures, menus, opening hours, social
                  media links ..etc to best represent your business.
                </p>

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
