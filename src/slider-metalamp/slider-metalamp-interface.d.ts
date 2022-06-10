/* eslint-disable no-use-before-define */

import { IConf } from './mvc/interface';

interface SliderFunction {
  // eslint-disable-next-line no-unused-vars
  (options: IConf): JQuery;
}

interface Slider extends
  SliderFunction { }

interface JQuery {
  SliderMetaLamp: Slider;
}
