interface IControlStateData {
  type: TControlMovementTypes;
  clientY: number;
  clientX: number;
  top: number;
  left: number;
  width: number;
  height: number;
  shiftBase: number;
  movingControl: 'min' | 'max';
}

interface IControlFull {
  type: TControlMovementTypes;
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

interface IViewData {
  from?: number,
  to?: number,
  round?: number,
}

interface IViewScaleState {
  scaleMarks: IScaleMark[],
  step: number,
  interval: number,
}

interface IBusinessDataIndexed extends Partial<IBusinessData> {
  [key: string]: unknown;
}

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

interface IPluginConfigurationFullIndexed extends IPluginConfigurationFull {
  [key: string]: unknown;
}

interface INotificationParameters {
  key: TNotificationKeys;
  data: IPluginPrivateData;
  conf: IPluginConfigurationFull;
}

interface IScaleMark {
  value: number;
  position: number;
}

interface IViewControlState {
  fromPosition: number,
  toPosition: number,
  from: number,
  to: number,
  isRange: boolean,
  isVertical: boolean,
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

type TPluginConfiguration = Partial<IPluginConfigurationFull>;

type TControlKeydownTypes = 'ArrowLeft' | 'ArrowDown' | 'ArrowRight' | 'ArrowUp';

type TControlMovementTypes = 'pointerdown' | 'pointermove' | '';

type TNotificationKeys =
| 'FromPosition'
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

type TControlStopTypes = 'normal' | 'min' | 'max' | 'meetMin' | 'meetMax';

type TInputTypes = 'input' | 'toggle' | 'radiobuttons';

type TPluginConfigurationItem = [string, unknown];

export {
  IControlStateData,
  IPluginPrivateData,
  IControlFull,
  IPluginConfigurationFull,
  IPluginConfigurationFullIndexed,
  INotificationParameters,
  IScaleMark,
  IMockedElement,
  IDOMElement,
  TPluginConfiguration,
  TControlKeydownTypes,
  TControlMovementTypes,
  TNotificationKeys,
  TControlStopTypes,
  TInputTypes,
  TPluginConfigurationItem,
  IBusinessData,
  IBusinessDataIndexed,
  IViewData,
  IViewScaleState,
  IViewControlState,
};
