const merge = require('webpack-merge')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const common = require('./webpack.common')
const path = require('path');
const webpack = require('webpack')
const util = require('./util')
const config = require('./config')

const devServerConfig = {
  contentBase: util.resolve('dist'),
  clientLogLevel: 'warning',
  port: config.port,
  hot: true,
  host: '0.0.0.0',
  compress: true,
  open: config.open,
  quiet: true,
  overlay: {
    /**
     * Shows a full-screen overlay in the browser 
     * when there are compiler errors or warnings.
    */
    warnings: false,
    errors: true
  },
  proxy: config.proxy
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
        messages: [`App running at:\n\n - Local:   http://localhost:${devServerConfig.port}/\n - Network: http://${util.localAddress()}:${devServerConfig.port}`],
      },
      clearConsole: true
    })
  ],
  devServer: devServerConfig,
  devtool: "source-map",
});