const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const resolve = (dir) => path.join(__dirname, dir);
const isProd = process.env.NODE_ENV === "production";

// 生产环境去掉 console.log
const getOptimization = () => {
  let optimization = {};
  if (isProd) {
    optimization = {
      minimize: true, // 不混淆压缩js代码
      // https://webpack.docschina.org/configuration/optimization/#optimization-minimizer
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
            compress: {
              warnings: false,
              drop_console: false, // 打开console
              drop_debugger: true,
              // pure_funcs: ['console.log'] // 测试开发暂时放开console限制
            },
          },
        }),
      ],
    };
  }
  return optimization;
};

module.exports = {
  publicPath: "./",
  assetsDir: "static",
  lintOnSave: !isProd,
  productionSourceMap: false,
  devServer: {
    open: process.platform === "darwin",
    host: "0.0.0.0",
    port: 8080,
    https: false,
    hotOnly: false,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      // test 测试
      "shop/": {
        target: "http://10.20.37.226:8301/",
        changeOrigin: true,
      },
      "vipstu/v1/": {
        target: "http://10.20.37.227:8088/",
        changeOrigin: true,
      },
    },
  },
  // 全局导入scss
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [
        path.resolve(__dirname, "./src/assets/scss/base.scss"),
        path.resolve(__dirname, "./src/assets/scss/variable.scss"),
      ],
    },
  },
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: isProd,
    // 开启 CSS source maps?
    sourceMap: isProd,
    // css预设器配置项
    // loaderOptions: {
    //   scss: {
    //     prependData: '@import "~@/scss/base.scss";'
    //   }
    // }
  },
  chainWebpack: (config) => {
    // 分析打包后的大小
    config.when(process.env.IS_ANALYZ, (config) =>
      config.plugin("webpack-bundle-analyzer").use(BundleAnalyzerPlugin, [
        {
          analyzerPort: 8887,
          generateStatsFile: false,
        },
      ])
    );
    // 设置文件别名
    config.resolve.alias
      .set("@", resolve("./src"))
      .set("assets", resolve("./src/assets"));
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "windows.jQuery": "jquery",
      }),
      // 我们只需要momentjs的中文语言就行
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
    ],
    optimization: getOptimization(),
  },
};
