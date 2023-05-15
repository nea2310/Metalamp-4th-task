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

  public subscribe(type: string, observer: Function) {
    const observersArray = this.observers.get(type);
    if (!observersArray) {
      this.observers.set(type, [observer]);
    }
  }

  public unsubscribe(type: string, observer: Function) {
    const observersArray = this.observers.get(type);
    if (observersArray) {
      this.observers.set(
        type,
        observersArray.filter((item) => item !== observer),
      );
    }
  }

  protected notify(
    type: string,
    data:
    | IViewData
    | IBusinessData
    | IScaleState
    | IControlState
    | { key: string; value: string | boolean },
  ) {
    const observersArray = this.observers.get(type);
    if (observersArray) {
      observersArray.forEach((item) => item(data));
    }
  }
}
