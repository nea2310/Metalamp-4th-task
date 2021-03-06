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
  moovingControl: 'min',
  direction: 'ArrowLeft',
  repeat: false,
};

export const defaultData: IdataFull = {
  fromPosition: 0,
  toPosition: 0,
  marksArray: [{ position: 0, value: 0 }],
  intervalValue: '',
  stepValue: '',
  scaleBase: 'step',
  fromValue: '',
  toValue: '',
  thumb: defaultThumb,
};
