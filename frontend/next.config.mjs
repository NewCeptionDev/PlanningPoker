/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      // Due to usage of NGINX, the Origin and X-Forwarded-Host headers are not equal by default
      // Manually setting 127.0.0.1 to be allowed
      allowedOrigins: ['127.0.0.1'],
    },
  },
}

export default nextConfig
