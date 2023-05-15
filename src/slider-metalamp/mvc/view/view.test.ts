import { createInstance } from '../test-utils';
import { IPluginConfigurationFull } from '../interface';

const configuration: Partial<IPluginConfigurationFull> = {
  min: -100,
  max: 100,
  from: -50,
  to: 50,
  vertical: true,
  range: false,
  bar: false,
  tip: false,
  scale: false,
  scaleBase: 'interval',
  step: 1,
  interval: 20,
  sticky: true,
  shiftOnKeyDown: 2,
  shiftOnKeyHold: 2,
  round: 1000000,
};

describe('Should initialize slider instance with correct parameters', () => {
  test('Should initialize slider instance with parameters taken from configuration object', () => {
    const {
      testController,
      testModel,
    } = createInstance();

    const updateModel = jest.spyOn(testModel, 'update');

    testController.update(configuration);

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({ ...configuration, step: 10, round: 0 }),
    );
  });

  test('Should initialize slider instance with parameters taken from data attributes', () => {
    const {
      testModel,
      testController,
    } = createInstance({
      configuration: {},
      dataAttributes: [
        { name: 'min', value: '-200' },
        { name: 'max', value: '200' },
      ],
    });

    const updateModel = jest.spyOn(testModel, 'update');

    testController.update({ step: 20 });

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        min: -200,
        max: 200,
        step: 20,
      }),
    );
  });
});
