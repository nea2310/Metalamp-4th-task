import View from '../view/View';
import Model from '../model/Model';
import Observer from '../Observer';
import {
  TPluginConfiguration,
  IPluginConfigurationFull,
} from '../interface';

import { defaultConf } from '../utils';

class Controller extends Observer {
  private onStart: ((data: any) => unknown) | undefined = () => true;

  private onUpdate: ((data: any) => unknown) | undefined = () => true;

  private onChange: ((data: any) => unknown) | undefined = () => true;

  public model: Model | null;

  public view: View | null;

  private startConfiguration: IPluginConfigurationFull = defaultConf;

  constructor(model: Model, view: View, startConfiguration: TPluginConfiguration) {
    super();
    this.model = model;
    this.view = view;
    this.startConfiguration = { ...defaultConf, ...startConfiguration };
    // this.createListeners();
    this.init();
  }

  static selectData(data: TPluginConfiguration, isBusinessData = false) {
    const businessDataTypes = [
      'min',
      'max',
      'from',
      'to',
      // 'step',
      // 'interval',
      'range',
      'onStart',
      'onUpdate',
      'onChange',
      'shiftOnKeyDown',
      'shiftOnKeyHold',
      // 'scaleBase',
    ];
    const selectedData = Object.entries(data)
      .filter((element) => businessDataTypes
        .find((item) => {
          if (isBusinessData) return item === element[0];
          return item !== element[0];
        }));
    return Object.fromEntries(selectedData);
  }

  private init() {
    if (!this.view || !this.model) return;
    this.startConfiguration = {
      ...defaultConf,
      ...this.startConfiguration,
      ...this.view.dataAttributesConf,
    };
    const { onStart, onUpdate, onChange } = this.startConfiguration;
    this.onStart = onStart;
    this.onUpdate = onUpdate;
    this.onChange = onChange;
    this.model.init(Controller.selectData(this.startConfiguration, true));
    this.startConfiguration = {
      ...this.startConfiguration,
      ...this.model.conf,
    };
    this.view.init(this.startConfiguration);
    this.startConfiguration = { ...this.startConfiguration, ...this.view.configuration };
    if (!this.onStart) return;
    this.onStart(this.startConfiguration);
  }

  public update(conf: TPluginConfiguration) {
    if (!this.model || !this.view) return;
    this.model.update(Controller.selectData(conf, true));
    this.startConfiguration = {
      ...this.startConfiguration,
      ...Controller.selectData(conf),
      ...this.model.conf,
    };
    // console.log('newConf>>>', this.startConfiguration);
    this.view.update(this.startConfiguration);
    if (!this.onUpdate) return;
    this.onUpdate({ ...this.startConfiguration, ...this.view.configuration });
  }

  public getData() {
    if (!this.model) return undefined;
    return this.model.getData();
  }

  public disable() {
    if (!this.view) return;
    // this.removeListeners();
    this.view.disable();
  }

  public enable() {
    if (!this.view) return;
    // this.createListeners();
    this.view.enable();
  }

  public destroy() {
    if (!this.view || !this.view.slider) return;
    this.view.slider.remove();
    this.view = null;
    this.model = null;
  }

  // private createListeners() {
  //   if (!this.view || !this.model) return;

  // this.model.subscribe(this.handleStep);
  // this.model.subscribe(this.handleInterval);
  // this.model.subscribe(this.handleMin);
  // this.model.subscribe(this.handleMax);

  // this.model.subscribe(this.handleFromPosition);
  // this.model.subscribe(this.handleToPosition);
  // this.model.subscribe(this.handleFromValue);
  // this.model.subscribe(this.handleToValue);

  // this.model.subscribe(this.handleIsVertical);
  // this.model.subscribe(this.handleIsRange);
  // this.model.subscribe(this.handleIsScale);
  // this.model.subscribe(this.handleIsBar);
  // this.model.subscribe(this.handleIsTip);
  // this.view.subscribe(this.handleMoveEvent);
  // this.view.subscribe(this.handleKeydownEvent);
  // }

  // private removeListeners() {
  //   if (!this.view || !this.model) return;
  // this.model.unsubscribe(this.handleStep);
  // this.model.unsubscribe(this.handleInterval);
  // this.model.unsubscribe(this.handleMin);
  // this.model.unsubscribe(this.handleMax);

  // this.model.unsubscribe(this.handleFromPosition);
  // this.model.unsubscribe(this.handleToPosition);
  // this.model.unsubscribe(this.handleFromValue);
  // this.model.unsubscribe(this.handleToValue);

  // this.model.unsubscribe(this.handleIsVertical);
  // this.model.unsubscribe(this.handleIsRange);
  // this.model.unsubscribe(this.handleIsScale);
  // this.model.unsubscribe(this.handleIsBar);
  // this.model.unsubscribe(this.handleIsTip);
  // this.view.unsubscribe(this.handleMoveEvent);
  // this.view.unsubscribe(this.handleKeydownEvent);
  // }

  // private handleFromPosition =
  // (parms: INotificationParameters) => {
  //   if (parms.key !== 'FromPosition' || !this.view) return;
  //   this.view.updateFromPos(parms.data, parms.conf);
  // };

  // private handleToPosition = (parms: INotificationParameters) => {
  //   if (parms.key !== 'ToPosition' || !this.view) return;
  //   this.view.updateToPos(parms.data, parms.conf);
  // };

  // private handleFromValue = (parms: INotificationParameters) => {
  //   if (parms.key !== 'FromValue' || !this.view) return;
  //   this.view.updateFromValue(parms.data);
  // };

  // private handleToValue = (parms: INotificationParameters) => {
  //   if (parms.key !== 'ToValue' || !this.view) return;
  //   this.view.updateToValue(parms.data);
  // };

  // private handleStep = (parms: { key: string, data: any }) => {
  //   if (parms.key !== 'step' || !this.view) return;
  //   this.view.updateStep(parms.data);
  // };

  // private handleInterval = (parms: { key: string, data: any }) => {
  //   if (parms.key !== 'interval' || !this.view) return;
  //   this.view.updateInterval(parms.data);
  // };

  // private handleMin = (parms: { key: string, data: any }) => {
  //   if (parms.key !== 'min' || !this.view) return;
  //   this.view.updateMin(parms.data);
  // };

  // private handleMax = (parms: { key: string, data: any }) => {
  //   if (parms.key !== 'max' || !this.view) return;
  //   this.view.updateMax(parms.data);
  // };

  // private handleIsVertical = (parms: INotificationParameters) => {
  //   if (parms.key !== 'IsVertical' || !this.view) return 1;
  //   // this.view.switchVertical(parms.conf);
  //   return 2;
  // };

  // private handleIsRange = (parms: INotificationParameters) => {
  //   if (parms.key !== 'IsRange' || !this.view) return;
  //   this.view.switchRange(parms.conf, parms.data);
  // };

  // private handleIsScale = (parms: INotificationParameters) => {
  //   if (parms.key !== 'IsScale' || !this.view) return;
  //   this.view.switchScale(parms.conf);
  // };

  // private handleIsBar = (parms: INotificationParameters) => {
  //   if (parms.key !== 'IsBar' || !this.view) return;
  //   this.view.switchBar(parms.conf);
  // };

  // private handleIsTip = (parms: INotificationParameters) => {
  //   if (parms.key !== 'IsTip' || !this.view) return;
  //   this.view.switchTip(parms.conf);
  // };

  // private handleMoveEvent = (parms: INotificationParameters) => {
  //   if (parms.key !== 'MoveEvent' || !this.model) return;
  //   this.model.calcPositionSetByPointer(parms.data.control);
  // };

  // private handleKeydownEvent = (parms: INotificationParameters) => {
  //   if (parms.key !== 'KeydownEvent' || !this.model) return;
  //   this.model.calcPositionSetByKey(parms.data.control);
  // };
}

export default Controller;
