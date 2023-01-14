import {
  IBusinessData,
  IViewData,
  IScaleState,
  IControlState,
} from './interface';

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

  public unsubscribe(observer: Function, type: string) {
    const observersArray = this.observers.get(type);
    if (!observersArray) return;
    this.observers.set(type, observersArray.filter((item) => item !== observer));
  }

  protected notify(
    type: string,
    data: IViewData | IBusinessData | IScaleState | IControlState,
  ) {
    const observersArray = this.observers.get(type);
    if (observersArray) {
      observersArray.forEach((item) => item(data));
    }
  }
}
