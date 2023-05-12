/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { mockKeyboardEvent, createInstance } from '../../test-utils';
import plugin from '../../../slider-metalamp';

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

  test('Check resize when slider width after resize is smaller than slider width before resize', () => {
    $.fn.SliderMetaLamp = plugin;
    const parent = document.createElement('input');
    document.body.appendChild(parent);
    const slider = $(parent).SliderMetaLamp({}).data('SliderMetaLamp');

    const sliderWrapper = document.querySelectorAll('.slider-metalamp__wrapper');

    sliderWrapper.forEach((item) => Object.defineProperty(item, 'offsetWidth', {
      writable: true,
      configurable: true,
      value: 575,
    }));

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    });
    window.dispatchEvent(new Event('resize'));

    sliderWrapper.forEach((item) => Object.defineProperty(item, 'offsetWidth', {
      writable: true,
      configurable: true,
      value: 768,
    }));

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1440,
    });

    window.dispatchEvent(new Event('resize'));
  });

  test('Check resize when slider width after resize is greater than slider width before resize', () => {
    $.fn.SliderMetaLamp = plugin;
    const parent = document.createElement('input');
    document.body.appendChild(parent);
    const slider = $(parent).SliderMetaLamp({}).data('SliderMetaLamp');

    const sliderWrapper = document.querySelectorAll('.slider-metalamp__wrapper');

    sliderWrapper.forEach((item) => Object.defineProperty(item, 'offsetWidth', {
      writable: true,
      configurable: true,
      value: 575,
    }));

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    });
    window.dispatchEvent(new Event('resize'));

    sliderWrapper.forEach((item) => Object.defineProperty(item, 'offsetWidth', {
      writable: true,
      configurable: true,
      value: 768,
    }));

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 320,
    });

    window.dispatchEvent(new Event('resize'));
  });
});
