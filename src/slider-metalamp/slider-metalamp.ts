import { Model, View, Controller }
  from './mvc/controller/controller';

import { IConf } from './mvc/interface';

function plugin(this: JQuery, options: IConf): JQuery {
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
