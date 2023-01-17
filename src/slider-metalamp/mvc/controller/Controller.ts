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

  private configuration: IPluginConfigurationFull = defaultConfiguration;

  constructor(model: Model, view: View, configuration: TPluginConfiguration) {
    super();
    this.model = model;
    this.view = view;
    this.configuration = { ...defaultConfiguration, ...configuration };
    this.bindListeners();
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

  public update(newConfiguration: TPluginConfiguration) {
    if (!this.model || !this.view) return;

    let checkedConfiguration = newConfiguration;

    const convertToNumber = (key: string, value: unknown) => {
      const convertedValue = Number.isNaN(Number(value)) ? 0 : Number(value);
      const object = { [key]: convertedValue };
      checkedConfiguration = {
        ...newConfiguration, ...object,
      };
    };

    Object.entries(checkedConfiguration).forEach((element) => {
      const [key, value] = element;
      if (NUMBER_DATA_TYPES.includes(key)) convertToNumber(key, value);
    });

    this.configuration = {
      ...this.configuration,
      ...Controller.selectData(checkedConfiguration),
    };
    this.view.update(this.configuration);
    this.model.update(Controller.selectData(this.configuration, true));
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
    this.removeListeners();
    if (!this.view) return;
    this.view.destroy();
    this.view = null;
    this.model = null;
  }

  private bindListeners() {
    this.handleModelChange = this.handleModelChange.bind(this);
    this.handleViewChange = this.handleViewChange.bind(this);
  }

  private createListeners() {
    if (this.view && this.model) {
      this.view.subscribe('viewUpdate', this.handleViewChange);
      this.model.subscribe('modelUpdate', this.handleModelChange);
    }
  }

  private removeListeners() {
    if (this.view && this.model) {
      this.view.unsubscribe('viewUpdate', this.handleViewChange);
      this.model.unsubscribe('modelUpdate', this.handleModelChange);
    }
  }

  private init() {
    if (!this.view || !this.model) return;

    this.configuration = {
      ...defaultConfiguration,
      ...this.configuration,
      ...this.view.dataAttributesConfiguration,
    };

    this.view.init(this.configuration);
    this.model.update(Controller.selectData(this.configuration, true));
  }

  private handleModelChange(data: IBusinessData) {
    this.configuration = { ...this.configuration, ...data };
    if (!this.view) return;
    this.view.update(this.configuration);
    const { onUpdate } = this.configuration;
    if (onUpdate) onUpdate(this.configuration);
  }

  private handleViewChange(data: IViewData) {
    this.configuration = { ...this.configuration, ...data };
    if (!this.model) return;
    this.model.update(Controller.selectData(this.configuration, true));
    const { onChange } = this.configuration;
    if (onChange) onChange(data);
  }
}

export default Controller;
