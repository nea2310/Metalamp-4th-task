import { defaultConf } from './utils';
import { IPluginPrivateData, IPluginConfigurationFull } from './interface';

export default abstract class Observer {
  observers: Function[];

  constructor() {
    this.observers = [];
  }

  public subscribe(observer: Function) {
    if (this.observers.includes(observer)) return null;
    this.observers.push(observer);
    return this.observers;
  }

  public unsubscribe(observer: Function) {
    this.observers = this.observers.filter((obs) => obs !== observer);
    return this.observers;
  }

  protected notify(
    key: string,
    data: IPluginPrivateData,
    conf: IPluginConfigurationFull = defaultConf,
  ) {
    this.observers.forEach((item) => item({ key, data, conf }));
  }
}
