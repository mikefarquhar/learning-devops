// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
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
        // new ModuleFederationPlugin({
        //   name: "host",
        //   remotes: {
        //     mfe: "mfe@http://localhost:8081/remoteEntry.js",
        //   },
        //   shared: {
        //     ...deps,
        //     react: {
        //       singleton: true,
        //       requiredVersion: deps.react,
        //       eager: true,
        //     },
        //     "react-dom": {
        //       singleton: true,
        //       requiredVersion: deps["react-dom"],
        //       eager: true,
        //     },
        //   },
        // }),
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
