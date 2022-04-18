import {
  IConfFull,
  IthumbFull,
  IdataFull,
} from './interface';

export const defaultConf: IConfFull = {
  min: 0,
  max: 0,
  from: 0,
  to: 0,
  vertical: false,
  range: true,
  bar: true,
  tip: true,
  scale: true,
  scaleBase: 'step',
  step: 0,
  interval: 0,
  sticky: false,
  shiftOnKeyDown: 0,
  shiftOnKeyHold: 0,
  onStart: () => true,
  onChange: () => true,
  onUpdate: () => true,
};

export const defaultThumb: IthumbFull = {
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
};

export const defaultData: IdataFull = {
  fromPos: 0,
  toPos: 0,
  marksArr: [{ pos: 0, val: 0 }],
  intervalValue: '',
  stepValue: '',
  scaleBase: '',
  barWidth: 0,
  barPos: 0,
  fromVal: '',
  toVal: '',
  thumb: defaultThumb,
};
