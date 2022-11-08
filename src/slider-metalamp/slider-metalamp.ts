import { Model, View, Controller }
  from './mvc/controller/controller';

function plugin(this: JQuery, options: any): JQuery {
  this.each((_, el: Element) => {
    const $element = $(el);
    if (!$element.data('SliderMetaLamp')) {
      $element.data(
        'SliderMetaLamp',
        new Controller(new Model(options), new View(el)),
      );
    }
  });
  return this;
}

$.fn.SliderMetaLamp = plugin;

export default plugin;
