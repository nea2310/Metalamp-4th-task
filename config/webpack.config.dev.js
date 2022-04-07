const { merge } = require('webpack-merge');
const common = require('./webpack.config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
];

module.exports = merge(common, {
  // Set the mode to development
  mode: 'development',
  output: {
    filename: 'assets/js/[name].js',
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css'
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
          filename: 'assets/fonts/[name][ext]',
        }
      },
    ]
  },

})



