const path = require('path');
const webpack = require("webpack");
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    mode: 'none', //Can also be development or production https://webpack.js.org/configuration/mode/
    entry: {
        app: './src/index.tsx',
    },

    output: {
        filename: 'main.js',
        publicPath: "",
        path: path.resolve(__dirname, '../wwwroot/js')
    },

    resolve: {
        extensions: ["*", ".ts", ".tsx", ".js", ".jsx", ".CSS"],
        alias: {
            '~components': path.resolve(__dirname, 'src/components'),
            '~contexts': path.resolve(__dirname, 'src/contexts'),
            '~hooks': path.resolve(__dirname, 'src/hooks'),
            '~pages': path.resolve(__dirname, 'src/pages'),
            '~services': path.resolve(__dirname, 'src/services'),
        }
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },

            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ],
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {},
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            }

        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(['../wwwroot/js'])
    ]

};