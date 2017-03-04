var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var nodeExternals = require('webpack-node-externals');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = {
    devtool: 'eval',

    entry: {
        polyfills: './src/polyfills.js',
        vendor: './src/vendor.js',
        lib: './src/lib/shared_util.js',
        app: './src/app.js'
    },

    output: {
      path: helpers.root('dist', 'web'),
      publicPath: "/assets/",
      filename: '[name].js',
    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          loaders: [{
            loader: 'awesome-typescript-loader',
            options: { configFileName: helpers.root('src', 'tsconfig.json') }
          }],
        },
        {
          test: /\.js/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        },
        {
          test: /\.html$/,
          loader: 'html-loader'
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
          loader: 'file-loader?name=assets/[name].[hash].[ext]'
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader?sourceMap' })
        }
      ]
    },

    resolve: {
        extensions: [".ts", ".js"]
    },

    node: {
      console: true,
      fs: "empty",
      child_process: "empty",
      process: true
    },

    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),

      new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
        mangle: {
          keep_fnames: true
        }
      }),

      new ExtractTextPlugin('[name].css'),
      new webpack.DefinePlugin({
        'process.env': {
          'ENV': JSON.stringify(ENV)
        }
      }),

      new webpack.LoaderOptionsPlugin({
        htmlLoader: {
          minimize: false // workaround for ng2
        }
      }),

      new HtmlWebpackPlugin({
        template: 'src/index.html',

      }),

      new CopyWebpackPlugin([{ from: './data', to: './data'}]),
      new CopyWebpackPlugin([{ from: './src/templates', to: './templates'}]),

      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
      }),


      new webpack.DefinePlugin({
        $dirname: '__dirname',
      }),

      new webpack.ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        helpers.root('./src'), // location of your src
        {} // a map of your routes
      )

    ],

    target: 'web'
}
