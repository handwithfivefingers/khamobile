// const webpack = require('webpack');
// import webpack from 'webpack';
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ['image/webp'],
    domains: [
      'via.placeholder.com', //facebook
      'placeholder.com',
      'scontent-atl3-2.xx.fbcdn.net', //facebook
      'pbs.twimg.com', //twitter
      'localhost',
      'journal-theme.com',
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.API,
        pathname: '/public/**',
      },
      {
        protocol: 'https',
        hostname: '**.journal-theme.com',
        pathname: '/**',
      },
    ],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  env: {
    NODE: process.env.NODE_ENV,
    port: process.env.PORT,
    host: process.env.HOST,
    API: process.env.API,
    GG_CLIENT_ID: process.env.GG_CLIENT_ID,
    GG_CLIENT_SECRET: process.env.GG_CLIENT_SECRET,
  },
}

export default nextConfig
