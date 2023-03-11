interface IPluginConfigurationFull {
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
  round: number;
  onUpdate: (data: TPluginConfiguration) => unknown;
  onChange: (data: IViewData) => unknown;
}

type TPluginConfiguration = Partial<IPluginConfigurationFull>;

interface IPluginPrivateData {
  fromPosition: number;
  toPosition: number;
  marksArray: { 'position': number, 'value': number }[];
  intervalValue: string;
  stepValue: string;
  scaleBase: 'step' | 'interval';
  fromValue: string;
  toValue: string;
  control: IControlFull;
}

interface IBusinessData {
  min: number;
  max: number;
  from: number;
  to: number;
  range: boolean;
  shiftOnKeyDown: number;
  shiftOnKeyHold: number;
}

interface IBusinessDataIndexed extends Partial<IBusinessData> {
  [key: string]: unknown;
}

interface IControlFull {
  type: 'pointerdown' | 'pointermove' | '';
  clientY: number;
  clientX: number;
  top: number;
  left: number;
  width: number;
  height: number;
  shiftBase: number;
  movingControl: 'min' | 'max';
  direction: TControlKeydownTypes;
  repeat: boolean;
}

interface IControlState {
  fromPosition: number,
  toPosition: number,
  from: number,
  to: number,
  isRange: boolean,
  isVertical: boolean,
}

interface IViewData {
  from?: number,
  to?: number,
  round?: number,
  step?: number,
  interval?: number
}

interface IScaleState {
  scaleMarks: IScaleMark[],
  step: number,
  interval: number,
}

interface IScaleMark {
  value: number;
  position: number;
}

interface IMockedElement {
  width: number;
  height: number;
  padding?: number;
  x?: number;
  y?: number;
}

interface IDOMElement extends Element {
  value?: string;
  readonly offsetHeight?: number;
  readonly offsetWidth?: number;
  clickOutsideEvent?(): void;
}

interface IEventTarget extends Omit<EventTarget, 'addEventListener'> {
  readonly classList?: DOMTokenList;
  readonly parentElement?: HTMLElement | null;
}

type TControlKeydownTypes = 'ArrowLeft' | 'ArrowDown' | 'ArrowRight' | 'ArrowUp';

type TControlStopTypes = 'normal' | 'min' | 'max' | 'meetMin' | 'meetMax';

type TInputTypes = 'input' | 'toggle' | 'radiobuttons';

export {
  IPluginConfigurationFull,
  IPluginPrivateData,
  IControlFull,
  IScaleMark,
  IMockedElement,
  IDOMElement,
  TPluginConfiguration,
  TControlKeydownTypes,
  TControlStopTypes,
  TInputTypes,
  IBusinessData,
  IBusinessDataIndexed,
  IViewData,
  IScaleState,
  IControlState,
  IEventTarget,
};
