const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  devServer: {
    contentBase: "./dist",
    port: 8080,
    disableHostCheck: true,
    host: '0.0.0.0'
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        context: "./browser/",
        from: "**/*.html",
        to: "."
      }
    ])
  ],
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  }
};
