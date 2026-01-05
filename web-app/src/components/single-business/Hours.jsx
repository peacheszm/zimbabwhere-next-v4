import Image from "next/image";
import { IconMapPin, IconEye } from "@tabler/icons-react";
export default function Hours({ post }) {
  return (
    <div className="business_hours">
      {Array.isArray(post.acf?.opening_times) &&
        post.acf.opening_times.length > 0 && (
          <>
            <h4>Business Hours</h4>
            <ul className="inner_container">
              {post.acf.opening_times.map((time, i) => (
                <li key={i}>
                  <span>{time.day}:</span>
                  <span>
                    {time.opening_time} - {time.closing_time}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
    </div>
  );
}
