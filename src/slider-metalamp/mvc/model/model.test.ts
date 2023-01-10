import Model from './Model';

describe('Model behavior', () => {
  const testModel = new Model();
  let configuration = testModel.modelConfiguration;

  test('Should create Model', () => {
    expect(configuration).toEqual({
      min: 0,
      max: 0,
      from: 0,
      to: 0,
      range: true,
      shiftOnKeyDown: 1,
      shiftOnKeyHold: 1
    });
  });

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
    configuration = testModel.modelConfiguration;
    expect(configuration).toEqual({
      min: 10,
      max: 100,
      from: 20,
      to: 90,
      range: true,
      shiftOnKeyDown: 2,
      shiftOnKeyHold: 5,
    });
  });

  test('Should fix inconsistent configuration and update Model', () => {
    testModel.update({ min: 1000 });
    configuration = testModel.modelConfiguration;
    expect(configuration).toEqual({
      min: 100,
      max: 1000,
      from: 1000,
      to: 20,
      range: true,
      shiftOnKeyDown: 2,
      shiftOnKeyHold: 5,
    });

    testModel.update({ from: -20 });
    configuration = testModel.modelConfiguration;
    expect(configuration).toEqual({
      min: 100,
      max: 1000,
      from: 100,
      to: -20,
      range: true,
      shiftOnKeyDown: 2,
      shiftOnKeyHold: 5,
    });

    testModel.update({ from: 2000 });
    configuration = testModel.modelConfiguration;
    expect(configuration).toEqual({
      min: 100,
      max: 1000,
      from: -20,
      to: 2000,
      range: true,
      shiftOnKeyDown: 2,
      shiftOnKeyHold: 5,
    });

    testModel.update({ to: 90 });
    configuration = testModel.modelConfiguration;
    expect(configuration).toEqual({
      min: 100,
      max: 1000,
      from: 100,
      to: -20,
      range: true,
      shiftOnKeyDown: 2,
      shiftOnKeyHold: 5,
    });

    testModel.update({ to: 2000 });
    configuration = testModel.modelConfiguration;
    expect(configuration).toEqual({
      min: 100,
      max: 1000,
      from: 100,
      to: 1000,
      range: true,
      shiftOnKeyDown: 2,
      shiftOnKeyHold: 5,
    });

    testModel.update({ to: 90 });
    configuration = testModel.modelConfiguration;
    expect(configuration).toEqual({
      min: 100,
      max: 1000,
      from: 90,
      to: 100,
      range: true,
      shiftOnKeyDown: 2,
      shiftOnKeyHold: 5,
    });

    testModel.update({
      min: 10,
      max: 100,
      from: 20,
      range: false,
      shiftOnKeyDown: 2,
      shiftOnKeyHold: 5,
    });
    configuration = testModel.modelConfiguration;
    expect(configuration).toEqual({
      min: 10,
      max: 100,
      from: 20,
      to: 100,
      range: false,
      shiftOnKeyDown: 2,
      shiftOnKeyHold: 5,
    });

    testModel.update({ min: 1000 });
    configuration = testModel.modelConfiguration;
    expect(configuration).toEqual({
      min: 100,
      max: 1000,
      from: 1000,
      to: 20,
      range: false,
      shiftOnKeyDown: 2,
      shiftOnKeyHold: 5,
    });

    testModel.update({ from: -20 });
    configuration = testModel.modelConfiguration;
    expect(configuration).toEqual({
      min: 100,
      max: 1000,
      from: 100,
      to: -20,
      range: false,
      shiftOnKeyDown: 2,
      shiftOnKeyHold: 5,
    });

    testModel.update({ from: 2000 });
    configuration = testModel.modelConfiguration;
    expect(configuration).toEqual({
      min: 100,
      max: 1000,
      from: 1000,
      to: 2000,
      range: false,
      shiftOnKeyDown: 2,
      shiftOnKeyHold: 5,
    });
  });
})

