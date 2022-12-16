import { IPluginConfiguration } from './mvc/interface';

interface SliderFunction {
  (options: IPluginConfiguration): JQuery;
}

declare global {
  interface JQuery {
    SliderMetaLamp: SliderFunction;
  }
}
