const webpack = require('webpack');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const src = path.join(__dirname, '../src');

const PAGES_DIR = path.join(src, 'pages/');

// const PAGES_DIR = `${src}\\pages\\`;
const PAGES = [];
fs.readdirSync(PAGES_DIR).forEach((file) => {
  PAGES.push(file.split('/', 2).join());
});

let entry = `${src}/index-demo.ts`;
let mode = 'development';

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'productionDemo') {
  mode = 'production';
}
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
  entry = `${src}/index.ts`;
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
  devtool: 'source-map',
  /* настройки точки входа */
  entry,
  /* настройки директории выходного файла (бандла) */
  output: {
    /* очищать dist перед очередным запуском npm run build или npm run dev */
    clean: true,
  },
  /* В отличие от лоадеров, плагины позволяют выполнять задачи после сборки бандла.
  Эти задачи могут касаться как самого бандла, так и другого кода */
  plugins: [
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
  ],
  module: {
    // module.rules - все лоадеры
    rules: [
      // обработчик для pug файлов
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        exclude: /node_modules/,
      },
      /* преобразование JavaScript следующего поколения в современный JavaScript с помощью Babel. */
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // https://runebook.dev/ru/docs/babel/babel-preset-env/index
            presets: [['@babel/preset-env', { targets: '> 0.25%, not dead' }],
              '@babel/preset-typescript'],
            /* Использование кэша для избежания рекомпиляции при каждом запуске */
            cacheDirectory: true,
          },
        },
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
