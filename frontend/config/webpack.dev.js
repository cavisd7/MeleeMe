'use strict';

process.env.NODE_ENV = 'development';

const path = require('path');
const fs = require('fs');

const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const injectEnvironment = require('./env');

const appDir = fs.realpathSync(process.cwd());
const publicPath = '/';
const publicUrl = '';
const tsconfigPath = path.resolve(appDir, 'tsconfig.json');

const env = injectEnvironment();

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    entry: [ 
        path.resolve(appDir, 'src/index.tsx')
    ],
    devServer: {
        historyApiFallback:{
            index: '/'
        },
        //host: '0.0.0.0',
        //port: 3000,
    },
    output: {
        pathinfo: true,
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js',
        publicPath: '/'
    },
    resolve: {
        modules: ['node_modules'],
        extensions: [
            '.ts',
            '.tsx',
            '.js',
            '.jsx',
            '.svg'
        ],
        alias: {
            //'api/': paths.appApi,
        },
        plugins: [
            new TsconfigPathsPlugin({ configFile: tsconfigPath })//?
        ]
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                loader: require.resolve('babel-loader')
            },
            {
                test: /\.css$/,
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader')
                    },
                    {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                autoprefixer({
                                    flexbox: 'no-2009'
                                })
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 8192,
                    },
                  },
                ],
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack', 'url-loader'],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(appDir, 'public/index.html')
        }),
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
            PUBLIC_URL: publicUrl
        }),
        new webpack.DefinePlugin(env),
        new webpack.HotModuleReplacementPlugin(),
        new WatchMissingNodeModulesPlugin(path.resolve(appDir, 'node_modules')),
        new ForkTsCheckerWebpackPlugin({
            async: true,
            //memoryLimit: 4096,
            //watch: srcDir,
            //tsconfig: tsconfigPath,
            //tslint: paths.appTsLint
            //eslint: true
        }),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/node_modules\\/]/,
                    name: "vendor",
                    chunks: "initial"
                }
            }
        },
        runtimeChunk: {
            name: "manifest"
        }
    },
    node: {
        fs: 'empty'
    },
    performance: {
        hints: false
    }
};