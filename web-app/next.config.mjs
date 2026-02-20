import fs from 'fs';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.zimbabwhere.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    try {
      const redirectsPath = path.join(process.cwd(), 'src/lib/business-redirects.json');
      const fileContents = fs.readFileSync(redirectsPath, 'utf8');
      const manualRedirects = JSON.parse(fileContents);

      // Map the array to Next.js redirect objects
      return manualRedirects.map((business) => ({
        source: `/business/${business.id}`,
        destination: `/business/${business.slug}`,
        permanent: true,
      }));
    } catch (error) {
      console.error("Error loading business redirects from json:", error);
      return [];
    }
  },
};

export default nextConfig;
