"use client";

import { useRouter, usePathname } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show the back button on the homepage
  if (pathname === "/") {
    return null;
  }

  return (
    <button 
      onClick={() => router.back()} 
      className="back_button"
      title="Go Back"
    >
      <div className="icon">
        <IconArrowLeft size={20} />
      </div>
      <span>Back</span>
    </button>
  );
}
