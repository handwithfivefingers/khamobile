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
    GG_CLIENT_ID: process.env.GG_CLIENT_ID,
    GG_CLIENT_SECRET: process.env.GG_CLIENT_SECRET,
    // GG_CLIENT_ID='499784443670-mtsk6fbmrhfu32oed349tvtduqj4snpl.apps.googleusercontent.com'
    // GG_CLIENT_SECRET='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'
  },
}

export default nextConfig
