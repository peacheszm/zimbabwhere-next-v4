import Image from "next/image";
import { IconMapPin, IconEye } from "@tabler/icons-react";
import BusinessRatings from "@/components/single-business/BusinessRatings";
export default function Title({ post }) {
  return (
    <div className="title_area">
      <div className="title_area_top">
        <div className="title_col col_left">
          <div className="business_logo">
            {post._embedded?.["wp:featuredmedia"] ? (
              <Image
                src={post._embedded["wp:featuredmedia"][0].source_url}
                alt={post.title?.rendered}
                width={200}
                height={200}
              />
            ) : post.acf?.logo ? (
              <Image
                src={post.acf.logo.url}
                alt={post.title?.rendered}
                width={200}
                height={200}
              />
            ) : (
              <Image
                src="/img/placeholder.png"
                alt="Placeholder"
                width={200}
                height={200}
              />
            )}
          </div>
        </div>
        <div className="title_col col_right">
          {post.title?.rendered && (
            <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          )}
          <div className="views">
            <div className="icon">
              <IconEye size={20} />
            </div>
            {post.acf?.page_views || 0} Views
          </div>
        </div>
      </div>
      <div className="title_area_mid">
        <BusinessRatings
          business_id={post.id}
          business_name={post.title.rendered}
          business_title={post.title.rendered}
        />
      </div>
      <div className="title_area_bottom">
        {post.acf?.business_motto && (
          <div className="motto">"{post.acf.business_motto}"</div>
        )}

        <a href="#map_section" className="address">
          <div className="icon">
            <IconMapPin size={20} />
          </div>
          <span>
            {post.acf?.street_number} {post.acf?.street_name},
            {post.acf?.suburb && <span> {post.acf.suburb.name} </span>}
            {post.acf?.town && <span> {post.acf.town.name} </span>}
          </span>
        </a>
      </div>
    </div>
  );
}
