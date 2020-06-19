// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
const aLiYun = 'https://expresslnt.market.alicloudapi.com'; // 阿里云物流地址

module.exports = {
  build: {
    env: require('./prod.env'),
    // env: require('./dev.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 9999,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        target: 'http://xfm-erp.vip:8081',  // 请求本地 需要xmall后台项目 默认127.0.0.1:7777 
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/aly': {  //     http://messageboy8080.tunnel.jumbo-soft.com/
        target: 'http://kdwlcxf.market.alicloudapi.com',
        changeOrigin: true,
        pathRewrite: {
          '^/aly': '',
        },
      }
      // '/apos': {
      //   target:'http://xmall.exrick.cn',
      //   // target: 'http://h8080.tunnel.jumbo-soft.com',  // 请求本地 需要xmall后台项目 默认127.0.0.1:7777 
      //   changeOrigin:true,
      //   pathRewrite:{
      //       '^/apos':''
      //   }
      // }
      // '/goods/*': {
      //   target: 'http://xmall.exrick.cn'  // 请求本地 需要xmall后台项目 默认127.0.0.1:7777
      // }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
