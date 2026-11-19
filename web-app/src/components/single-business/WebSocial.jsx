import Categorys from "@/components/single-business/Categorys";
import Image from "next/image";
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconPlayerPlayFilled,
  IconWorldWww,
} from "@tabler/icons-react";
import { extractVideoId, getYouTubeThumbnail } from "@/lib/utils/youtube";
import { cleanWebsiteUrl } from "@/lib/utils/url";

export default function WebSocial({ post }) {
  const websiteUrl = cleanWebsiteUrl(post.acf?.business_website);

  const videos = (
    Array.isArray(post.acf?.youtube_videos) ? post.acf.youtube_videos : []
  )
    .map((yt) => extractVideoId(yt.video_url))
    // extractVideoId hands back the original text when it is not a video
    .filter((id) => /^[\w-]{11}$/.test(id));

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
      {websiteUrl && (
        <div className="business_website btn_group">
          <a
            className="btn btn-green"
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="icon">
              <IconWorldWww size={26} />
            </span>
            Visit Website
          </a>
        </div>
      )}

      <div className="desktop_only">
        <Categorys post={post} />
      </div>

      {/* Social media */}
      <br />
      <h4>Social Media</h4>
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
              {social.social_platform === "Instagram" &&
                social.url !== "NULL" && (
                  <a
                    className="icon_in"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconBrandInstagram size={20} />
                  </a>
                )}
            </div>
          ))}
      </div>

      {/* Videos: thumbnails so each one can be told apart */}
      {videos.length > 0 && (
        <div className="business_videos">
          <h4>Videos</h4>
          <div className="video_grid">
            {videos.map((videoId, i) => (
              <a
                key={`${videoId}-${i}`}
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="video_thumb"
                aria-label={`Watch video ${i + 1} on YouTube`}
              >
                <img
                  src={getYouTubeThumbnail(videoId)}
                  alt={`Video ${i + 1}`}
                  loading="lazy"
                />
                <span className="play" aria-hidden="true">
                  <IconPlayerPlayFilled size={22} />
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
