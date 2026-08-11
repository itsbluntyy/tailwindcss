/** @type {import('next').NextConfig} */
const nextConfig = {
  // Native/driver packages must stay external to the server bundle.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-libsql", "@libsql/client", "libsql"],
  experimental: {
    serverActions: {
      // Photo uploads go through server actions; Vercel functions accept
      // request bodies up to ~4.5 MB, so cap just under that.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
