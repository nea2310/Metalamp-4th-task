import { IConf } from './mvc/interface';

interface SliderFunction {
  (options: IConf): JQuery;
}

interface Slider extends
  SliderFunction { }

interface JQuery {
  SliderMetaLamp: Slider;
}

export { JQuery, Slider };
