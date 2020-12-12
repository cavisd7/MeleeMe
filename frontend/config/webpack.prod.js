'use strict';

process.env.NODE_ENV = 'production';

const path = require('path');
const fs = require('fs');

const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const appDir = fs.realpathSync(process.cwd());
const publicPath = '/';
const publicUrl = '';
const tsconfigPath = path.resolve(appDir, 'tsconfig.json');

module.exports = {
    mode: 'production',
    bail: false,
    devtool: 'source-map',
    entry: [path.resolve(appDir, 'src/index.tsx')],
    output: {
        path: path.resolve(appDir, 'build'),
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
        new ForkTsCheckerWebpackPlugin({
            async: true,
        }),
    ],
    node: {
        fs: 'empty',
        child_process: 'empty'
    },
    performance: {
        hints: 'error',
        maxEntrypointSize: 1180000,
        maxAssetSize: 1180000,
        assetFilter: function (assetFilename) {
            return !(
                assetFilename.endsWith('.chunk.js') || assetFilename.endsWith('.map')
            )
        }
    }
};