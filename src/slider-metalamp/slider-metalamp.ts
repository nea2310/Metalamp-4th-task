/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */

import { Model, View, Controller }
  from './mvc/controller/controller';

export function plugin(this: JQuery, options: any): JQuery {
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
