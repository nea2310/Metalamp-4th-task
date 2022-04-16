import $ from 'jquery';
import JQueryStatic from './node_modules/@types/jquery';

interface WindowJQ extends Window {
  $?: JQueryStatic,
  jQuery?: JQueryStatic,
}

const windowJQ: WindowJQ = window;
windowJQ.$ = $;
windowJQ.jQuery = $;
