/* eslint-disable */
const withLess = require('@zeit/next-less');
const lessToJS = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './assets/antd-custom.less'), 'utf8'),
);

module.exports = withLess({
  env: {
    SERVER_URL: process.env.SERVER_URL,
    WS_SERVER_URL: process.env.WS_SERVER_URL,
    GQL_URI: process.env.GQL_URI,
    GQL_WS_URI: process.env.GQL_WS_URI,
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: themeVariables, // make your antd custom effective
  },
  webpack: (config, { isServer }) => {
    console.info('next building ~ SERVER_URL:', process.env.SERVER_URL);
    if (isServer) {
      const antStyles = /antd\/.*?\/style.*?/;
      const origExternals = [...config.externals];
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback();
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback);
          } else {
            callback();
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals),
      ];

      config.module.rules.unshift({
        test: antStyles,
        use: 'null-loader',
      });
    }
    for (let i = 0; i < config.plugins.length; i++) {
      const p = config.plugins[i];
      if (!!p.constructor && p.constructor.name === MiniCssExtractPlugin.name) {
        const miniCssExtractOptions = { ...p.options, ignoreOrder: true };
        config.plugins[i] = new MiniCssExtractPlugin(miniCssExtractOptions);
        break;
      }
    }

    return config;
  },
  exportPathMap: async function() {
    return {
      '/dashboard': { page: '/dashboard' },
      '/index': { page: '/index' },
      '/': { page: '/' },
    };
  },
});
