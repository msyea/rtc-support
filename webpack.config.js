const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./scripts/index.js",
  devServer: {
    contentBase: "./dist"
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
