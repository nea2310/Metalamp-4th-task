import Observer from './observer';

class TestObserver extends Observer { }

describe('Observer - subscribe, unsubscribe, fire', () => {
  test('subscribe', () => {
    const ob = new TestObserver();
    const cb1 = () => true;
    const cb2 = () => true;
    expect(ob.subscribe(cb1)).toEqual([cb1]);
    expect(ob.subscribe(cb2)).toEqual([cb1, cb2]);
    expect(ob.subscribe(cb2)).toBe(null);
  });

  test('unsubscribe', () => {
    const ob = new TestObserver();
    const cb1 = () => true;
    const cb2 = () => true;
    const cb3 = () => true;
    ob.subscribe(cb1);
    ob.subscribe(cb2);
    expect(ob.unsubscribe(cb1)).toEqual([cb2]);
    expect(ob.unsubscribe(cb3)).toEqual([cb2]);
  });
});
