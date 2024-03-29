import {
  IPluginConfigurationFull,
  IControlFull,
  IPluginPrivateData,
} from './interface';

export const defaultConfiguration: IPluginConfigurationFull = {
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
  round: 0,
  onUpdate: () => null,
  onChange: () => null,
};

export const defaultControlData: IControlFull = {
  type: '',
  clientY: 0,
  clientX: 0,
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  shiftBase: 0,
  movingControl: 'min',
  direction: 'ArrowLeft',
  repeat: false,
};

export const defaultData: IPluginPrivateData = {
  fromPosition: 0,
  toPosition: 0,
  marksArray: [{ position: 0, value: 0 }],
  intervalValue: '',
  stepValue: '',
  scaleBase: 'step',
  fromValue: '',
  toValue: '',
  control: defaultControlData,
};
