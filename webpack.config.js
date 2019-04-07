const path = require("path")
const BrowserSyncPlugin = require("browser-sync-webpack-plugin")
const BannerPlugin = require("webpack").BannerPlugin
const package = require("./package.json")

module.exports = env => {
  return {
    entry: "./src/index.ts",
    mode: env.production ? "production" : "development",
    devtool: env.production ? "" : "inline-source-map",
    plugins: [
      new BrowserSyncPlugin({
        host: "localhost",
        port: 3000,
        server: { baseDir: ["."] },
        watch: true
      }),
      new BannerPlugin("Animflow v" + package.version)
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [".ts", ".js"]
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "animflow.js",
      library: "ANIMFLOW",
      libraryTarget: "umd",
      umdNamedDefine: true
    }
  }
}
