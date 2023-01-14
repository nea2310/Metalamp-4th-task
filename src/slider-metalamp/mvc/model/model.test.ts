import Model from './Model';
import View from '../view/View';
import Controller from '../controller/Controller';

const parent = document.createElement('input');
document.body.appendChild(parent);
const testModel = new Model();
const testView = new View(parent);
new Controller(testModel, testView, {});

describe('Model behavior', () => {
  test('Should update Model with consistent configuration', () => {
      testModel.update({
      min: 10,
      max: 100,
      from: 20,
      to: 90,
      range: true,
      shiftOnKeyDown: 2,
      shiftOnKeyHold: 5,
    });
    expect(testView.viewConfiguration.min).toBe(10);
    expect(testView.viewConfiguration.max).toBe(100);
    expect(testView.viewConfiguration.from).toBe(10);
    expect(testView.viewConfiguration.to).toBe(90);
  })
    test('Should fix inconsistent configuration and update Model', () => {
    testModel.update({ min: 1000 });
    expect(testView.viewConfiguration.min).toBe(100);
    expect(testView.viewConfiguration.max).toBe(1000);
    expect(testView.viewConfiguration.from).toBe(100);
    expect(testView.viewConfiguration.to).toBe(100);

    testModel.update({ from: -20 });

    expect(testView.viewConfiguration.min).toBe(100);
    expect(testView.viewConfiguration.max).toBe(1000);
    expect(testView.viewConfiguration.from).toBe(100);
    expect(testView.viewConfiguration.to).toBe(-20);

    testModel.update({ from: 2000  });

    expect(testView.viewConfiguration.min).toBe(100);
    expect(testView.viewConfiguration.max).toBe(1000);
    expect(testView.viewConfiguration.from).toBe(100);
    expect(testView.viewConfiguration.to).toBe(1000);

    testModel.update({ to: 90 });

    expect(testView.viewConfiguration.min).toBe(100);
    expect(testView.viewConfiguration.max).toBe(1000);
    expect(testView.viewConfiguration.from).toBe(100);
    expect(testView.viewConfiguration.to).toBe(100);

    testModel.update({ to: 2000 });

    expect(testView.viewConfiguration.min).toBe(100);
    expect(testView.viewConfiguration.max).toBe(1000);
    expect(testView.viewConfiguration.from).toBe(100);
    expect(testView.viewConfiguration.to).toBe(1000);

    testModel.update({ to: 90 });

    expect(testView.viewConfiguration.min).toBe(100);
    expect(testView.viewConfiguration.max).toBe(1000);
    expect(testView.viewConfiguration.from).toBe(100);
    expect(testView.viewConfiguration.to).toBe(100);

    testModel.update({
      min: 10,
      max: 100,
      from: 20,
      range: false,
    });

    expect(testView.viewConfiguration.min).toBe(10);
    expect(testView.viewConfiguration.max).toBe(100);
    expect(testView.viewConfiguration.from).toBe(20);
    expect(testView.viewConfiguration.to).toBe(100);

    testModel.update({ min: 1000 });

    expect(testView.viewConfiguration.min).toBe(100);
    expect(testView.viewConfiguration.max).toBe(1000);
    expect(testView.viewConfiguration.from).toBe(100);
    expect(testView.viewConfiguration.to).toBe(100);

    testModel.update({ from: -20 });

    expect(testView.viewConfiguration.min).toBe(100);
    expect(testView.viewConfiguration.max).toBe(1000);
    expect(testView.viewConfiguration.from).toBe(100);
    expect(testView.viewConfiguration.to).toBe(-20);

    testModel.update({ from: 2000 });

    expect(testView.viewConfiguration.min).toBe(100);
    expect(testView.viewConfiguration.max).toBe(1000);
    expect(testView.viewConfiguration.from).toBe(100);
    expect(testView.viewConfiguration.to).toBe(1000);
  })
})

