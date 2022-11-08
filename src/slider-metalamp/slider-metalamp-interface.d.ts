import { IConf } from './mvc/interface';

interface SliderFunction {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  (options: IConf): JQuery;
}

interface Slider extends
  SliderFunction { }

interface JQuery {
  SliderMetaLamp: Slider;
}

export { JQuery, Slider };
