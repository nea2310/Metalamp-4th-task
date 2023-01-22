import Model from './Model';
import View from '../view/View';
import Controller from '../controller/Controller';

describe('Model behavior', () => {
  test('Should update Model with consistent configuration', () => {
    const parent = document.createElement('input');
    document.body.appendChild(parent);
    const testModel = new Model();
    const testView = new View(parent);
    new Controller(testModel, testView, {});
    const updateView = jest.spyOn(testView, 'update');

      testModel.update({
      min: 0,
      max: 100,
      from: 10,
      to: 90,
    });
    expect(updateView).toHaveBeenLastCalledWith(expect.objectContaining({
      min: 0,
      max: 100,
      from: 10,
      to: 90,
    }));
  })

  test('Should fix inconsistent configuration and update Model', () => {
    const parent = document.createElement('input');
    document.body.appendChild(parent);
    const testModel = new Model();
    const testView = new View(parent);
    new Controller(testModel, testView, {});
    const updateView = jest.spyOn(testView, 'update');

    testModel.update({
      min: 1000,
      max: 100,
      from: 10,
      to: 90,
    });
    expect(updateView).toHaveBeenLastCalledWith(expect.objectContaining({
      min: 100,
      max: 1000,
      from: 100,
      to: 100,
    }));

    testModel.update({ from: -20 });
    expect(updateView).toHaveBeenLastCalledWith(expect.objectContaining({
      min: 100,
      max: 1000,
      from: 100,
      to: 100,
    }));

    testModel.update({ from: 2000 });
    expect(updateView).toHaveBeenLastCalledWith(expect.objectContaining({
      min: 100,
      max: 1000,
      from: 100,
      to: 100,
    }));

    testModel.update({ to: 90 });
    expect(updateView).toHaveBeenLastCalledWith(expect.objectContaining({
      min: 100,
      max: 1000,
      from: 100,
      to: 100,
    }));

    testModel.update({ to: 2000 });
    expect(updateView).toHaveBeenLastCalledWith(expect.objectContaining({
      min: 100,
      max: 1000,
      from: 100,
      to: 1000,
    }));

    testModel.update({ to: 90 });
    expect(updateView).toHaveBeenLastCalledWith(expect.objectContaining({
      min: 100,
      max: 1000,
      from: 100,
      to: 100,
    }));

    testModel.update({
      min: 100,
      max: 1000,
      from: -20,
      range: false,
    });
    expect(updateView).toHaveBeenLastCalledWith(expect.objectContaining({
      min: 100,
      max: 1000,
      from: 100,
      to: 100,
    }));

    testModel.update({ min: 1000 });
    expect(updateView).toHaveBeenLastCalledWith(expect.objectContaining({
      min: 1000,
      max: 1001,
      from: 1000,
      to: 1001,
    }));

    testModel.update({ from: -20 });
    expect(updateView).toHaveBeenLastCalledWith(expect.objectContaining({
      min: 1000,
      max: 1001,
      from: 1000,
      to: 1001,
    }));

    testModel.update({ from: 2000 });
    expect(updateView).toHaveBeenLastCalledWith(expect.objectContaining({
      min: 1000,
      max: 1001,
      from: 1001,
      to: 1001,
    }));

    testModel.update({
      min: undefined,
      max: undefined,
      from: undefined,
      to: undefined,
      shiftOnKeyDown: undefined,
      shiftOnKeyHold: undefined,
    });
    expect(updateView).toHaveBeenLastCalledWith(expect.objectContaining({
      min: 0,
      max: 1,
      from: 0,
      to: 1,
      shiftOnKeyDown: 1,
      shiftOnKeyHold: 1,
    }));
  })
})

