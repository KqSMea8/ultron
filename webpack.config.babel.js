/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The javascript of build.development.config.js
 */

import path from 'path';
import { ContextReplacementPlugin, HotModuleReplacementPlugin, optimize } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import webpackMerge from 'webpack-merge';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ApplicationContext from './resources/application-context.json';
import moduleRules from './webpack/webpack.module.rules';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import thorMock from './thor.mock';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

const NODE_MODULES_PATH = path.resolve(__dirname, 'node_modules');
const isDev = process.env.IS_DEV === '1' || process.env.NODE_ENV === 'development';
const QTPLUG_MODULE = path.resolve(NODE_MODULES_PATH, './@didi/qt-plug-slider');

const ROOT_PATH = path.resolve(__dirname, './');
const DIST_PATH = isDev ? path.resolve(ROOT_PATH, 'distdev') : path.resolve(ROOT_PATH, '__tmp__');

const devServer4Mock = {};
if (isDev) {
    function getMockParsed(key) {
        const keyParsed = key.match(/(\w+)\s+(.*)/);
        if (keyParsed && keyParsed.length >= 3) {
            return {
                path: keyParsed[2],
                method: keyParsed[1].toLowerCase(),
                value: thorMock[key].origin || thorMock[key]
            };
        } else {
            throw new Error(`"${ key }"必须由Http method和request path组成，中间用空格分割。`);
        }
    }

    if (process.env.NO_PROXY === 'true') { // remote proxy
        const proxy = {};
        Object.keys(thorMock).forEach((key) => {
            const parsedValue = getMockParsed(key);
            proxy[parsedValue.path] = {
                target: parsedValue.value,
                logLevel: 'debug',
                changeOrigin: true,
                xfwd: true,
                headers: thorMock[key].headers
            };
        });
        devServer4Mock.proxy = proxy;
    } else { // local mock
        devServer4Mock.before = (app) => {
            Object.keys(thorMock).forEach((key) => {
                const parsedValue = getMockParsed(key);
                app[parsedValue.method](parsedValue.path, (req, res) => {
                    const mockValue = parsedValue.value;
                    if (Object.prototype.toString.call(mockValue) === '[object Function]') {
                        mockValue.apply(app, arguments);
                    } else {
                        res.json(mockValue);
                    }
                });
            });
        };
    }
}

const minimizer = [new OptimizeCssAssetsPlugin({})];
if (!isDev) {
    minimizer.push(
        new UglifyJsPlugin({
            parallel: true,
            sourceMap: true,
            cache: true,
            exclude: /\.min\.js/
        })
    );
}
const plugins = [
    // new ContextReplacementPlugin(
    //     /moment[/\\]locale$/,
    //     /zh-cn/
    // ),
    new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'assets/size.html',
        openAnalyzer: false
    }),
    new CaseSensitivePathsPlugin(),
    new ContextReplacementPlugin(/(\/|\\)src(\/|\\|$)/, path.resolve(__dirname, 'src')),
    new HtmlWebpackPlugin({
        title: ApplicationContext.appName,
        template: 'resources/template.html',
        filename: 'index.html',
        inject: true
    }),
    new HtmlWebpackPlugin({
        title: ApplicationContext.appName,
        template: 'resources/template.html',
        filename: 'new.html',
        inject: true
    }),

    new ForkTsCheckerWebpackPlugin({
        tsconfig: path.resolve(ROOT_PATH, 'tsconfig.json'),
        tslint: path.resolve(ROOT_PATH, isDev ? 'tslint.json' : 'tslint.pro.json'),
        checkSyntacticErrors: true
    }),
    new MiniCssExtractPlugin({
        filename: 'assets/[name].css'
    }),
    new CopyWebpackPlugin([{
        from: path.resolve(ROOT_PATH, 'public'),
        to: path.resolve(DIST_PATH, 'assets'),
        toType: 'dir'
    }]),
    new optimize.OccurrenceOrderPlugin(),
    new optimize.ModuleConcatenationPlugin(),
    new CleanWebpackPlugin(['__tmp__'], { root: ROOT_PATH })
];
if (isDev) {
    plugins.push(
        new HotModuleReplacementPlugin()
    );
}

export default webpackMerge({
    // Expose __dirname to allow automatically setting basename.
    context: __dirname,
    devtool: isDev ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
    entry: {
        main: [
            './src/Application.tsx'
        ]
    },
    output: {
        filename: 'assets/[name].js', // filename: 'assets/[name].[chunkhash:8].js',
        chunkFilename: 'assets/[name].js',
        path: DIST_PATH,
        publicPath: '/'
    },
    mode: process.env.NODE_ENV,
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.css', '.less', '.json'],
        modules: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'tests'),
            path.resolve(__dirname, 'public'),
            NODE_MODULES_PATH
        ],
        alias: {
            'moment': path.resolve(NODE_MODULES_PATH, 'moment/min/moment.min.js'),
            'echarts': path.resolve(NODE_MODULES_PATH, 'echarts/dist/echarts.min.js'),
            '@antd': path.resolve(NODE_MODULES_PATH, 'antd/es'),
            '@ria': path.resolve(__dirname, 'src/com/didichuxing/ria'),
            '@ultron': path.resolve(__dirname, 'src/com/didichuxing/ultron')
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                enforce: 'pre',
                use: {
                    loader: 'tslint-loader',
                    options: {
                        configuration: require('./tslint.json'),
                        tsConfigFile: path.resolve(__dirname, 'tsconfig.json')
                    }
                }
            },
            {
                test: /\.tsx?$/,
                use: [
                    path.resolve(__dirname, 'loaders/antdStyleLoader.js'),
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: path.resolve(__dirname, 'tsconfig.json'),
                            transpileOnly: true
                        }
                    }
                ],
                exclude: NODE_MODULES_PATH,
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'tests')
                ]
            },
            {
                test: /\.jsx?$/,
                use: 'babel-loader',
                exclude: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'tests'),
                    'min.js',
                    NODE_MODULES_PATH
                ],
                include: [
                    path.resolve(__dirname, 'mock')
                ]
            },
            {
                test: /\.svg$/,
                use: {
                    loader: 'svg-inline-loader',
                    options: {
                        removeTags: true
                    }
                }
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 88192
                    }
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: 'file-loader'
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true
                        }
                    }
                ],
                exclude: [
                    path.resolve(ROOT_PATH, 'src')
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true,
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true
                        }
                    }
                ],
                exclude: [
                    path.resolve(ROOT_PATH, 'src')
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true,
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]__[local]___[hash:base64:5]'
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true
                        }
                    }
                ],
                include: [
                    path.resolve(ROOT_PATH, 'src')
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'async', //默认作用于异步chunk，值为all/initial/async/function(chunk),值为function时第一个参数为遍历所有入口chunk时的chunk模块，chunk._modules为gaichunk所有依赖的模块，通过chunk的名字和所有依赖模块的resource可以自由配置,会抽取所有满足条件chunk的公有模块，以及模块的所有依赖模块，包括css
            minSize: 30000,  //默认值是30kb
            minChunks: 1,  //被多少模块共享
            maxAsyncRequests: 5,  //所有异步请求不得超过5个
            maxInitialRequests: 3,  //初始话并行请求不得超过3个
            name: true,  //打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔开，如vendor~
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.(less|css)$/,
                    chunks: 'all',
                    enforce: true
                },
                echartsMin: {
                    name: 'echartsMin',
                    test: /echarts\.min\.js$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        },
        minimizer: minimizer
    },
    plugins: plugins
}, isDev ? {
    devServer: {
        host: '0.0.0.0',
        contentBase: DIST_PATH,
        port: process.env.PORT || 8090,
        historyApiFallback: true,
        hot: true,
        compress: true,
        open: true,
        ...devServer4Mock
    }
} : {}, moduleRules);
