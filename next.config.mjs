/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "exam-app.elevate-bootcamp.cloud",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
