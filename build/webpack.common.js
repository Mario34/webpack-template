const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const util = require('./util')
const devMode = process.env.NODE_ENV !== 'production'
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require('./config')

const createLintingRule = () => ({
  test: /\.(js|ts|jsx)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [util.resolve('src')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: true
  }
})

module.exports = {
  entry: util.resolve('src/index.js'),
  output: {
    path: util.resolve('dist'),
    filename: '[name].js',
    chunkFilename: "[chunkhash].js",
    jsonpFunction: "myWebpackJsonp",
  },
  module: {
    rules: [
      ...(config.eslint ? [createLintingRule()] : []),
      {
        test: /\.js?$/,
        include: [
          util.resolve('src')
        ],
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },
      {
        test: /\.scss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          // { loader: "style-loader" }, // 将 JS 字符串生成为 style 节点
          { loader: "css-loader" }, // 将 CSS 转化成 CommonJS 模块
          { loader: "sass-loader" } // 将 Sass 编译成 CSS
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 6000,
              name: util.staticPath('images/[name][hash].[ext]'),
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".json", ".jsx", ".css"],
    alias: {
      '@': util.resolve('src')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: util.resolve('public/index.html'),
      filename: util.resolve('dist/index.html'),
      favicon: util.resolve('public/favicon.ico'),
      minify: devMode ? false : {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    })
  ]
};