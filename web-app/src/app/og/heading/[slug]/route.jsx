import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getHeadingBySlug } from "@/lib/endpoints/headings";
import { decodeHtml } from "@/lib/utils/decodeHtml";

// 1200x630 share image for a heading, e.g. /og/heading/mechanic
const SIZE = { width: 1200, height: 630 };

// Long headings need a smaller font to fit on the card
const getFontSize = (name) => {
  if (name.length > 48) return 56;
  if (name.length > 32) return 68;
  if (name.length > 20) return 84;
  return 100;
};

const LOGO_FILE = ["public", "img", "logo-white.png"];

async function getLogoDataUri() {
  try {
    const buffer = await readFile(path.join(process.cwd(), ...LOGO_FILE));
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch {
    // Not on disk in this environment, fall back to the live site
    try {
      const siteUrl = process.env.SITE_URL || "https://zimbabwhere.com";
      const response = await fetch(`${siteUrl}/img/logo-white.png`);
      if (!response.ok) return null;
      const buffer = Buffer.from(await response.arrayBuffer());
      return `data:image/png;base64,${buffer.toString("base64")}`;
    } catch (error) {
      console.error("Could not load logo for share image:", error);
      return null;
    }
  }
}

export async function GET(request, { params }) {
  const { slug } = await params;
  const heading = await getHeadingBySlug(slug);

  if (!heading) {
    return new Response("Heading not found", { status: 404 });
  }

  const name = decodeHtml(heading.label || heading.title);
  const logo = await getLogoDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#2e2e2e",
          borderLeft: "24px solid #2cb75f",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {logo && (
            <img src={logo} width={96} height={96} style={{ marginRight: 24 }} />
          )}
          <div
            style={{
              display: "flex",
              fontSize: 40,
              letterSpacing: 4,
              color: "#b9db96",
            }}
          >
            ZIMBABWHERE.COM
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: getFontSize(name),
            fontWeight: 700,
            lineHeight: 1.1,
            color: "#ffffff",
          }}
        >
          {name}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 36,
            color: "#2cb75f",
          }}
        >
          Find local businesses and get free quotes in Zimbabwe
        </div>
      </div>
    ),
    {
      ...SIZE,
      headers: {
        "Cache-Control":
          "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
