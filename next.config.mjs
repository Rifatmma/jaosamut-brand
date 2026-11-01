/** Public portfolio. Fully static export: no server, no API routes, no database, no login. */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
}
export default nextConfig
