import { IConfFull } from '../interface';
import { View } from '../view/view';
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
    // const conf = {};
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
    const data = {
      fromPos: 10,
      toPos: 0,
      marksArr: [{ pos: 0, val: 0 }],
      intervalValue: '',
      stepValue: '',
      scaleBase: '',
      barWidth: 0,
      barPos: 0,
      fromVal: '',
      toVal: '',
      thumb: {
        type: '',
        clientY: 0,
        clientX: 0,
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        shiftBase: 0,
        moovingControl: '',
        key: '',
        repeat: false,
      },
    };
    const viewControl = testView.viewControl as ViewControl;
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
      onStart: () => true,
      onChange: () => true,
      onUpdate: () => true,
    };
    const data = {
      fromPos: 0,
      toPos: 10,
      marksArr: [{ pos: 0, val: 0 }],
      intervalValue: '',
      stepValue: '',
      scaleBase: '',
      barWidth: 0,
      barPos: 0,
      fromVal: '',
      toVal: '',
      thumb: {
        type: '',
        clientY: 0,
        clientX: 0,
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        shiftBase: 0,
        moovingControl: '',
        key: '',
        repeat: false,
      },
    };
    const viewControl = testView.viewControl as ViewControl;
    testView.updateToPos(data, conf);
    expect(updatePosSpy).toBeCalledTimes(1);
    expect(updatePosSpy).toBeCalledWith(viewControl.controlMax, data.toPos);
    expect(updateInputSpy).toBeCalledTimes(1);
    expect(updateInputSpy).toBeCalledWith(conf);

    updatePosSpy.mockClear();
    updateInputSpy.mockClear();
  });

  test('updateFromVal', () => {
    const data = {
      fromPos: 0,
      toPos: 0,
      marksArr: [{ pos: 0, val: 0 }],
      intervalValue: '',
      stepValue: '',
      scaleBase: '',
      barWidth: 0,
      barPos: 0,
      fromVal: '10',
      toVal: '',
      thumb: {
        type: '',
        clientY: 0,
        clientX: 0,
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        shiftBase: 0,
        moovingControl: '',
        key: '',
        repeat: false,
      },
    };
    testView.updateFromVal(data);
    expect(updateValSpy).toBeCalledTimes(1);
    expect(updateValSpy).toBeCalledWith('10', true);
    updateValSpy.mockClear();
  });

  test('updateToVal', () => {
    const data = {
      fromPos: 0,
      toPos: 0,
      marksArr: [{ pos: 0, val: 0 }],
      intervalValue: '',
      stepValue: '',
      scaleBase: '',
      barWidth: 0,
      barPos: 0,
      fromVal: '',
      toVal: '10',
      thumb: {
        type: '',
        clientY: 0,
        clientX: 0,
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        shiftBase: 0,
        moovingControl: '',
        key: '',
        repeat: false,
      },
    };
    testView.updateToVal(data);
    expect(updateValSpy).toBeCalledTimes(1);
    expect(updateValSpy).toBeCalledWith('10', false);
    updateValSpy.mockClear();
  });

  test('updateScale', () => {
    // const conf = { vertical: true, scale: true };
    const conf: IConfFull = {
      min: 10,
      max: 100,
      from: 20,
      to: 70,
      vertical: true,
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
    const data = {

      fromPos: 0,
      toPos: 0,
      marksArr: [
        { pos: 0, val: 0 },
        { pos: 50, val: 5 },
        { pos: 100, val: 10 },
      ],
      intervalValue: '',
      stepValue: '',
      scaleBase: '',
      barWidth: 0,
      barPos: 0,
      fromVal: '',
      toVal: '',
      thumb: {
        type: '',
        clientY: 0,
        clientX: 0,
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        shiftBase: 0,
        moovingControl: '',
        key: '',
        repeat: false,
      },
    };
    const createScaleSpy = jest.spyOn(testViewScale, 'createScale');
    testView.updateScale(data, conf);
    expect(createScaleSpy).toBeCalledTimes(1);
    expect(createScaleSpy).toBeCalledWith([
      { pos: 0, val: 0 },
      { pos: 50, val: 5 },
      { pos: 100, val: 10 },
    ], conf);
  });

  test('updateBar', () => {
    //  const conf = { vertical: true, scale: true };
    const conf: IConfFull = {
      min: 10,
      max: 100,
      from: 20,
      to: 70,
      vertical: true,
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
    const data = {
      fromPos: 0,
      toPos: 0,
      marksArr: [{ pos: 0, val: 0 }],
      intervalValue: '',
      stepValue: '',
      scaleBase: '',
      barWidth: 100,
      barPos: 10,
      fromVal: '',
      toVal: '',
      thumb: {
        type: '',
        clientY: 0,
        clientX: 0,
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        shiftBase: 0,
        moovingControl: '',
        key: '',
        repeat: false,
      },
    };
    const updateBarSpy = jest.spyOn(testViewBar, 'updateBar');
    testView.updateBar(data, conf);
    expect(updateBarSpy).toBeCalledTimes(1);
    expect(updateBarSpy).toBeCalledWith(10, 100, true);
  });

  test('switchScale', () => {
    //  const conf = { vertical: true, scale: true };
    const conf: IConfFull = {
      min: 10,
      max: 100,
      from: 20,
      to: 70,
      vertical: true,
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
    const switchScaleSpy = jest.spyOn(testViewScale, 'switchScale');
    testView.switchScale(conf);
    expect(switchScaleSpy).toBeCalledTimes(1);
    expect(switchScaleSpy).toBeCalledWith(conf);
  });

  test('switchBar', () => {
    //  const conf = { bar: false };
    const conf: IConfFull = {
      min: 10,
      max: 100,
      from: 20,
      to: 70,
      vertical: false,
      range: true,
      bar: false,
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
    const switchBarSpy = jest.spyOn(testViewBar, 'switchBar');
    testView.switchBar(conf);
    expect(switchBarSpy).toBeCalledTimes(1);
    expect(switchBarSpy).toBeCalledWith(conf);
  });

  test('switchTip', async () => {
    //  const conf = { tip: true };
    const conf: IConfFull = {
      min: 10,
      max: 100,
      from: 20,
      to: 70,
      vertical: false,
      range: true,
      bar: true,
      tip: false,
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
    const switchTipSpy = jest.spyOn(testViewControl, 'switchTip');
    testView.switchTip(conf);
    expect(switchTipSpy).toBeCalledTimes(1);
    expect(switchTipSpy).toBeCalledWith(conf);
  });
});
