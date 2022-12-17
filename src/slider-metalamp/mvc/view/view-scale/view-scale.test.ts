import { IPluginConfigurationFull, IMockedElement } from '../../interface';
import ViewScale from './ViewScale';

function mockElementDimensions(element: HTMLElement, {
  width, height, padding = 0, x = 0, y = 0,
}: IMockedElement) {
  const targetElement = element;

  targetElement.getBoundingClientRect = jest.fn(() => {
    const rect = {
      x,
      y,
      left: x,
      top: y,
      width,
      height,
      right: x + width,
      bottom: y + height,
    };
    return { ...rect, toJSON: () => rect };
  });
  Object.defineProperties(targetElement, {
    offsetWidth: { value: width + 2 * padding },
    offsetHeight: { value: height + 2 * padding },
  });
  return targetElement;
}

function createMarkList(
  scaleMarks: { 'position'?: number, 'value'?: number }[],
  wrapper: HTMLElement,
  elemWidth: number,
  elemHeight: number,
) {
  return scaleMarks.map(() => {
    const elem = document.createElement('div');
    elem.classList.add('js-slider-metalamp__mark');
    const label = document.createElement('div');
    mockElementDimensions(elem, { width: elemWidth, height: elemHeight });
    mockElementDimensions(label, { width: elemWidth, height: elemHeight });
    elem.appendChild(label);
    wrapper.appendChild(elem);
    return elem;
  });
}

const marksArray = [
  { position: 0, value: 0 },
  { position: 50, value: 5 },
  { position: 100, value: 10 },
];

const conf: IPluginConfigurationFull = {
  min: 10,
  max: 100,
  from: 20,
  to: 70,
  vertical: false,
  range: true,
  bar: true,
  tip: true,
  scale: true,
  scaleBase: 'step',
  step: 10,
  interval: 0,
  sticky: false,
  shiftOnKeyDown: 1,
  shiftOnKeyHold: 1,
  onStart: () => true,
  onChange: () => true,
  onUpdate: () => true,
};

function prepareInstance(
  scaleMarks: { 'position'?: number, 'value'?: number }[],
  config: IPluginConfigurationFull,
  mockDimensions: boolean,
) {
  const root = document.createElement('input');
  const slider = document.createElement('div');
  root.after(slider);
  const track = document.createElement('div');
  slider.append(track);
  let testViewScale: ViewScale;
  if (mockDimensions) {
    mockElementDimensions(track, { width: 100, height: 100 });
    const markList = createMarkList(scaleMarks, track, 100, 100);
    testViewScale = new ViewScale(slider, track, config, markList);
  } else testViewScale = new ViewScale(slider, track, config);

  return testViewScale;
}

describe('ViewScale', () => {
  test('scale marks are not hidden if their total width (height) is less or equal to slider width (height)', () => {
    const testViewScale = prepareInstance(marksArray, conf, false);
    expect(testViewScale.createScale(marksArray, conf))
      .toHaveLength(3);
  });

  test('scale marks are hidden if their total width (height) is less or equal to slider width (height)', () => {
    const testViewScale = prepareInstance(marksArray, conf, true);
    expect(testViewScale.createScale(marksArray, conf))
      .toHaveLength(1);
  });
});
