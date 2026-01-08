import ClientWrapper from "./ClientWrapper";
import Script from "next/script";
import "@/styles/main.scss";

export const metadata = {
  title: "Zimbabwhere",
  description:
    "We offer Zimbabwe's first free online Quoting Service and free Business Advertising for all local businesses",
  authors: [{ name: "Zimbabwhere Team" }],
  openGraph: {
    title: "Zimbabwhere",
    description:
      "We offer Zimbabwe's first free online Quoting Service and free Business Advertising for all local businesses",
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
      "We offer Zimbabwe's first free online Quoting Service and free Business Advertising for all local businesses",
    images: ["img/zimbabwhere-logo.png"],
  },
  manifest: "/manifest.json",
  themeColor: "#86b953",
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
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TMHN7S5P"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
