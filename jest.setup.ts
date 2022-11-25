import $ from 'jquery';
// eslint-disable-next-line import/no-relative-packages
import JQueryStatic from './node_modules/@types/jquery';

interface WindowJQ extends Window {
  $?: JQueryStatic,
  jQuery?: JQueryStatic,
}

const windowJQ: WindowJQ = window;
windowJQ.$ = $;
windowJQ.jQuery = $;
