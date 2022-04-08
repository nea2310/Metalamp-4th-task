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
  onStart?: Function | null
  onChange?: Function | null
  onUpdate?: Function | null
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
  type?: string,
  clientY?: number,
  clientX?: number,
  top?: number,
  left?: number,
  width?: number,
  height?: number,
  shiftBase?: number,
  moovingControl?: string,
  key?: string,
  repeat?: boolean
}

interface IFireParms {
  key?: string,
  data?: Idata,
  conf?: IConf
}

export {
  IConf,
  IObj,
  Imethods,
  Idata,
  IFireParms
};