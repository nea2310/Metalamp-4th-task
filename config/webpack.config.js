const webpack = require('webpack');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path');

const src = path.join(__dirname, '../src');
const dist = path.join(__dirname, '../dist');
const PAGES_DIR = path.join(src, 'pages/');

const PAGES = [];

fs.readdirSync(PAGES_DIR).forEach((file) => {
  PAGES.push(file.split('/', 2).join());
});

let entry = `${src}/index-demo.ts`;
let mode = 'development';
let isPlugin = false;

const plugins = [

  new ESLintPlugin({
    extensions: ['js', 'ts'],
  }),

  new CleanWebpackPlugin(),
];

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'productionDemo') {
  mode = 'production';
}

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
  entry = `${src}/index.ts`;
  isPlugin = true;
}

if (!isPlugin) {
  plugins.push(...PAGES.map((page) => new HtmlWebpackPlugin({
    template: `${src}/pages/${page}/${page}.pug`,
    filename: `./${page}.html`,
    inject: true,
  })));

  plugins.push(new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
  }));

  plugins.push(new CopyPlugin({
    patterns: [
      { from: `${src}/assets/favicons/favicon.ico`, to: `${dist}` },
      { from: `${src}/assets/favicons/`, to: `${dist}/assets/favicons/` },
    ],
  }));
}

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.scss'],
    alias: {
      '@fav': `${src}/assets/favicons`,
      '@com': `${src}/components`,
      '@pag': `${src}/pages`,
      '@styles': `${src}/assets/styles`,
    },
  },

  devServer: {
    watchFiles: [`${src}/**/**/*.pug`],
  },

  mode,
  entry,
  output: { path: dist },
  plugins,
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: '../tsconfig.json',
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[hash][ext]',
        },
      },
    ],
  },
};
