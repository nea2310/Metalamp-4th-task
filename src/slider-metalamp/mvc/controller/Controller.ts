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

  public update(newConfiguration: TPluginConfiguration) {
    if (!this.model || !this.view) return;

    let checkedConfiguration = newConfiguration;
    Object.entries(checkedConfiguration).forEach((element) => {
      const [key, value] = element;
      const condition = key !== 'scaleBase' && typeof value !== 'boolean';
      if (condition) {
        checkedConfiguration = {
          ...newConfiguration, [key]: Number(value) ?? 0,
        };
      }
    });

    this.configuration = {
      ...this.configuration,
      ...checkedConfiguration,
    };
    this.view.update(this.configuration);
    this.model.update(this.configuration);
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
    this.model.update(this.configuration);
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
    this.model.update(this.configuration);
    const { onChange } = this.configuration;
    if (onChange) onChange(data);
  }
}

export default Controller;
