const merge = require('webpack-merge')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const common = require('./webpack.common')
const path = require('path');
const webpack = require('webpack')
const util = require('./util')

console.log(process.env.NODE_ENV)

const devServerConfig = {
  contentBase: util.resolve('dist'),
  clientLogLevel: 'warning',
  port: 3000,
  hot: true,
  host: 'localhost',
  open: false,
  quiet: true,
  overlay: {
    /**
     * Shows a full-screen overlay in the browser 
     * when there are compiler errors or warnings.
    */
    warnings: false,
    errors: true
  },
  proxy: {
    // detail: https://www.webpackjs.com/configuration/dev-server/#devserver-proxy
    '/base': {
      target: 'https://test.cn',
      secure: true,
      changeOrigin: true,
      pathRewrite: {
        '^/base': ''
      }
    },
  }
}

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      'env.PRODUCTION': "false",
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`You application is running here http://${devServerConfig.host}:${devServerConfig.port}`],
      },
      clearConsole: true
    })
  ],
  devServer: devServerConfig,
  devtool: "source-map",
});