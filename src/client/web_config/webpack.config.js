'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const fs = require('fs');


//multi-thread build
const HappyPack = require('happypack');
const os = require('os');

const happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
});

module.exports = {
    entry: {
        app: path.resolve(__dirname, '../web/index.js'),
        vendor_1: ['babel-polyfill', 'react', 'react-dom','react-router','react-router-dom'],
        vendor_2: ['jquery','axios','redux','redux-thunk','react-redux','immutable','redux-immutable'], 
        //vendor_3: ['apollo-client','apollo-link','apollo-link-http','apollo-link-state','apollo-link-ws','apollo-utilities','graphql','graphql-tag','react-apollo','apollo-cache-inmemory'],
        //vendor_4: ['antd'] remove antd as sperate vendor could accelerate package size.
    },
    output: {
        path: path.resolve(__dirname, '../../../dist'),
        publicPath: '/',
        filename: 'js/[name].[hash].js',
        chunkFilename: 'js/[name].[hash].bundle.js',
    },
    resolve: {
        alias: {
            service: path.resolve(__dirname, '../web/src/client/service'),
            component: path.resolve(__dirname, '../web/src/component'),
            util: path.resolve(__dirname, '../web/src/client/util')
        }
    },
    module: {
        rules: [
            // eslint进行代码格式检查
            {
                test: /\.jsx?$/,
                enforce: 'pre',
                use: [{
                    loader: 'eslint-loader',
                    options: {
                        fix: true
                    }
                }],
                include: [path.resolve(__dirname, '../web')], // 指定检查的目录
                exclude: /node_modules/
            },
            // react(jsx)& Other ES6/7 语法的处理
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    babelrc: false,
                    presets: ["env", "react"], 
                    plugins: [
                        ["transform-class-properties", { "spec": true }],
                        ["transform-decorators-legacy"],
                        ["transform-object-rest-spread"],
                        ["syntax-dynamic-import"],
                        ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]   
                    ]
                }
            },
            // graphql
            {
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                loader: 'graphql-tag/loader'
            },
            // css文件的处理
            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader?minimize"
                })
            },
            // sass文件的处理
            {
                test: /\.scss$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?minimize', 'sass-loader']
                })
            },
            // less文件的处理
            {
                test: /\.less$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader?minimize',
                        {
                            loader: 'less-loader',
                            options: {
                                javascriptEnabled: true
                            }
                        }
                    ]
                })
            },
            // 图片的配置
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: 'resource/[name].[ext]'
                    }
                }]
            },
            // 字体图标的配置
            {
                test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: 'resource/[name].[ext]'
                    }
                }]
            }
        ]
    },
    plugins: [
        // Multi-thread
        new HappyPack({
            id: 'js',
            loaders: ['babel-loader?cacheDirectory=true'],
            threadPool: happyThreadPool,
            verbose: true
        }),

        // 处理html文件 
        new HtmlWebpackPlugin({
            template: './web/index.html',
            //favicon: './web/favicon.ico'
        }),
        // 独立css文件
        new ExtractTextWebpackPlugin({
            filename: "css/[name].css",
            allChunks: true
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new UglifyjsWebpackPlugin({
            parallel: true,
        })
    ],
    devServer: {
        host: '0.0.0.0',
        port: 8000,
        compress: true,
        https: {
            cert: fs.readFileSync(__dirname + '/../../../config/cert/server.crt'),
            key: fs.readFileSync(__dirname + '/../../../config/cert/server.key'),
            //ca: fs.readFileSync(__dirname + '/../../../config/cert/ca.pem'),
        },
        hot: true,
        //open : true,
        inline: true,
        historyApiFallback: {
            index: '/index.html'
        },
        contentBase: path.resolve(__dirname, '../../../dist'),
        proxy: [
            {
                path: '/api/*',
                target: 'https://localhost:3000',
                secure: false,
            },{
                path:'/auth/*',
                target: 'https://localhost:3000',
                secure: false,
            },{
                path: '/file/*',
                target: 'https://localhost:3000',
                secure: false,
            },{
                path: '/socket.io/*',
                target: 'https://localhost:3000',
                secure: false,
            },{
                path:'/api/graphql_sub' ,
                target: 'wss://localhost:3000',
                secure: false,
                ws: true,
            }
        ]
    },
    optimization: {
        minimize: true,
        runtimeChunk: {
            name: "manifest"
        },
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "common",
                    chunks: "initial",
                    minChunks: 2
                }
            }
        }
    }
};
