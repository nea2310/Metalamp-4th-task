import Model from './mvc/model/Model';
import View from './mvc/view/View';
import Controller from './mvc/controller/Controller';
import { TPluginConfiguration } from './mvc/interface';

function plugin(this: JQuery, options: TPluginConfiguration): JQuery {
  this.each((_, el: Element) => {
    const $element = $(el);
    if (!$element.data('SliderMetaLamp')) {
      $element.data(
        'SliderMetaLamp',
        new Controller(new Model(), new View(el), options),
      );
    }
  });
  return this;
}

$.fn.SliderMetaLamp = plugin;

export default plugin;
