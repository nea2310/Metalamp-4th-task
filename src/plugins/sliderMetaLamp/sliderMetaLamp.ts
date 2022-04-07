import { Model, View, Controller }
  from './mvc/controller/controller';

(function ($) {
  $.fn.SliderMetaLamp = function (options): JQuery {
    return this.each(function (index, el: Element) {
      if (!$.data(el, 'SliderMetaLamp')) {
        $.data(
          el,
          'SliderMetaLamp',
          new Controller(
            new Model(options), new View(el))
        );
      }
    })

  }
})(jQuery)


