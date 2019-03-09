const path = require('path');
const devMode = process.env.NODE_ENV !== 'production'
// const devMode = true
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/pages/index/index.js',
    main: './src/pages/page1/main.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/pages/index/index.html',
      filename: 'index.html',
      inject: true,
      hash: true,
      chunks: ['vendor','common','runtime','index'],
      minify: process.env.NODE_ENV !== "production" ? false : {
          removeComments: true, 
          // collapseWhitespace: true, 
          removeAttributeQuotes: true, 
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/page1/main.html',
      filename: 'main.html',
      inject: true,
      hash: true,
      chunks: ['vendor','common','runtime','main'],
      minify: process.env.NODE_ENV !== "production" ? false : {
          removeComments: true, 
          // collapseWhitespace: true, 
          removeAttributeQuotes: true, 
      }
    }),

  ],
  output: {
    filename: devMode ? 'js/[name].[hash:8].js': 'js/[name].[chunkhash:8].js',
    chunkFilename: devMode ? 'js/[name].[hash:8].js': 'js/[name].[chunkhash:8].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: './'
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
          vendor: { // 抽离第三方插件
              test: /node_modules/, // 指定是node_modules下的第三方包
              chunks: 'initial',
              name: 'vendor', // 打包后的文件名，任意命名    
              // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
              priority: 10
          },
          utils: { // 抽离自己写的公共代码，common这个名字可以随意起
              chunks: 'initial',
              name: 'common', // 任意命名
              minSize: 0, // 只要超出0字节就生成一个新包
              minChunks: 2
          }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            options: {
              sourceMap: true,
              publicPath: '../'
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: [
                require('postcss-preset-env')()
              ]
            }
          }
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          { 
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '[name].img.[hash:5].[ext]',
              outputPath: 'img',
            }
          },
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              }
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'css/font/[name].font.[hash:6].[ext]',
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'img:data-src'],
            }
          }
        ]
      }
    ]
  },  

};