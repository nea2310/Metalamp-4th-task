const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const common = require('./webpack.config');

const src = path.join(__dirname, '../src');

let name = '[name].[contenthash]';
if (process.env.NODE_ENV === 'production') {
  name = 'plugin';
}

const processCSS = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          [
            'autoprefixer', {},
            'cssnano', {},
            'postcss-preset-env', {},
          ],
        ],
      },
    },
  },
];

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: `assets/js/${name}.js`,
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(), new TerserPlugin(),
    ],
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
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                `${src}/assets/styles/global.scss`,
              ],
            },
          },
        ],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[hash][ext]',
        },
      },

    ],
  },
});
