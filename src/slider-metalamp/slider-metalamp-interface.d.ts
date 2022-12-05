import { IConf } from './mvc/interface';

interface SliderFunction {
  (options: IConf): JQuery;
}

interface Slider extends
  SliderFunction { }

declare global {
  interface JQuery {
    SliderMetaLamp: Slider;
  }
}
