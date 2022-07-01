import { IConfFull, IdataFull } from '../interface';
import View from '../view/view';
import ViewBar from './view-bar/view-bar';
import ViewControl from './view-control/view-control';
import ViewScale from './view-scale/view-scale';

const parent = document.createElement('input');
parent.setAttribute('min', '10');
parent.setAttribute('max', '100');
parent.setAttribute('from', '20');
parent.setAttribute('to', '70');
parent.setAttribute('vertical', 'false');
parent.setAttribute('range', 'true');
parent.setAttribute('bar', 'true');
parent.setAttribute('tip', 'true');
parent.setAttribute('scale', 'true');
parent.setAttribute('scaleBase', 'true');
parent.setAttribute('step', 'step');
parent.setAttribute('interval', '0');
parent.setAttribute('sticky', 'false');
parent.setAttribute('shiftOnKeyDown', '1');
parent.setAttribute('shiftOnKeyHold', '1');

document.body.appendChild(parent);
const conf: IConfFull = {
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

const data: IdataFull = {
  fromPosition: 10,
  toPosition: 0,
  marksArray: [{ position: 0, value: 0 }],
  intervalValue: '',
  stepValue: '',
  scaleBase: 'step',
  fromValue: '',
  toValue: '',
  thumb: {
    type: '',
    clientY: 0,
    clientX: 0,
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    shiftBase: 0,
    moovingControl: 'min',
    direction: 'ArrowLeft',
    repeat: false,
  },
};

const testView = new View(parent);
const initSpy = jest.spyOn(testView, 'init');
testView.init(conf);
const testViewControl = testView.viewControl as ViewControl;
const testViewScale = testView.viewScale as ViewScale;
const testViewBar = testView.viewBar as ViewBar;

describe('ViewScale', () => {
  const updatePosSpy = jest.spyOn(testViewControl, 'updatePos');
  const updateInputSpy = jest.spyOn(testViewControl, 'updateInput');
  const updateValSpy = jest.spyOn(testViewControl, 'updateVal');
  const viewControl = testView.viewControl as ViewControl;
  test('init', () => {
    expect(initSpy).toBeCalledTimes(1);
    expect(testViewControl).toBeInstanceOf(ViewControl);
    expect(testViewScale).toBeInstanceOf(ViewScale);
    expect(testViewBar).toBeInstanceOf(ViewBar);
    expect(viewControl.observers).toHaveLength(2);
  });

  test('updateFromPos', async () => {
    testView.updateFromPos(data, conf);
    expect(updatePosSpy).toBeCalledTimes(1);
    expect(updatePosSpy).toBeCalledWith(viewControl.controlMin, 10);
    expect(updateInputSpy).toBeCalledTimes(1);
    expect(updateInputSpy).toBeCalledWith(conf);

    updatePosSpy.mockClear();
    updateInputSpy.mockClear();
  });

  // eslint-disable-next-line max-len
  test('should call updatePos and updateInput methods in view-control on calling updateToPos in view', () => {
    testView.updateToPos({
      ...data, fromPosition: 0, toPosition: 10,
    }, {
      ...conf,
      min: 0,
      from: 10,
      to: 90,
      step: 1,
      shiftOnKeyHold: 2,
    });
    expect(updatePosSpy).toBeCalledTimes(1);
    expect(updatePosSpy).toBeCalledWith(viewControl.controlMax, 10);
    expect(updateInputSpy).toBeCalledTimes(1);
    expect(updateInputSpy).toBeCalledWith({
      ...conf,
      min: 0,
      from: 10,
      to: 90,
      step: 1,
      shiftOnKeyHold: 2,
    });

    updatePosSpy.mockClear();
    updateInputSpy.mockClear();
  });

  test('updateFromValue', () => {
    testView.updateFromValue({ ...data, fromPosition: 0, fromValue: '10' });
    expect(updateValSpy).toBeCalledTimes(1);
    expect(updateValSpy).toBeCalledWith('10', true);
    updateValSpy.mockClear();
  });

  test('updateToValue', () => {
    testView.updateToValue({ ...data, fromPosition: 0, toValue: '10' });
    expect(updateValSpy).toBeCalledTimes(1);
    expect(updateValSpy).toBeCalledWith('10', false);
    updateValSpy.mockClear();
  });

  test('updateScale', () => {
    const createScaleSpy = jest.spyOn(testViewScale, 'createScale');
    testView.updateScale({
      ...data,
      fromPosition: 0,
      marksArray: [
        { position: 0, value: 0 },
        { position: 50, value: 5 },
        { position: 100, value: 10 },
      ],
    }, { ...conf, vertical: true });
    expect(createScaleSpy).toBeCalledTimes(1);
    expect(createScaleSpy).toBeCalledWith([
      { position: 0, value: 0 },
      { position: 50, value: 5 },
      { position: 100, value: 10 },
    ], { ...conf, vertical: true });
  });

  test('switchTip', async () => {
    const switchTipSpy = jest.spyOn(testViewControl, 'switchTip');
    testView.switchTip({ ...conf, tip: false });
    expect(switchTipSpy).toBeCalledTimes(1);
    expect(switchTipSpy).toBeCalledWith({ ...conf, tip: false });
  });
});
