import { IConf } from './../interface';
import { View } from './../view/view';
import { ViewBar } from './view-bar/view-bar';
import { ViewControl } from './view-control/view-control';
import { ViewScale } from './view-scale/view-scale';


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
const conf: IConf = {
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
};

const testView = new View(parent);
const initSpy = jest.spyOn(testView, 'init');
testView.init(conf);
const testViewControl = testView.viewControl;
const testViewScale = testView.viewScale;
const testViewBar = testView.viewBar;



describe('ViewScale', () => {
  const updatePosSpy = jest.spyOn(testViewControl, 'updatePos');
  const updateInputSpy = jest.spyOn(testViewControl, 'updateInput');
  const updateValSpy = jest.spyOn(testViewControl, 'updateVal');
  test('init', () => {
    expect(initSpy).toBeCalledTimes(1);
    expect(testViewControl).toBeInstanceOf(ViewControl);
    expect(testViewScale).toBeInstanceOf(ViewScale);
    expect(testViewBar).toBeInstanceOf(ViewBar);
    expect(testView.viewControl.observers).toHaveLength(2);
  });

  test('updateFromPos', async () => {
    const conf = {};
    const data = { fromPos: 10 };
    testView.updateFromPos(data, conf);
    expect(updatePosSpy).toBeCalledTimes(1);
    expect(updatePosSpy).toBeCalledWith(
      testView.viewControl.controlMin, 10);
    expect(updateInputSpy).toBeCalledTimes(1);
    expect(updateInputSpy).toBeCalledWith({});

    updatePosSpy.mockClear();
    updateInputSpy.mockClear();
  });


  // eslint-disable-next-line max-len
  test('should call updatePos and updateInput methods in view-control on calling updateToPos in view', () => {
    const conf = {
      min: 0,
      max: 100,
      from: 10,
      to: 90,
      vertical: false,
      range: true,
      bar: true,
      tip: true,
      scale: true,
      scaleBase: 'step',
      step: 1,
      interval: 0,
      sticky: false,
      shiftOnKeyDown: 1,
      shiftOnKeyHold: 2,
    };
    const data = { toPos: 10 };
    testView.updateToPos(data, conf);
    expect(updatePosSpy).toBeCalledTimes(1);
    expect(updatePosSpy).toBeCalledWith(
      testView.viewControl.controlMax, data.toPos);
    expect(updateInputSpy).toBeCalledTimes(1);
    expect(updateInputSpy).toBeCalledWith(conf);

    updatePosSpy.mockClear();
    updateInputSpy.mockClear();
  });

  test('updateFromVal', () => {
    const data = { fromVal: '10' };
    testView.updateFromVal(data);
    expect(updateValSpy).toBeCalledTimes(1);
    expect(updateValSpy).toBeCalledWith('10', true);
    updateValSpy.mockClear();
  });

  test('updateToVal', () => {
    const data = { toVal: '10' };
    testView.updateToVal(data);
    expect(updateValSpy).toBeCalledTimes(1);
    expect(updateValSpy).toBeCalledWith('10', false);
    updateValSpy.mockClear();
  });

  test('updateScale', () => {
    const conf = { vertical: true, scale: true };
    const data = {
      marksArr: [
        { pos: 0, val: 0 },
        { pos: 50, val: 5 },
        { pos: 100, val: 10 }
      ]
    };
    const createScaleSpy = jest.spyOn(testViewScale, 'createScale');
    testView.updateScale(data, conf);
    expect(createScaleSpy).toBeCalledTimes(1);
    expect(createScaleSpy).toBeCalledWith([
      { pos: 0, val: 0 },
      { pos: 50, val: 5 },
      { pos: 100, val: 10 }
    ], conf);
  });

  test('updateBar', () => {
    const conf = { vertical: true, scale: true };
    const data = { barPos: 10, barWidth: 100 };
    const updateBarSpy = jest.spyOn(testViewBar, 'updateBar');
    testView.updateBar(data, conf);
    expect(updateBarSpy).toBeCalledTimes(1);
    expect(updateBarSpy).toBeCalledWith(10, 100, true);
  });

  test('switchScale', () => {
    const conf = { vertical: true, scale: true };
    const switchScaleSpy = jest.spyOn(testViewScale, 'switchScale');
    testView.switchScale(conf);
    expect(switchScaleSpy).toBeCalledTimes(1);
    expect(switchScaleSpy).toBeCalledWith(conf);
  });

  test('switchBar', () => {
    const conf = { bar: false };
    const switchBarSpy = jest.spyOn(testViewBar, 'switchBar');
    testView.switchBar(conf);
    expect(switchBarSpy).toBeCalledTimes(1);
    expect(switchBarSpy).toBeCalledWith(conf);
  });

  test('switchTip', async () => {
    const conf = { tip: true };
    const switchTipSpy = jest.spyOn(testViewControl, 'switchTip');
    testView.switchTip(conf);
    expect(switchTipSpy).toBeCalledTimes(1);
    expect(switchTipSpy).toBeCalledWith(conf);
  });
});
