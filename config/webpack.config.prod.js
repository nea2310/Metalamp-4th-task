const { merge } = require('webpack-merge');
const common = require('./webpack.config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');
const src = path.join(__dirname, '../src');
const dist = path.join(__dirname, '../dist');

/*
 * css-loader - импортировать CSS-файлы
 * style-loader - поместить CSS-код в тег <style> (мы его не используем)
 * MiniCssExtractPlugin - извлечь CSS в отдельный файл
 * не исключаем node-modules, т.к. оттуда берутся файлы стилей плагинов
 * postcss-loader - инструмент пост-обработки CSS
 * postcss-preset-env - набор расширений для эмуляции функций из незаконченных черновиков CSS-спецификаций
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
    filename: 'assets/js/[name].[contenthash].js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash].css'
    }),

    /*копируем файлы фавиконов и манифеста в dist
    подход 2022г. по созданию фавиконов:
    * https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
    * рекомендации HTML-академии:
    * https://habr.com/ru/company/htmlacademy/blog/578224/
*/
    new CopyPlugin({
      patterns: [
        { from: `${src}/assets/favicons/favicon.ico`, to: `${dist}` },
        { from: `${src}/assets/favicons/`, to: `${dist}/assets/favicons/` },
      ],
    }),
  ],
  module: {
    //module.rules - все лоадеры
    rules: [
      {
        test: /\.css$/i,
        use: processCSS,
      },
      {
        test: /\.scss$/,
        use: [...processCSS, 'sass-loader',],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[hash][ext]',
        }
      },

    ]
  },
})



