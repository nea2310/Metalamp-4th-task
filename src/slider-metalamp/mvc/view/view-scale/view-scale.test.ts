import { mockKeyboardEvent, createInstance } from '../../test-utils';

describe('Scale marks are created', () => {
  test('Scale marks are created correctly', () => {
    const {
      testController, controlMax, updateModel, scale,
    } = createInstance();

    testController.update({
      min: 0,
      max: 100,
      from: 0,
      to: 100,
      step: 10,
      sticky: true,
      shiftOnKeyDown: 1,
    });

    if (!(controlMax instanceof HTMLElement)) return;

    mockKeyboardEvent(controlMax, {
      eventType: 'keydown',
      direction: 'ArrowLeft',
      repeat: false,
    });

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 0,
        to: 90,
      }),
    );

    testController.update({ step: 1 });

    mockKeyboardEvent(controlMax, {
      eventType: 'keydown',
      direction: 'ArrowLeft',
      repeat: false,
    });

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 0,
        to: 89,
      }),
    );

    if (scale) {
      scale.getBoundingClientRect = jest.fn(() => ({
        width: 300,
        height: 50,
        top: 30,
        left: 30,
        bottom: 50,
        right: 50,
        x: 0,
        y: 0,
        toJSON: () => undefined,
      }));
    }

    global.innerWidth = 300;
    global.dispatchEvent(new Event('resize'));

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 0,
        to: 88,
      }),
    );
  });
});
