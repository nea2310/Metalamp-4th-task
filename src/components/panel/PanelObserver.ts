export default abstract class PanelObserver {
  observers: Function[];

  observersTest: Map<string, Function[]>;

  constructor() {
    this.observers = [];
    this.observersTest = new Map();
  }

  public subscribe(type: string, observer: Function) {
    const observersArray = this.observersTest.get(type);
    if (!observersArray) {
      this.observersTest.set(type, [observer]);
      return;
    }
    if (!observersArray.includes(observer)) {
      observersArray.push(observer);
    }
  }

  protected notify(
    type: string,
    data: { key: string, value: string | boolean },
  ) {
    const observersArray = this.observersTest.get(type);
    if (observersArray) {
      observersArray.forEach((item) => item(data));
    }
  }
}
