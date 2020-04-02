let path = require("path");

let config = {
   entry: "./index.js",
   module: {
      rules: [
         {
            test: /\.js?/,
            loader: "babel-loader",
            query: {
               presets: ["@babel/react"],
            },
         },
      ],
   },
   output: {
      filename: "bundle.js",
      path: __dirname + "/public",
   },
};

module.exports = config;
