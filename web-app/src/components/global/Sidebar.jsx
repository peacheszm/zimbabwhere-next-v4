import Link from "next/link";
import Image from "next/image";
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from "@/lib/utils/youtube";

export default function SiteSideBar() {
  const featuredVideos = [
    "https://www.youtube.com/watch?v=9jOcgxuI-G8",
    "https://www.youtube.com/watch?v=LafgTKb3TyE",
  ];

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
        <Link href="/add-a-business/" title="Advertise Your Business">
          <img
            src="https://admin.zimbabwhere.com/wp-content/uploads/2022/08/AddYourBusiness02-300x300-1.jpeg"
            alt=""
          />
        </Link>
      </div>

      {featuredVideos.map((videoUrl, index) => (
        <div className="child" key={index}>
          <div
            className="video_wrapper"
            style={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
              overflow: "hidden",
            }}
          >
            <iframe
              src={getYouTubeEmbedUrl(videoUrl)}
              title="Featured Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            ></iframe>
          </div>
        </div>
      ))}

      <div className="child">
        <Link
          href="/premium-services"
          title="Click For Additional Advertising Options"
        >
          <img
            src="https://admin.zimbabwhere.com/wp-content/uploads/2026/02/Every-page-Advertising-options-at-bottom-of-all-videos.png"
            alt=""
          />
        </Link>
      </div>
    </div>
  );
}
