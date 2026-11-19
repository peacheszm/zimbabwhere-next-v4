import { Analytics } from "@vercel/analytics/next";
import ClientWrapper from "./ClientWrapper";
import Script from "next/script";
import "@/styles/main.scss";
import { DEFAULT_SHARE_IMAGE, SITE_NAME } from "@/lib/seo/share";

const SITE_DESCRIPTION =
  "We offer a FREE online Quoting Service platform and FREE Advertising for any local business or service provider. Sign up today to get started. ";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#86b953",
};

export const metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://zimbabwhere.com"),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  authors: [{ name: "Zimbabwhere Team" }],
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    type: "website",
    images: [DEFAULT_SHARE_IMAGE],
  },
  twitter: {
    // The card image is 4:3, the large card would crop the wordmark off
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_SHARE_IMAGE.url],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />

        <link rel="apple-touch-icon" href="/img/apple-touch-icon.png" />
      </head>
      <body>
        <ClientWrapper>{children}</ClientWrapper>
        <Analytics />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XJEZS0JHVS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XJEZS0JHVS');
          `}
        </Script>
      </body>
    </html>
  );
}
