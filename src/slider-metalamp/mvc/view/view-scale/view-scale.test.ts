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

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 300,
    });
    window.dispatchEvent(new Event('resize'));

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 0,
        to: 90,
      }),
    );
  });

  test('Check resize when slider width after resize is smaller than slider width before resize', () => {
    const { slider } = createInstance({}, [], 0, 0, 10, 1440);

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    });
    window.dispatchEvent(new Event('resize'));

    Object.defineProperty(slider, 'offsetWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1440,
    });

    window.dispatchEvent(new Event('resize'));
  });

  test('Check resize when slider width after resize is greater than slider width before resize', () => {
    const { slider } = createInstance();

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    });
    window.dispatchEvent(new Event('resize'));

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 320,
    });

    window.dispatchEvent(new Event('resize'));
    console.log('!!!!!!!!!!!!>>>', slider?.querySelectorAll('.slider-metalamp__mark_no-label').length);
    console.log('!!!!!!!!!!!!>>>', slider?.querySelectorAll('.slider-metalamp__mark').length);
  });
});
