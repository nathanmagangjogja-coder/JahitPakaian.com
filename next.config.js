/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Halaman portofolio berganti nama dari "Hasil Jahitan" menjadi "Hasil Produksi".
      { source: "/hasil-jahitan", destination: "/hasil-produksi", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

module.exports = nextConfig;
