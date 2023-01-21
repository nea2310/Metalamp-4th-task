import Model from '../../model/Model';
import Controller from '../../controller/Controller';
import { TPluginConfiguration } from '../../interface';
import View from '../View';

function mockPointerEvent(element: HTMLElement, {
  eventType, clientX = 0, clientY = 0,
}: {
  eventType: string, clientX?: number, clientY?: number,
}): void {
  const pointerEvent = new MouseEvent(eventType, {
    bubbles: true,
    clientX,
    clientY,
  });

  const targetElement = element;

  targetElement.setPointerCapture = jest.fn(targetElement.setPointerCapture);
  targetElement.releasePointerCapture = jest.fn(targetElement.releasePointerCapture);
  targetElement.dispatchEvent(pointerEvent);
}

function mockKeyboardEvent(
  element: HTMLElement,
  { eventType, direction = 'ArrowLeft', repeat = false }:
    { eventType: string, direction: string, repeat: boolean },
): void {
  const keyboardEvent = new KeyboardEvent(
    eventType,
    {
      code: direction,
      repeat,
      bubbles: true,
    },
  );

  const targetElement = element;

  targetElement.setPointerCapture = jest.fn(targetElement.setPointerCapture);
  targetElement.releasePointerCapture = jest.fn(targetElement.releasePointerCapture);
  targetElement.dispatchEvent(keyboardEvent);
}

const getElement = (selector: string, wrapper: HTMLElement) => wrapper.getElementsByClassName(selector)[0] as HTMLElement;

const createInstance = (configuration: TPluginConfiguration = {
  min: 0,
  max: 100,
  from: 10,
  to: 90,
}) => {
  const wrapper = document.createElement('div');
  const parent = document.createElement('input');
  document.body.appendChild(wrapper);
  wrapper.appendChild(parent);
  const testModel = new Model();
  const testView = new View(parent);
  const testController = new Controller(testModel, testView, {});

  testController.update(configuration);

  const controlMax = getElement('slider-metalamp__control-max', wrapper);
  const controlMin = getElement('slider-metalamp__control-min', wrapper);
  const tipMin = getElement('slider-metalamp__tip-min', wrapper);
  const tipMax = getElement('slider-metalamp__tip-max', wrapper);
  const track = getElement('slider-metalamp__track', wrapper);
  track.getBoundingClientRect = jest.fn(() => {
    return {
        width: 500,
        height: 50,
        top: 30,
        left: 30,
        bottom: 50,
        right: 50,
        x: 0,
        y: 0,
        toJSON: () => undefined,
    }});
  const scale = controlMax.parentElement;
  if (scale){
    scale.getBoundingClientRect = jest.fn(() => {
      return {
          width: 500,
          height: 50,
          top: 30,
          left: 30,
          bottom: 50,
          right: 50,
          x: 0,
          y: 0,
          toJSON: () => undefined,
      }})
  }
  const updateModel = jest.spyOn(testModel, 'update');
  return {testController, track, controlMin, controlMax, updateModel };
}

describe('ViewControl event listeners', () => {
  test('try to move control; moving by dragging control; no sticky', () => {

    const { controlMin, controlMax,  updateModel } = createInstance();

    mockPointerEvent(
      controlMax,
      { eventType: 'pointerdown', clientY: 100, clientX: 100 },
    );
    mockPointerEvent(
      controlMax,
      { eventType: 'pointermove', clientY: 100, clientX: 350 },
    );

    mockPointerEvent(
      controlMin,
      { eventType: 'pointerdown', clientY: 100, clientX: 100 },
    );
    mockPointerEvent(
      controlMin,
      { eventType: 'pointermove', clientY: 100, clientX: 250 },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 24,
        to: 44,
      })
    );
  });

  test('try to move control; moving by dragging control; sticky', () => {

    const { testController, controlMin, controlMax,  updateModel } = createInstance();

    testController.update({sticky: true, step: 10})

    mockPointerEvent(
      controlMax,
      { eventType: 'pointerdown', clientY: 100, clientX: 100 },
    );
    mockPointerEvent(
      controlMax,
      { eventType: 'pointermove', clientY: 100, clientX: 350 },
    );

    mockPointerEvent(
      controlMin,
      { eventType: 'pointerdown', clientY: 100, clientX: 100 },
    );
    mockPointerEvent(
      controlMin,
      { eventType: 'pointermove', clientY: 100, clientX: 250 },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 20,
        to: 40,
      })
    );

  });

  test('try to move control if it is on its extreme position; moving by dragging control; no sticky', () => {

    const { testController, controlMin, controlMax,  updateModel } = createInstance();

    mockPointerEvent(
      controlMax,
      { eventType: 'pointerdown', clientY: 100, clientX: 100 },
    );
    mockPointerEvent(
      controlMax,
      { eventType: 'pointermove', clientY: 100, clientX: 1000 },
    );

    mockPointerEvent(
      controlMin,
      { eventType: 'pointerdown', clientY: 100, clientX: 100 },
    );
    mockPointerEvent(
      controlMin,
      { eventType: 'pointermove', clientY: 100, clientX: 0 },
    );

    expect(updateModel).toHaveBeenCalledTimes(0);
  });


  test('try to move control if it is on its extreme position; moving by dragging control; sticky', () => {

    const { testController, controlMin, controlMax,  updateModel } = createInstance();

    testController.update({sticky: true, step: 10})
    mockPointerEvent(
      controlMax,
      { eventType: 'pointerdown', clientY: 100, clientX: 100 },
    );
    mockPointerEvent(
      controlMax,
      { eventType: 'pointermove', clientY: 100, clientX: 1000 },
    );

    mockPointerEvent(
      controlMin,
      { eventType: 'pointerdown', clientY: 100, clientX: 100 },
    );
    mockPointerEvent(
      controlMin,
      { eventType: 'pointermove', clientY: 100, clientX: 0 },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 0,
        to: 100,
      })
    );
  });

  test('try to move control; moving by clicking track; no sticky', () => {

    const { track,  updateModel } = createInstance();

    mockPointerEvent(
      track,
      { eventType: 'pointerdown', clientY: 100, clientX: 50 },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 4,
        to: 90,
      })
    );

  });

  test('try to move control; moving by clicking track; sticky', () => {

    const { testController, track,  updateModel } = createInstance();

    testController.update({sticky: true, step: 10})

    
    mockPointerEvent(
      track,
      { eventType: 'pointerdown', clientY: 100, clientX: 50 },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 0,
        to: 90,
      })
    );
  });

  test('try to move control; moving by key pressing; no sticky', () => {

    const { controlMin, controlMax,  updateModel } = createInstance();

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 89,
      })
    );

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: false },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 90,
      })
    );

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: false },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 11,
        to: 90,
      })
    );

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 90,
      })
    );

  });

  test('try to move control; moving by key pressing; sticky', () => {

    const { controlMin, controlMax,  updateModel } = createInstance({
      min: 0,
      max: 100,
      from: 10,
      to: 90,
      step: 2,
      sticky: true,
      shiftOnKeyDown: 2,
      shiftOnKeyHold: 5,
    });

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 86,
      })
    );

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: false },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 90,
      })
    );

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: false },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 14,
        to: 90,
      })
    );

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 90,
      })
    );

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: true },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 80,
      })
    );

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: true },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 90,
      })
    );

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: true },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 20,
        to: 90,
      })
    );

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: true },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 90,
      })
    );
  });

  test('try to move control if it has reached another control; moving by key pressing', () => {

    const {testController, controlMin, controlMax,  updateModel } = createInstance({
      min: 0,
      max: 100,
      from: 49,
      to: 50,
      step: 1,
      sticky: true,
      shiftOnKeyDown: 2,
      shiftOnKeyHold: 3,
    });

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: false },
    );

    expect(updateModel).toHaveBeenCalledTimes(0);

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 47,
        to: 50,
      })
    );

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: false },
    );

    testController.update({sticky: false});


    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 49,
        to: 49,
      })
    );
    expect(updateModel).toHaveBeenCalledTimes(4);
    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: false },
    );

    expect(updateModel).toHaveBeenCalledTimes(4);

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 47,
        to: 49,
      })
    );
  });

  test('try to move control if it is on its extreme position; moving by key pressing', () => {

    const {testController, controlMin, controlMax,  updateModel } = createInstance();

    testController.update({
      from: 0,
      to: 100,
      step: 1,
      sticky: true,
      shiftOnKeyDown: 2,
      shiftOnKeyHold: 3,
    })

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: false },
    );

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );

    testController.update({sticky: false});

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: false },
    );

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 0,
        to: 100,
      })
    );
  });

});
