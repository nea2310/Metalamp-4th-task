import { TPluginConfiguration } from './interface';
import Model from './model/Model';
import View from './view/View';
import Controller from './controller/Controller';

function mockPointerEvent(
  element: HTMLElement,
  {
    eventType,
    clientX = 0,
    clientY = 0,
  }: {
    eventType: string;
    clientX?: number;
    clientY?: number;
  },
): void {
  const pointerEvent = new MouseEvent(eventType, {
    bubbles: true,
    clientX,
    clientY,
  });

  const targetElement = element;

  targetElement.setPointerCapture = jest.fn(targetElement.setPointerCapture);
  targetElement.releasePointerCapture = jest.fn(
    targetElement.releasePointerCapture,
  );
  targetElement.dispatchEvent(pointerEvent);
}

function mockKeyboardEvent(
  element: HTMLElement,
  {
    eventType,
    direction = 'ArrowLeft',
    repeat = false,
  }: { eventType: string; direction: string; repeat: boolean },
): void {
  const keyboardEvent = new KeyboardEvent(eventType, {
    code: direction,
    repeat,
    bubbles: true,
  });

  const targetElement = element;

  targetElement.setPointerCapture = jest.fn(targetElement.setPointerCapture);
  targetElement.releasePointerCapture = jest.fn(
    targetElement.releasePointerCapture,
  );
  targetElement.dispatchEvent(keyboardEvent);
}

const getElement = (selector: string, wrapper: HTMLElement) => wrapper.querySelector(selector);

const createInstance = (
  configuration: TPluginConfiguration = {
    min: 0,
    max: 100,
    from: 10,
    to: 90,
  },
  dataAttributes: { name: string, value: string }[] = [],
  minControlPosition = 0,
  maxControlPosition = 0,

) => {
  const wrapper = document.createElement('div');
  const parent = document.createElement('input');
  dataAttributes.forEach((item) => {
    const { name, value } = item;
    parent.setAttribute(`data-${name}`, value);
  });
  document.body.appendChild(wrapper);
  wrapper.appendChild(parent);
  const testModel = new Model();
  const testView = new View(parent);
  const testController = new Controller(testModel, testView, {});

  testController.update(configuration);

  const controlMax = getElement('.slider-metalamp__control-max', wrapper);
  const controlMin = getElement('.slider-metalamp__control-min', wrapper);
  const tipMin = getElement('.slider-metalamp__tip-min', wrapper);
  const tipMax = getElement('.slider-metalamp__tip-max', wrapper);
  const track = getElement('.slider-metalamp__track', wrapper);
  const bar = getElement('.slider-metalamp__progress-bar', wrapper);
  if (controlMin) {
    controlMin.getBoundingClientRect = jest.fn(() => ({
      width: 0,
      height: 0,
      top: 0,
      left: minControlPosition,
      bottom: minControlPosition,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => undefined,
    }));
  }
  if (controlMax) {
    controlMax.getBoundingClientRect = jest.fn(() => ({
      width: 0,
      height: 0,
      top: 0,
      left: maxControlPosition,
      bottom: maxControlPosition,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => undefined,
    }));
  }
  if (track) {
    track.getBoundingClientRect = jest.fn(() => ({
      width: 500,
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
  let scale = null;
  if (controlMax) {
    scale = controlMax.parentElement;
  }
  if (scale) {
    scale.getBoundingClientRect = jest.fn(() => ({
      width: 500,
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

  const updateModel = jest.spyOn(testModel, 'update');
  return {
    testController,
    bar,
    scale,
    track,
    controlMin,
    controlMax,
    updateModel,
    tipMin,
    tipMax,
    testModel,
  };
};

export { mockPointerEvent, mockKeyboardEvent, createInstance };
