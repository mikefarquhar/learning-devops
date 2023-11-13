// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const isProduction = process.env.NODE_ENV == "production";
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const deps = require("./package.json").dependencies;
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
        port: 8081,
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "index.html",
        }),
        new ModuleFederationPlugin({
            name: "mfe",
            filename: "remoteEntry.js",
            exposes: { "./About": "./src/About" },
            shared: {
                ...deps,
                react: {
                    singleton: true,
                    requiredVersion: deps.react,
                },
                "react-dom": {
                    singleton: true,
                    requiredVersion: deps["react-dom"],
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

        // config.plugins.push(new BundleAnalyzerPlugin({ analyzerPort: 8889 }));
    }
    return config;
};
