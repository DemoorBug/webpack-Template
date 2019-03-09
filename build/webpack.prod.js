const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Purifycss = require('purifycss-webpack')
const glob = require('glob-all')
const copyWebpackPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist/*'],{
      root: path.resolve(__dirname, '../'), //根目录
      verbose: true, //开启在控制台输出信息
      dry: false,
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
      chunkFilename: "css/[name].[contenthash:8].css",
    }),
    new copyWebpackPlugin([{
        from: path.resolve(__dirname, "../src/assets"),
        to: './assets',
        // ignore: ['.*']
    }]),
    new copyWebpackPlugin([{
        from: path.resolve(__dirname, "../src/pages/assets"),
        to: './',
        ignore: ['.*']
    }]),
    new Purifycss({
      paths: glob.sync([
        path.join(__dirname, '../src/*.html'),
        path.join(__dirname, '../src/*.js')
      ])
    }),
  ]
});