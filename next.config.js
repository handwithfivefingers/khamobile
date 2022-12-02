// const webpack = require('webpack');
// import webpack from 'webpack';
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
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
    port: process.env.PORT,
    host: process.env.HOST + ':' + process.env.PORT,
    API: process.env.API,
  },
}

export default nextConfig
