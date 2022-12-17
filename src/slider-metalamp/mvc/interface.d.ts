interface IData {
  type: TSliderMovementTypes;
  clientY: number;
  clientX: number;
  top: number;
  left: number;
  width: number;
  height: number;
  shiftBase: number;
  movingControl: 'min' | 'max';
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
  slider: ISliderFull;
}

interface ISliderFull {
  type: TSliderMovementTypes;
  clientY: number;
  clientX: number;
  top: number;
  left: number;
  width: number;
  height: number;
  shiftBase: number;
  movingControl: 'min' | 'max';
  direction: TSliderKeydownTypes;
  repeat: boolean;
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
  onStart: (data: IPluginConfiguration) => unknown;
  onChange: (data: IPluginConfiguration) => unknown;
  onUpdate: (data: IPluginConfiguration) => unknown;
}

interface IPluginConfigurationFullIndexed extends IPluginConfigurationFull {
  [key: string]: boolean | number | string | Function;
}

type IPluginConfiguration = Partial<IPluginConfigurationFull>;

interface IPluginConfigurationItem {
  value: number;
  position: number;
}

type TSliderKeydownTypes = 'ArrowLeft' | 'ArrowDown' | 'ArrowRight' | 'ArrowUp';

type TSliderMovementTypes = 'pointerdown' | 'pointermove' | '';

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

interface INotificationParameters {
  key: TNotificationKeys;
  data: IPluginPrivateData;
  conf: IPluginConfigurationFull;
}

type TSliderStopTypes = 'normal' | 'min' | 'max' | 'meetMin' | 'meetMax';

type TAllowedTypes = 'input' | 'toggle' | 'radiobuttons';

type TPluginConfigurationItem = [string, unknown];

interface IDOMElement extends Element {
  value?: string;
  readonly offsetHeight?: number;
  readonly offsetWidth?: number;
  clickOutsideEvent?(): void;
}

interface IMockedElement {
  width: number;
  height: number;
  padding?: number;
  x?: number;
  y?: number;
}

export {
  IPluginConfiguration,
  IPluginConfigurationItem,
  INotificationParameters,
  IPluginConfigurationFull,
  IPluginConfigurationFullIndexed,
  IPluginPrivateData,
  ISliderFull,
  TSliderKeydownTypes,
  IData,
  TSliderStopTypes,
  TAllowedTypes,
  TPluginConfigurationItem,
  IDOMElement,
  IMockedElement
};
