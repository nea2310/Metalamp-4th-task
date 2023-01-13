// import { defaultConfiguration } from './utils';
import { IBusinessData, IViewData } from './interface';

export default abstract class Observer {
  observers: Map<string, Function[]>;

  constructor() {
    this.observers = new Map();
  }

  public subscribe(observer: Function, type: string) {
    const observersArray = this.observers.get(type);
    if (!observersArray) {
      this.observers.set(type, [observer]);
      return;
    }
    if (!observersArray.includes(observer)) {
      this.observers.set(type, observersArray.concat(observer));
    }
  }

  // public unsubscribe(observer: Function) {
  //   this.observers = this.observers.filter((obs) => obs !== observer);
  //   return this.observers;
  // }

  protected notify(
    type: string,
    data: IViewData | IBusinessData,
  ) {
    const observersArray = this.observers.get(type);
    if (observersArray) {
      observersArray.forEach((item) => item(data));
    }
  }
}
