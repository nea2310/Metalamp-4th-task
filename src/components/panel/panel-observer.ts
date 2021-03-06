export default abstract class PanelObserver {
  observers: Function[];

  constructor() {
    this.observers = [];
  }

  public subscribe(observer: Function) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      return this.observers;
    }
    return false;
  }

  public unsubscribe(observer: Function) {
    this.observers = this.observers.filter((obs) => obs !== observer);
    return this.observers;
  }

  protected notify(key: string, data: string | boolean) {
    this.observers.forEach((item) => item({ key, data }));
  }
}
