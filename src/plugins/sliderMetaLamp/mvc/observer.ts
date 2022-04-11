import {
  IdataFull, IConfFull
} from './interface';

import { defaultConf } from './utils';

export default abstract class Observer {
  observers: Function[];

  constructor() {
    this.observers = [];
  }

  public subscribe(observer: Function) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      return this.observers;
    }
    else return false;
  }

  public unsubscribe(observer: Function) {
    this.observers = this.observers.filter(obs => obs !== observer);
    return this.observers;
  }

  protected fire(key: string, data: IdataFull, conf: IConfFull = defaultConf) {
    for (let item of this.observers) {
      item({ key, data, conf });
    }
  }
}
