interface IConfFull {
  min: number;
  max: number;
  from: number;
  to: number;
  vertical: boolean;
  range: boolean;
  bar: boolean;
  tip: boolean;
  scale: boolean;
  scaleBase: 'step' | 'interval';
  step: number;
  interval: number;
  sticky: boolean;
  shiftOnKeyDown: number;
  shiftOnKeyHold: number;

  // eslint-disable-next-line no-unused-vars, no-use-before-define
  onStart: (data: IConf) => unknown;

  // eslint-disable-next-line no-unused-vars, no-use-before-define
  onChange: (data: IConf) => unknown;

  // eslint-disable-next-line no-unused-vars, no-use-before-define
  onUpdate: (data: IConf) => unknown;
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
  calcFromPosition: boolean;
  calcToPosition: boolean;
  calcScaleMarks: boolean;
  switchVertical: boolean;
  switchRange: boolean;
  switchScale: boolean;
  switchBar: boolean;
  switchTip: boolean;
  updateControlPos: boolean;
}

type TDirections = 'ArrowLeft' | 'ArrowDown' | 'ArrowRight' | 'ArrowUp';

type TMoveTypes = 'pointerdown' | 'pointermove' | '';

interface IthumbFull {
  type: TMoveTypes;
  clientY: number;
  clientX: number;
  top: number;
  left: number;
  width: number;
  height: number;
  shiftBase: number;
  moovingControl: 'min' | 'max';
  direction: TDirections;
  repeat: boolean;
}

interface IdataFull {
  fromPosition: number;
  toPosition: number;
  marksArray: { 'position': number, 'value': number }[];
  intervalValue: string;
  stepValue: string;
  scaleBase: 'step' | 'interval';
  fromValue: string;
  toValue: string;
  thumb: IthumbFull;
}

type TKeys = 'FromPosition'
  | 'ToPosition'
  | 'FromValue'
  | 'ToValue'
  | 'IsVertical'
  | 'IsRange'
  | 'IsSticky'
  | 'IsScale'
  | 'IsBar'
  | 'IsTip'
  | 'Scale'
  | 'MoveEvent'
  | 'KeydownEvent';

interface INotifyParameters {
  key: TKeys;
  data: IdataFull;
  conf: IConfFull;
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
  TKeys,
  TDirections,
  TMoveTypes,
};
