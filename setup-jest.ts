// global.$ = require('./src/plugins/sliderMetaLamp/sliderMetaLamp');
// global.jQuery = require('./src/plugins/sliderMetaLamp/sliderMetaLamp');

// import * as $ from 'jquery';
// global['$'] = global['jQuery'] = $;


import $ from 'jquery';
import JQueryStatic from 'jquery';

interface JQ extends Window {
  $?: JQueryStatic,
  jQuery?: JQueryStatic,
}

let windowJQ: JQ = window;
windowJQ.$ = windowJQ.jQuery = $;
