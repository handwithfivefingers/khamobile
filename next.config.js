// const webpack = require('webpack');
// import webpack from 'webpack';
import path from "path";
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: [
      "via.placeholder.com", //facebook
      "placeholder.com",
      "scontent-atl3-2.xx.fbcdn.net", //facebook
      "pbs.twimg.com", //twitter
      "localhost",
    ],

    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  env: {
    port: process.env.PORT,
    host: process.env.HOST + ":" + process.env.PORT,
  },
};

export default nextConfig;
