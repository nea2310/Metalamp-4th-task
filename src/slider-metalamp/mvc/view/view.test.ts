import { mockKeyboardEvent, createInstance } from '../test-utils';

describe('', () => {
  test('', () => {
    const { testController, controlMax, updateModel, scale } =
      createInstance();

    testController.update({
      min: -100,
      max: 100,
      from: -50,
      to: 50,
      vertical: true,
      range: false,
      bar: false,
      tip: false,
      scale: false,
      scaleBase:  'interval',
      step: 1,
      interval: 20,
      sticky: true,
      shiftOnKeyDown: 2,
      shiftOnKeyHold: 2,
      round: 1,
    });
  });
});
