const nextConfig = {
  /* config options here */
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
    APP_NAME: process.env.APP_NAME,
    GG_CLIENT_ID: process.env.GG_CLIENT_ID,
    GG_CLIENT_SECRET: process.env.GG_CLIENT_SECRET,
  },
  // webpack: (config) => {
  //   // uglifyjs-webpack-plugin
  //   config.plugins = config.plugins.filter((p) => p.constructor.name !== 'UglifyJsPlugin')
  //   config.plugins.push(
  //     new UglifyJsPlugin({
  //       uglifyOptions: {
  //         exclude: /react\.js/,
  //         parallel: true,
  //         cache: true,
  //         sourceMap: false,
  //         compress: {
  //           arrows: false,
  //           booleans: false,
  //           collapse_vars: false,
  //           comparisons: false,
  //           hoist_funs: false,
  //           hoist_props: false,
  //           hoist_vars: false,
  //           if_return: false,
  //           inline: false,
  //           join_vars: false,
  //           keep_infinity: true,
  //           loops: false,
  //           negate_iife: false,
  //           properties: false,
  //           reduce_funcs: false,
  //           reduce_vars: false,
  //           sequences: false,
  //           side_effects: false,
  //           switches: false,
  //           top_retain: false,
  //           toplevel: false,
  //           typeofs: false,
  //           unused: false,

  //           // Switch off all types of compression except those needed to convince
  //           // react-devtools that we're using a production build
  //           conditionals: true,
  //           dead_code: true,
  //           evaluate: true,
  //         },
  //         mangle: true,
  //       },
  //     }),
  //   )
  //   return config
  // },
}

export default nextConfig
