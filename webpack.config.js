const path = require("path")

module.exports = [
  {
    entry: "./src/index.ts",
    mode: "production",
    //devtool: "inline-source-map",
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
      filename: "ville.js",
      library: "VILLE",
      libraryTarget: "umd",
      umdNamedDefine: true
    }
  },
  {
    entry: "./src/language/language-sv.js",
    mode: "production",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "ville.sv.js"
    }
  }
]