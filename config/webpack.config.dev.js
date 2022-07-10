const { merge } = require('webpack-merge');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.config');

const src = path.join(__dirname, '../src');

let name = '[name]';
if (process.env.NODE_ENV === 'development') {
  name = 'plugin';
}

const processCSS = [
  MiniCssExtractPlugin.loader,
  'css-loader',
];

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  output: {
    filename: `assets/js/${name}.js`,
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: `assets/css/${name}.css`,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: processCSS,
      },
      {
        test: /\.scss$/,
        use: [
          ...processCSS,
          'sass-loader', {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                `${src}/assets/styles/glob.scss`,
              ],
            },
          }],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]',
        },
      },
    ],
  },

});
