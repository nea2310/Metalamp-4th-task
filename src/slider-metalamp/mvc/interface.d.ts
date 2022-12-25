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
  step: number;
  interval: number;
  scaleBase: 'step' | 'interval';
  shiftOnKeyDown: number;
  shiftOnKeyHold: number,
  onStart: (data: TPluginConfiguration) => unknown;
  onChange: (data: TPluginConfiguration) => unknown;
  onUpdate: (data: TPluginConfiguration) => unknown;
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
  onStart: (data: TPluginConfiguration) => unknown;
  onChange: (data: TPluginConfiguration) => unknown;
  onUpdate: (data: TPluginConfiguration) => unknown;
}

interface IPluginConfigurationFullIndexed extends IPluginConfigurationFull {
  [key: string]: unknown;
}

interface INotificationParameters {
  key: TNotificationKeys;
  data: IPluginPrivateData;
  conf: IPluginConfigurationFull;
}

interface IPluginConfigurationItem {
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
  IPluginConfigurationItem,
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
  IBusinessDataIndexed
};
