# 从零开始配置`webpack` `react`开发环境

首先初始化项目

```
npm init
```

## 一、安装`webpack`

要安装最新版本或特定版本，请运行以下命令之一：

```bash
npm install --save-dev webpack
npm install --save-dev webpack@<version>
```

如果你使用 webpack 4+ 版本，你还需要安装 CLI。

```
npm install --save-dev webpack-cli
```

## 二、新建文件目录

```
mkdir ./src ./public ./src/components
vim ./src/index.js
vim ./src/components/HellowWord.js
vim ./public/index.html


# 文件目录格式
|-- Webpack
    |-- package-lock.json
    |-- package.json
    |-- webpack.config.js
    |-- public
    |-- src
        |-- index.js

```

```html
<!-- public/index.js-->
<body>
  <div id="app"></div>
</body>
```

```js
// src/index.js
import React from "react";
import HelloWorld from "./components/HellowWorld";

class App extends React.Component {
  render() {
    return <HelloWorld />;
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
```

```js
// src/components/HelloWorld.js

import React from "react";

export default class App extends React.Component {
  render() {
    return <h1>Hello World</h1>;
  }
}
```

## 三、配置加载器

### 3.1 构建简单的`webpack.common.js`配置文件

根据上述文件目录结构，新建配置文件 `public/webpack.common.js`

```js
const path = require("path");
const webpack = require("webpack");

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

module.exports = {
  entry: "./src/index.js",
  output: {
    path: util.resolve("dist"),
    filename: "[name].js",
    chunkFilename: "[chunkhash].js",
    jsonpFunction: "myWebpackJsonp"
  }
};
```

在`packge.json`添加

```js
"scripts": {
  "dev": "webpack --config ./build/webpack.common.js"
},
```

尝试运行`npm run dev`

```bash
ERROR in ./src/index.js 7:11
Module parse failed: Unexpected token (7:11)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
| class App extends React.Component {
|   render() {
>     return <HelloWorld />;
|   }
| }
```

`webpack`告诉我们需要使用加载器来处理该文件，针对 react 文件，需要使用`babel-loader`，对于其他的格式文件，需要进行配置。

由于配置中会用到一些工具，所以新建`/build/util.js`，引入`util.js`

```js
const path = require("path");

//返回项目根目录下的dir路径
exports.resolve = function(dir) {
  return path.join(__dirname, "..", dir);
};

//返回dits中文件路径下的dir路径
exports.staticPath = function(dir) {
  return path.join("static/", dir);
};
```

### 3.2 配置`babel-loader`

```cmd
npm install --save-dev babel-loader @babel/core @babel/preset-env @babel/preset-react
```

在`webpack.config.js`添加 babel 配置

```js
...

module: {
  rules: [
    {
      test: /\.js?$/,
      include: [util.resolve('src')],
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }
    }
  ]
}
...
```

### 3.3 配置`.css` `.scss`文件 loader

- [`sass-loader`](https://www.webpackjs.com/loaders/scss-loader/)
- [`css-loader`](https://www.webpackjs.com/loaders/css-loader/)
- [`style-loader`](https://www.webpackjs.com/loaders/style-loader/)

`sass-loader`依赖`node-sass`，由于这个包存放在 github 上，下载速度比较慢，可使用淘宝源下载

```
npm install sass-loader node-sass css-loader style-loader --save-dev --registry https://registry.npm.taobao.org
```

在`webpack.config.js`rules 添加配置

```js
...

  {
    test: /\.css$/,
    use: [{ loader: "style-loader" }, { loader: "css-loader" }]
  },
  {
    test: /\.scss$/,
    use: [
      { loader: "style-loader" }, // 将 JS 字符串生成为 <style> 节点
      { loader: "css-loader" }, // 将 CSS 转化成 CommonJS 模块
      { loader: "sass-loader" } // 将 Sass 编译成 CSS
    ]
  }

...
```

### 3.4 配置图片文件的加载

**关于图片或文件的相关`loader`：**

- [`file-loader`](https://www.webpackjs.com/loaders/file-loader/)默认情况下，生成的文件的文件名就是文件内容的 MD5 哈希值并会保留所引用资源的原始扩展名。

- [`url-loader`](https://www.webpackjs.com/loaders/url-loader/) 功能类似于 file-loader，但是在文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL。⚠️ 注意`url-loader`依赖 `file-loader`

这里选择使用`url-loader`

```bash
npm install --save-dev url-loader file-loader
```

在`webpack.config.js`rules 添加配置

```js
...

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

...
```

## 四、开发环境构建

区分`production`和 `development`环境下的配置

```
vim ./build/webpack.dev.js ./build/webpack.prod.js
```

### 4.1 安装相关功能依赖

```
# 用于合并webpack配置
npm install --save-dev webpack-merge

# 分别用于构建时清除dist目录和拷贝处理index.html
npm install --save-dev clean-webpack-plugin html-webpack-plugin

# 用于启动开发服务器
npm install --save-dev webpack-dev-server

# 用于开发时模块热重载
npm install --save-dev hot-module-replacement-plugin

# 产品模式压缩js
npm install --save-dev uglifyjs-webpack-plugin

# 提取css、压缩css（替代ExtractTextWebpackPlugin）
npm install --save-dev mini-css-extract-plugin

# 注入process.env变量
npm install --save-dev cross-env
```

⚠️ 需要注意的是：在 css 文件的`loader`配置中`MiniCssExtractPlugin.loader`与`style-loader`不能同时使用。

修改`webpack.common.js`
```js

const devMode = process.env.NODE_ENV !== 'production'
...
//rules
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
    { loader: "css-loader" }, // 将 CSS 转化成 CommonJS 模块
    { loader: "sass-loader" } // 将 Sass 编译成 CSS
  ]
},
...

...
plugins: [
  new HtmlWebpackPlugin({
    template: util.resolve('public/index.html'),
    filename: util.resolve('dist/index.html'),
    favicon: util.resolve('public/favicon.ico')
  }),
],
resolve: {
  extensions: [".js", ".json", ".jsx", ".css"],
  alias: {
    '@': util.resolve('src')//路径别名 可添加 jsconfig.json 配合编辑器提供路径提示功能
  }
},
...
```

分别添加`webpack.prod.js` `webpack.dev.js`文件

webpack.prod.js

```js
const merge = require("webpack-merge");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const common = require("./webpack.common.js");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
  mode: "production",
  output: {
    path: util.resolve("dist"),
    filename: util.staticPath("js/[name].[chunkhash].js"),
    chunkFilename: util.staticPath("js/[id].[chunkhash].js")
  },
  plugins: [
    new webpack.DefinePlugin({
      'env.PRODUCTION': "true",
    }),
    new UglifyJSPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: util.staticPath("style/[name].css"),
      chunkFilename: util.staticPath("style/[id].css")
    })
  ]
});
```

webpack.dev.js

```js
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack);

module.exports = merge(common, {
  mode: "development",
  devServer: {
    contentBase: "./dist"
  },
  pluging: [new webpack.HotModuleReplacementPlugin()],
  devtool: "source-map"
});
```

### 4.2 修改`scripts`

```json

"dev": "cross-env NODE_ENV=development webpack-dev-server --config ./build/webpack.dev.js"
"build": "cross-env NODE_ENV=production webpack --config ./build/webpack.prod.js"

```

现在执行`npm run dev`将会得到一个简单的开发环境

## 五、功能的进一步完善

到此为止我们完成了一个简单的配置，在开发环境下实现热重载、加载样式文件，生产环境下代码压缩、自动拷贝`index.html`并注入`script`、打包自动清理`dist`文件夹。下面继续完善相关的功能。

### 配置`devserver`

配置如下，命令行只显示警告或错误信息，同时使用`friendly-errors-webpack-plugin`插件，自动清除信息，并自定义显示信息内容。

```
npm install --save-dev friendly-errors-webpack-plugin
```

webpack.dev.js

```js
const devServerConfig = {
  contentBase: util.resolve("dist"),
  clientLogLevel: "warning",
  port: 3000,
  hot: true,
  host: "localhost",
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
    "/base": {
      target: "https://test.cn",
      secure: true,
      changeOrigin: true,
      pathRewrite: {
        "^/base": ""
      }
    }
  }
};

module.exports = merge(common, {
  mode: "development",
  plugins: [
    new webpack.DefinePlugin({
      "env.PRODUCTION": "false"
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [
          `You application is running here http://${devServerConfig.host}:${devServerConfig.port}`
        ]
      },
      clearConsole: true
    })
  ],
  devServer: devServerConfig,
  devtool: "source-map"
});
```

### 配置`buils.js`文件

安装依赖

```
npm install --save-dev chalk ora
```

新建`build/build.js`，修改`scripts.build` `cross-env NODE_ENV=production node ./build/build.js`，`ora`能在命令行显示的加载动画，`chalk`能够输出带有颜色的文字或消息。

```js
const webpack = require("webpack");
const webpackConfig = require("./webpack.prod");
const ora = require("ora");
const chalk = require("chalk");

const spinner = ora("buildind...");
spinner.start();

webpack(webpackConfig, (err, stats) => {
  spinner.stop();
  if (err) throw err;
  process.stdout.write(
    stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + "\n\n"
  );

  if (stats.hasErrors()) {
    console.log(chalk.red("  Build failed with errors.\n"));
    process.exit(1);
  }

  console.log(chalk.cyan("  Build complete.\n"));
});
```

## 本机地址访问

首先需要获取本机地址，`nodejs` [`os`](https://nodejs.org/dist/latest-v12.x/docs/api/os.html#os_os_networkinterfaces) 模块提供了相关的功能。

build/util.js
```js
...
const os = require('os')
...

exports.localAddress = function(dir) {
  var network = os.networkInterfaces()
  for (var key in network) {
    for (var i = 0; i < network[key].length; i++) {
      var item = network[key][i]
      if(item.family === 'IPv4'&& item.address !== '127.0.0.1' && !item.internal){
        return item.address
      }
    }
  }
}

```

修改`devServerConfig.host`为`'0.0.0.0'`，再修改`FriendlyErrorsPlugin`配置

/build/webpack.dev.js
```js
...
new FriendlyErrorsPlugin({
  compilationSuccessInfo: {
    messages: [`App running at:\n\n - Local:   http://localhost:${devServerConfig.port}/\n - Network: http:/{util.localAddress()}:${devServerConfig.port}`],
  },
  clearConsole: true
})
...
```
## 添加`eslint`

具有完备的`eslint`配置可以极大程度上规范编码格式，同时配合编辑器的保存自动根据配置修复，开发体验较好，如果不想使用`eslint`可以在`webpack.dev.js`中设置（不推荐）

安装相关插件
```
npm install --save-dev eslint eslint-friendly-formatter eslint-loader eslint-plugin-react
```

`eslint-loader`配合`eslint-friendly-formatter`能够在编译时将代码与`eslintrc`冲突的错误显示在命令行

修改webpack.common.js
```js
...
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
...
// 可以通过提取一个config配置文来单独开关相关功能而不需要直接修改配置文件
rules:[
  ...(config.eslint ? [createLintingRule()] : []),
  ...
]
...
```