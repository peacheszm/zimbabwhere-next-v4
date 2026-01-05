import Image from "next/image";
import { IconMapPin, IconEye } from "@tabler/icons-react";
export default function OverView({ post }) {
  return (
    <div className="business_overview">
      {/* Business overview */}
      {(post.acf?.business_description &&
        post.acf.business_description !== "<p>NULL</p>\n") ||
      (post.acf?.business_overview && post.acf.business_overview !== "NULL") ? (
        <>
          <h4>Business Overview</h4>
          <div
            dangerouslySetInnerHTML={{
              __html:
                post.acf.business_description || post.acf.business_overview,
            }}
          />
        </>
      ) : null}
    </div>
  );
}
