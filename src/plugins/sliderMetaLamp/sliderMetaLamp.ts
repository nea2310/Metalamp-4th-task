import $ from 'jquery';
import { Model, View, Controller }
  from './mvc/controller/controller';


export function plugin(this: JQuery, options: any): JQuery {
  // $.fn.SliderMetaLamp = function (options): JQuery {
  this.each((_, el: Element) => {
    const $element = $(el);
    if (!$element.data('SliderMetaLamp')) {
      $element.data(
        'SliderMetaLamp',
        new Controller(
          new Model(options), new View(el))
      );
    }
  })
  // };
  return this;
}


$.fn.SliderMetaLamp = plugin;



// eslint-disable-next-line no-undef
// $.fn.SliderMetaLamp = function (options): JQuery {
//   console.log('JEST TEST');

//   return this.each(function (i: number, el: Element) {
//     if (!$.data(el, 'SliderMetaLamp')) {
//       $.data(
//         el,
//         'SliderMetaLamp',
//         new Controller(
//           new Model(options), new View(el))
//       );
//     }
//   });
// };

// const _$ = $;
// export { _$ };


