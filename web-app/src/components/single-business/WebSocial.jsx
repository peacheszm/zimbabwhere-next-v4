import Image from "next/image";
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandYoutube,
  IconFileText,
  IconWorldWww,
} from "@tabler/icons-react";
export default function WebSocial({ post }) {
  return (
    <div className="web_and_social">
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
      {/* Visit website */}
      {post.acf?.business_website && (
        <div className="business_website btn_group">
          <a
            className="btn btn-green"
            href={post.acf.business_website}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="icon">
              <IconWorldWww size={20} />
            </span>
            Visit Website
          </a>
        </div>
      )}

      {/* Social media */}
      <div className="business_social">
        {Array.isArray(post.acf?.social) &&
          post.acf.social.map((social, i) => (
            <div key={i}>
              {social.social_platform === "Facebook" &&
                social.url !== "NULL" && (
                  <a
                    className="icon_f"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconBrandFacebook size={20} />
                  </a>
                )}
              {social.social_platform === "Twitter" &&
                social.url !== "NULL" && (
                  <a
                    className="icon_t"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconBrandTwitter size={20} />
                  </a>
                )}
            </div>
          ))}

        {Array.isArray(post.acf?.youtube_videos) &&
          post.acf.youtube_videos.map((yt, yti) => (
            <a
              key={yti}
              href={yt.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="icon_yt"
            >
              <IconBrandYoutube size={20} />
            </a>
          ))}
      </div>
    </div>
  );
}
