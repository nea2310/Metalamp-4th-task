const webpack = require('webpack');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
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
let isBuild = false;
let isPlugin = false;
let plugins = [];

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'productionDemo') {
  mode = 'production';
  isBuild = true;
}

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
  entry = `${src}/index.ts`;
  isPlugin = true;
}

if (!isPlugin) {
  plugins = [
    /* HtmlWebpackPlugin создает index.html в директории с бандлом и автоматически
    добавляет в него ссылку     на бандл. HtmlWebpackPlugin создаст новый файл
    index.html в директории dist и добавит в него ссылку на бандл —
    <script src='main.js'></script> (или  <script src='main.[hash].js'></script>,
    если это build режим). Мы создаем html файл из каждого pug файла, поэтому обходим
    циклом массив с названиями всех pug-страниц и для каждой создаем объект HtmlWebpackPlugin
     */
    ...PAGES.map((page) => new HtmlWebpackPlugin({
      template: `${src}/pages/${page}/${page}.pug`,
      filename: `./${page}.html`,
      inject: true,
    })),
    // Подключение jquery
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),

    /* копируем файлы фавиконов и манифеста в dist
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
    new ESLintPlugin({
      extensions: ['js', 'ts'],
    }),
  ];
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
    /* отслеживать изменения в .pug файлах, т.к. по умолчанию это не происходит -
    см. https://qna.habr.com/q/1039918 */
    watchFiles: [`${src}/**/**/*.pug`],
  },

  mode,
  devtool: isBuild ? false : 'source-map',
  /* настройки точки входа */
  entry,
  /* настройки директории выходного файла (бандла) */
  output: {
    /* очищать dist перед очередным запуском npm run build или npm run dev */
    clean: true,
  },
  /* В отличие от лоадеров, плагины позволяют выполнять задачи после сборки бандла.
  Эти задачи могут касаться как самого бандла, так и другого кода */
  plugins,
  module: {
    // module.rules - все лоадеры
    rules: [
      // обработчик для pug файлов
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
      /* asset/resource это аналог file-loader.
      Файлы, которые будут подпадать под правило с type: 'asset/resource',
       будут складываться в директорию с бандлом */
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
