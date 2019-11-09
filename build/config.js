module.exports = {
  eslint: true,
  port: 3000,
  open:false,
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