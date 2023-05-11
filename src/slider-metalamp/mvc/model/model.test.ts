import Model from './Model';
import View from '../view/View';
import Controller from '../controller/Controller';

describe('Model behavior', () => {
  let parent: HTMLInputElement;
  let testModel: Model;
  let testView: View;
  let updateView: jest.SpyInstance;

  beforeAll(() => {
    parent = document.createElement('input');
    document.body.appendChild(parent);
    testModel = new Model();
    testView = new View(parent);
    // eslint-disable-next-line no-new
    new Controller(testModel, testView, {});
    updateView = jest.spyOn(testView, 'update');
  });

  afterAll(() => {
    document.body.removeChild(parent);
  });

  test('Should fix inconsistent configuration and update Model', () => {
    const invalidConfigurations = [
      {
        min: 1000, max: 100, from: 10, to: 90,
      },
      {
        min: 100, max: 1000, from: -20, to: 100,
      },
      {
        min: 100, max: 1000, from: 2000, to: 100,
      },
      {
        min: 100, max: 1000, from: 100, to: 90,
      },
      {
        min: 100, max: 1000, from: 100, to: 2000,
      },
      {
        min: 100, max: 1000, from: 2000, to: 100, range: false,
      },
      {
        min: 100, max: 1000, from: 2000, to: 500,
      },
      {
        min: undefined, max: undefined, from: undefined, to: undefined,
      },
    ];
    const expectedValues = [
      {
        min: 100, max: 1000, from: 100, to: 100,
      },
      {
        min: 100, max: 1000, from: 100, to: 100,
      },
      {
        min: 100, max: 1000, from: 100, to: 1000,
      },
      {
        min: 100, max: 1000, from: 100, to: 1000,
      },
      {
        min: 100, max: 1000, from: 100, to: 1000,
      },
      {
        min: 100, max: 1000, from: 1000, to: 1000,
      },
      {
        min: 100, max: 1000, from: 1000, to: 500,
      },
      {
        min: 0, max: 1, from: 0, to: 1,
      },
    ];

    invalidConfigurations.forEach((invalidConfig, index) => {
      testModel.update(invalidConfig);
      expect(updateView).toHaveBeenLastCalledWith(
        expect.objectContaining(expectedValues[index]),
      );
    });
  });
});
