import { Analytics } from "@vercel/analytics/next";
import ClientWrapper from "./ClientWrapper";
import Script from "next/script";
import "@/styles/main.scss";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#86b953",
};

export const metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://zimbabwhere.com"),
  title: "Zimbabwhere",
  description:
    "We offer a FREE online Quoting Service platform and FREE Advertising for any local business or service provider. Sign up today to get started. ",
  authors: [{ name: "Zimbabwhere Team" }],
  openGraph: {
    title: "Zimbabwhere",
    description:
      "We offer a FREE online Quoting Service platform and FREE Advertising for any local business or service provider. Sign up today to get started. ",
    type: "website",
    images: [
      {
        url: "img/zimbabwhere-logo.png",
        alt: "Zimbabwhere",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zimbabwhere",
    description:
      "We offer a FREE online Quoting Service platform and FREE Advertising for any local business or service provider. Sign up today to get started. ",
    images: ["img/zimbabwhere-logo.png"],
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
