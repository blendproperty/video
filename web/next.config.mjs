/** @type {import('next').NextConfig} */
const nextConfig = {
  // @remotion/bundler and @remotion/renderer spawn headless Chrome and use
  // native bindings — they must NOT be bundled by webpack/turbopack, just
  // required directly at runtime.
  serverExternalPackages: ['@remotion/bundler', '@remotion/renderer'],
};

export default nextConfig;
