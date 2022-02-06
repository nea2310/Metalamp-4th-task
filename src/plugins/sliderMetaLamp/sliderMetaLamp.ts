import { Model, View, Controller }
  from './mvc/controller/controller';

// eslint-disable-next-line no-undef
$.fn.Slider = function (options): JQuery {
  return this.each(function (i: number, el: Element) {
    if (!$.data(el, 'SliderMetaLamp')) {
      $.data(
        el,
        'SliderMetaLamp',
        new Controller(
          new Model(options), new View(el, i))
      );
    }
  });
};

const _$ = $;
export { _$ };

