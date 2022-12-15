import { IConf } from './mvc/interface';

interface SliderFunction {
  (options: IConf): JQuery;
}

declare global {
  interface JQuery {
    SliderMetaLamp: SliderFunction;
  }
}
