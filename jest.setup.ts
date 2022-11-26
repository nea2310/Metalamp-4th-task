import $ from 'jquery';

interface WindowJQ extends Window {
  $?: JQueryStatic,
  jQuery?: JQueryStatic,
}

const windowJQ: WindowJQ = window;
windowJQ.$ = $;
windowJQ.jQuery = $;
