
// eslint-disable-next-line no-unused-vars
import Observer from './observer';


class TestObserver extends Observer {
  constructor() {
    super();
  }


}

describe('Observer - subscribe, unsubscribe, fire', () => {


  test('subscribe', () => {
    let ob = new TestObserver();
    let cb1 = () => true;
    let cb2 = () => true;
    expect(ob.subscribe(cb1)).toEqual([cb1]);
    expect(ob.subscribe(cb2)).toEqual([cb1, cb2]);
    expect(ob.subscribe(cb2)).toBe(false);
  });

  test('unsubscribe', () => {
    let ob = new TestObserver();
    let cb1 = () => true;
    let cb2 = () => true;
    let cb3 = () => true;
    ob.subscribe(cb1);
    ob.subscribe(cb2);
    expect(ob.unsubscribe(cb1)).toEqual([cb2]);
    expect(ob.unsubscribe(cb3)).toEqual([cb2]);
  });
});