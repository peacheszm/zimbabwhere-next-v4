import { signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { IconMenu2, IconX } from "@tabler/icons-react";

import BackButton from "@/components/global/BackButton";

import SiteFilter from "@/components/global/SiteFilter";
export default function Navigation() {
  const { data: session } = useSession();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropRef.current && !dropRef.current.contains(event.target)) {
        setIsNavOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add class on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeNav = () => setIsNavOpen(false);

  return (
    <nav className={`main_navigation ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <BackButton />
        <div className="logo">
          <Link href="/">
            <div className="logo_img">
              <Image
                src="/img/logo.png"
                alt="Zimbabwhere.com"
                width={100}
                height={100}
              />
            </div>
            <span>Zimbabwhere.com</span>
          </Link>
        </div>

        <div className="menu_toggle" onClick={() => setIsNavOpen(!isNavOpen)}>
          <IconMenu2 />
        </div>

        <div
          className={`main_nav_wrapper ${isNavOpen ? "nav_open" : ""}`}
          ref={dropRef}
        >
          <div className="nav_wrapper_mobile_header">
            <div className="logo">
              <Link href="/">
                <div className="logo_img">
                  <Image
                    src="/img/logo.png"
                    alt="Zimbabwhere.com"
                    width={100}
                    height={100}
                  />
                </div>
                <span>Zimbabwhere.com</span>
              </Link>
            </div>
            <div className="menu_toggle" onClick={() => setIsNavOpen(false)}>
              <IconX />
            </div>
          </div>

          <div className="nav_items">
            <Link href="/get-a-quote" onClick={closeNav}>
              Get A Quote
            </Link>
            <Link href="/add-a-business" onClick={closeNav}>
              Add Your Business
            </Link>

            {!session ? (
              <>
                <Link href="/auth/login" onClick={closeNav}>
                  Login
                </Link>
                <Link href="/auth/register" onClick={closeNav}>
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link href="/my-account" onClick={closeNav}>
                  Account
                </Link>
                <Link href="/" onClick={() => signOut()}>
                  Logout
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <SiteFilter />
    </nav>
  );
}
