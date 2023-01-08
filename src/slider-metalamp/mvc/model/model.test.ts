import Model from './Model';

describe('init Model', () => {
  const testModel = new Model();
  let configuration = testModel.modelConfiguration;

  test('create Model', () => {
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

  test('Update Model with consistent configuration', () => {
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

  test('Update Model with inconsistent configuration', () => {
    testModel.update({ min: 1000 });

    configuration = testModel.modelConfiguration;

    expect(configuration.min).toBe(100);
    expect(configuration.max).toBe(1000);
  });
})

