import View from '../view/View';
import Model from '../model/Model';
import Observer from '../Observer';
import {
  TPluginConfiguration,
  IPluginConfigurationFull,
  IViewData,
  IBusinessData,
} from '../interface';

import { defaultConfiguration } from '../utils';

const BUSINESS_DATA_TYPES = [
  'min',
  'max',
  'from',
  'to',
  'range',
  'shiftOnKeyDown',
  'shiftOnKeyHold',
];

const NUMBER_DATA_TYPES = [
  'min',
  'max',
  'from',
  'to',
  'step',
  'interval',
  'shiftOnKeyDown',
  'shiftOnKeyHold',
];

class Controller extends Observer {
  private model: Model | null;

  private view: View | null;

  private startConfiguration: IPluginConfigurationFull = defaultConfiguration;

  private onUpdate: ((data: TPluginConfiguration) => unknown) | undefined = () => true;

  private onChange: ((data: IViewData) => unknown) | undefined = () => true;

  constructor(model: Model, view: View, startConfiguration: TPluginConfiguration) {
    super();
    this.model = model;
    this.view = view;
    this.startConfiguration = { ...defaultConfiguration, ...startConfiguration };
    this.createListeners();
    this.init();
  }

  static selectData(data: TPluginConfiguration, isBusinessData = false) {
    const selectedData = Object.entries(data)
      .filter((element) => BUSINESS_DATA_TYPES
        .find((item) => {
          if (isBusinessData) return item === element[0];
          return item !== element[0];
        }));
    return Object.fromEntries(selectedData);
  }

  public update(configuration: TPluginConfiguration) {
    if (!this.model || !this.view) return;

    let checkedConfiguration = configuration;

    const convertToNumber = (key: string, value: unknown) => {
      const convertedValue = Number.isNaN(Number(value)) ? 0 : Number(value);
      const object = { [key]: convertedValue };
      checkedConfiguration = {
        ...configuration, ...object,
      };
    };

    Object.entries(checkedConfiguration).forEach((element) => {
      const [key, value] = element;
      if (NUMBER_DATA_TYPES.includes(key)) convertToNumber(key, value);
    });

    this.startConfiguration = {
      ...this.startConfiguration,
      ...Controller.selectData(checkedConfiguration),
    };
    this.view.update(this.startConfiguration);
    this.model.update(Controller.selectData(this.startConfiguration, true));
  }

  public disable() {
    if (!this.view) return;
    this.view.disable();
  }

  public enable() {
    if (!this.view) return;
    this.view.enable();
  }

  public destroy() {
    if (!this.view) return;
    this.view.destroy();
    this.view = null;
    this.model = null;
  }

  private createListeners() {
    if (this.view && this.model) {
      this.view.subscribe(this.handleViewChange, 'view');
      this.model.subscribe(this.handleModelUpdate, 'model');
    }
  }

  private init() {
    if (!this.view || !this.model) return;

    this.startConfiguration = {
      ...defaultConfiguration,
      ...this.startConfiguration,
      ...this.view.dataAttributesConfiguration,
    };

    const { onUpdate, onChange } = this.startConfiguration;
    this.onUpdate = onUpdate;
    this.onChange = onChange;

    this.view.init(this.startConfiguration);
    this.model.update(Controller.selectData(this.startConfiguration, true));
  }

  private handleModelUpdate = (data: IBusinessData) => {
    this.startConfiguration = { ...this.startConfiguration, ...data };
    if (!this.view) return;
    this.view.update(this.startConfiguration);
    if (this.onUpdate) this.onUpdate(this.startConfiguration);
  };

  private handleViewChange = (data: IViewData) => {
    this.startConfiguration = { ...this.startConfiguration, ...data };
    if (!this.model) return;
    this.model.update(Controller.selectData(this.startConfiguration, true));
    if (this.onChange) this.onChange(data);
  };
}

export default Controller;
