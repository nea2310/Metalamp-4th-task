interface IConfFull {
  min: number
  max: number
  from: number
  to: number
  vertical: boolean
  range: boolean
  bar: boolean
  tip: boolean
  scale: boolean
  scaleBase: string
  step: number
  interval: number
  sticky: boolean
  shiftOnKeyDown: number
  shiftOnKeyHold: number
  onStart: Function
  onChange: Function
  onUpdate: Function
}

interface IConfFullIndexed extends IConfFull {
  [value: string]: boolean | number | string | Function
}

type IConf = Partial<IConfFull>

interface IObject {
  value: number;
  position: number;
}

interface Imethods {
  calcFromPosition: boolean,
  calcToPosition: boolean,
  calcScaleMarks: boolean
  calcBarLength: boolean
  switchVertical: boolean
  switchRange: boolean
  switchScale: boolean
  switchBar: boolean
  switchTip: boolean
  updateControlPos: boolean
}

interface IthumbFull {
  type: string;
  clientY: number;
  clientX: number;
  top: number;
  left: number;
  width: number;
  height: number;
  shiftBase: number;
  moovingControl: string;
  key: string;
  repeat: boolean;
}

interface IdataFull {
  fromPosition: number;
  toPosition: number;
  marksArray: { 'position': number, 'value': number }[];
  intervalValue: string;
  stepValue: string;
  scaleBase: string;
  barWidth: number;
  barPos: number;
  fromValue: string;
  toValue: string;
  thumb: IthumbFull;
}

interface INotifyParameters {
  key: string,
  data: IdataFull,
  conf: IConfFull
}

export {
  IConf,
  IObject,
  Imethods,
  INotifyParameters,
  IConfFull,
  IConfFullIndexed,
  IdataFull,
  IthumbFull,
};
