// Generated using webpack-cli https://github.com/webpack/webpack-cli

require("dotenv").config();
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { DefinePlugin } = require("webpack");
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = isProduction
    ? MiniCssExtractPlugin.loader
    : "style-loader";

const config = {
    entry: "./src/index.jsx",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[chunkhash].js",
        chunkFilename: "[id].[chunkhash].js",
    },
    devtool: "source-map",
    resolve: {
        extensions: [".js", ".jsx", ".json"],
    },
    devServer: {
        open: true,
        host: "localhost",
        port: 8080,
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "index.html",
        }),
        new DefinePlugin({
            "process.env.REMOTE_MFE_URL": JSON.stringify(
                process.env.REMOTE_MFE_URL,
            ),
        }),
        new ModuleFederationPlugin({
            name: "host",
            shared: {
                react: {
                    singleton: true,
                    requiredVersion: deps.react,
                    eager: true,
                },
                "react-dom": {
                    singleton: true,
                    requiredVersion: deps["react-dom"],
                    eager: true,
                },
                "react-router-dom": {
                    singleton: true,
                    requiredVersion: deps["react-router-dom"],
                    eager: true,
                },
            },
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: "babel-loader",
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, "css-loader", "postcss-loader"],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: "asset",
            },
        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = "production";

        config.plugins.push(new MiniCssExtractPlugin());
    } else {
        config.mode = "development";

        // config.plugins.push(new BundleAnalyzerPlugin());
    }
    return config;
};
