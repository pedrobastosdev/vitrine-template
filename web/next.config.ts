import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  // As páginas vêm do cache, então entregar os metadados no <head> para todos não custa nada.
  htmlLimitedBots: /.*/,
  partialPrefetching: true,
  images: {
    qualities: [50, 75],
    // As fotos já chegam redimensionadas pelo CDN de origem (ver lib/imagem-loader.ts)
    loader: 'custom',
    loaderFile: './lib/imagem-loader.ts',
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  experimental: {
    serverActions: {
      // Fotos são comprimidas no navegador (~1 MB), bem abaixo do limite da Vercel
      bodySizeLimit: '4mb',
    },
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
