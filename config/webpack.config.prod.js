const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const common = require('./webpack.config');

const src = path.join(__dirname, '../src');

let name = '[name].[contenthash]';
if (process.env.NODE_ENV === 'production') {
  name = 'plugin';
}

/*
 * css-loader - импортировать CSS-файлы
 * style-loader - поместить CSS-код в тег <style> (мы его не используем)
 * MiniCssExtractPlugin - извлечь CSS в отдельный файл
 * не исключаем node-modules, т.к. оттуда берутся файлы стилей плагинов
 * postcss-loader - инструмент пост-обработки CSS
 * postcss-preset-env - набор расширений для эмуляции функций из незаконченных черновиков
 * CSS-спецификаций
 * cssnano — уменьшает размер CSS-кода, убирая пробелы и переписывая код в сжатой форме
 */
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
  // Set the mode to production
  mode: 'production',
  output: {
    filename: `assets/js/${name}.js`,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `assets/css/${name}.css`,
    }),
  ],
  module: {
    // module.rules - все лоадеры
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
                `${src}/assets/styles/glob.scss`,
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
