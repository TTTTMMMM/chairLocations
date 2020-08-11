const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
let DIST_DIR = path.resolve(__dirname, "dist");
const SRC_DIR = path.resolve(__dirname, "src");

module.exports = {
   entry: {
      index: SRC_DIR + "/assets/js/index.tsx",
      fourofour: SRC_DIR + "/assets/js/404.tsx",
   },
   output: {
      path: __dirname + "/dist",
      filename: "[name].js",
   },
   resolve: {
      extensions: [".ts", ".tsx", ".js", ".json"],
   },
   module: {
      rules: [
         {
            test: /\.(ts|js)x?$/,
            loader: "babel-loader",
            exclude: /node_modules/,
         },
         {
            test: /\.css$/,
            loaders: ["style-loader", "css-loader"],
         },
         {
            test: /\.(jpe?g|png|gif|svg)$/i,
            use: [
               {
                  loader: "url-loader",
                  options: {
                     limit: 8000, // Convert images < 8kb to base64 strings
                     name: "images/[hash]-[name].[ext]",
                     esModule: false,
                  },
               },
            ],
         },
      ],
   },
   plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
         inject: true,
         template: path.join(SRC_DIR, "index.html"),
         chunks: ["index"],
         filename: "index.html",
         favicon: SRC_DIR + "/assets/images/chairIcon.png",
         title: "CL",
      }),
      new HtmlWebpackPlugin({
         inject: true,
         template: SRC_DIR + "/404.html",
         chunks: ["fourofour"],
         filename: "404.html",
         favicon: SRC_DIR + "/assets/images/chairIcon.png",
         title: "404",
      }),
      new CopyWebpackPlugin({
         patterns: [
            { from: SRC_DIR + "/assets/images", to: DIST_DIR + "/images" },
         ],
      }),
      new ForkTsCheckerWebpackPlugin(),
   ],
   mode: "production",
};
