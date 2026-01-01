/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "stage.justlime.com",
        port: "",
        pathname: "/zimbabwhere21/**",
      },
      {
        protocol: "https",
        hostname: "justlime.com",
        port: "",
        pathname: "/zimbabwhere21/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
