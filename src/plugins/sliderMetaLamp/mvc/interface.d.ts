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

interface IConf {
  min?: number
  max?: number
  from?: number
  to?: number
  vertical?: boolean
  range?: boolean
  bar?: boolean
  tip?: boolean
  scale?: boolean
  scaleBase?: string
  step?: number
  interval?: number
  sticky?: boolean
  shiftOnKeyDown?: number
  shiftOnKeyHold?: number
  onStart?: Function
  onChange?: Function
  onUpdate?: Function
}

interface IObj {
  val: number;
  pos: number;
}

interface Imethods {
  calcFromPosition: boolean,
  calcToPosition: boolean,
  calcScale: boolean
  calcBar: boolean
  switchVertical: boolean
  switchRange: boolean
  switchScale: boolean
  switchBar: boolean
  switchTip: boolean
  updateControlPos: boolean
}


interface IdataFull {
  fromPos: number;
  toPos: number;
  marksArr: { 'pos': number, 'val': number }[];
  intervalValue: string;
  stepValue: string;
  scaleBase: string;
  barWidth: number;
  barPos: number;
  fromVal: string;
  toVal: string;
  thumb: IthumbFull;
}

interface Idata {
  fromPos?: number
  toPos?: number
  marksArr?: { 'pos'?: number, 'val'?: number }[];
  intervalValue?: string
  stepValue?: string
  scaleBase?: string
  barWidth?: number
  barPos?: number
  fromVal?: string
  toVal?: string
  thumb?: Ithumb
}

interface Ithumb {
  type?: string;
  clientY?: number;
  clientX?: number;
  top?: number;
  left?: number;
  width?: number;
  height?: number;
  shiftBase?: number;
  moovingControl?: string;
  key?: string;
  repeat?: boolean;
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

interface IFireParms {
  key: string,
  data: IdataFull,
  conf: IConfFull
}

export {
  IConf,
  IObj,
  Imethods,
  Idata,
  IFireParms,
  IConfFull,
  IdataFull,
  IthumbFull
};