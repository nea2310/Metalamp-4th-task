import { TPluginConfiguration } from './mvc/interface';

interface SliderFunction {
  (options: TPluginConfiguration): JQuery;
}

declare global {
  interface JQuery {
    SliderMetaLamp: SliderFunction;
  }
}
