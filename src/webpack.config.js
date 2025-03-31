const path = require('path');
const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer/"),
      "assert": require.resolve("assert/"),
      "os": require.resolve("os-browserify/browser")
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ]
};
