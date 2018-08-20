const path = require("path")

module.exports = [
  {
    entry: "./src/index.js",
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
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "ville.sv.js"
    }
  }
]