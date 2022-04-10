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
  val?: number;
  pos?: number;
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
  fromPos: number | undefined;
  toPos: number | undefined;
  marksArr: { 'pos'?: number, 'val'?: number }[] | undefined;
  intervalValue: string | undefined;
  stepValue: string | undefined;
  scaleBase: string | undefined;
  barWidth: number | undefined;
  barPos: number | undefined;
  fromVal: string | undefined;
  toVal: string | undefined;
  thumb: Ithumb | undefined;
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
  type: string | undefined;
  clientY: number | undefined;
  clientX: number | undefined;
  top: number | undefined;
  left: number | undefined;
  width: number | undefined;
  height: number | undefined;
  shiftBase: number | undefined;
  moovingControl: string | undefined;
  key: string | undefined;
  repeat: boolean | undefined;
}

interface IFireParms {
  key?: string,
  data?: Idata,
  conf?: IConfFull
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