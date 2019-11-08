const webpack = require('webpack')
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const common = require('./webpack.common');
const util = require('./util')

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: util.resolve('dist'),
    filename: util.staticPath('js/[name].[chunkhash].js'),
    chunkFilename: util.staticPath('js/[id].[chunkhash].js')
  },
  plugins: [
    new webpack.DefinePlugin({
      'env.PRODUCTION': "true",
    }),
    new UglifyJSPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: util.staticPath('style/[name][hash].css'),
      chunkFilename: util.staticPath('style/[id].css')
    })
  ]
})