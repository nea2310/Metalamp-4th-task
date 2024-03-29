import { TPluginConfiguration } from './interface';
import Model from './model/Model';
import View from './view/View';
import Controller from './controller/Controller';

type Data = {
  configuration: TPluginConfiguration;
  dataAttributes: { name: string, value: string }[];
  minControlPosition: number;
  maxControlPosition: number;
  scalemarkSize: number;
  scalemarkY: number;
  sliderWidth: number;
  trackWidth: number;
  trackHeight: number;
  trackTop: number;
  trackLeft: number;
  trackBottom: number;
  trackRight: number;
};

const defaultData = {
  configuration: {
    min: 0,
    max: 100,
    from: 10,
    to: 90,
  },
  dataAttributes: [],
  minControlPosition: 0,
  maxControlPosition: 0,
  scalemarkSize: 10,
  scalemarkY: 60,
  sliderWidth: 575,
  trackWidth: 500,
  trackHeight: 50,
  trackTop: 30,
  trackLeft: 30,
  trackBottom: 50,
  trackRight: 50,
};

const dimensions = {
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
  toJSON: () => undefined,
};

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

const createInstance = (
  data?: Partial<Data>,

) => {
  const {
    configuration,
    dataAttributes,
    minControlPosition,
    maxControlPosition,
    scalemarkSize,
    scalemarkY,
    sliderWidth,
    trackWidth,
    trackHeight,
    trackTop,
    trackLeft,
    trackBottom,
    trackRight,
  } = { ...defaultData, ...data };

  const wrapper = document.createElement('div');
  const parent = document.createElement('input');
  dataAttributes.forEach((item) => {
    const { name, value } = item;
    parent.setAttribute(`data-${name}`, value);
  });
  document.body.appendChild(wrapper);
  wrapper.appendChild(parent);

  const getElement = (selector: string) => wrapper.querySelector(`.js-slider-metalamp__${selector}`);

  const testModel = new Model();
  const testView = new View(parent);
  const testController = new Controller(testModel, testView, {});

  testController.update(configuration);

  const slider = getElement('wrapper');
  const controlMax = getElement('control-max');
  const controlMin = getElement('control-min');
  const tipMin = getElement('tip-min');
  const tipMax = getElement('tip-max');
  const track = getElement('track');
  const bar = getElement('progress-bar');
  const scaleMarks = wrapper.querySelectorAll('.js-slider-metalamp__mark');

  const trackDimensions = {
    ...dimensions,
    width: trackWidth,
    height: trackHeight,
    top: trackTop,
    left: trackLeft,
    bottom: trackBottom,
    right: trackRight,
  };

  const scalemarkDimensions = {
    ...dimensions,
    width: scalemarkSize,
    height: scalemarkSize,
    y: scalemarkY,
  };

  if (slider) {
    slider.getBoundingClientRect = jest.fn(() => (trackDimensions));

    Object.defineProperty(slider, 'offsetWidth', {
      writable: true,
      configurable: true,
      value: sliderWidth,
    });
  }

  if (controlMin) {
    controlMin.getBoundingClientRect = jest.fn(() => ({
      ...dimensions,
      left: minControlPosition,
      bottom: minControlPosition,

    }));
  }

  if (controlMax) {
    controlMax.getBoundingClientRect = jest.fn(() => ({
      ...dimensions,
      left: maxControlPosition,
      bottom: maxControlPosition,
    }));
  }

  scaleMarks.forEach((item, index) => {
    const scaleMark = item;
    const label = item.firstElementChild;

    if (label instanceof HTMLElement) {
      label.innerText = String(index);
      label.getBoundingClientRect = jest.fn(() => (
        { ...scalemarkDimensions, x: index * scalemarkSize }));
    }

    scaleMark.getBoundingClientRect = jest.fn(() => (
      { ...scalemarkDimensions, x: index * scalemarkSize }));
  });

  if (track) {
    track.getBoundingClientRect = jest.fn(() => (trackDimensions));
  }
  let scale = null;
  if (controlMax) {
    scale = controlMax.parentElement;
  }
  if (scale) {
    scale.getBoundingClientRect = jest.fn(() => (trackDimensions));
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
    scaleMarks,
    slider,
  };
};

export { mockPointerEvent, mockKeyboardEvent, createInstance };
