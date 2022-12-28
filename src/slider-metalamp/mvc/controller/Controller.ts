import View from '../view/View';
import Model from '../model/Model';
import Observer from '../Observer';
import {
  TPluginConfiguration,
  IPluginConfigurationFull,
} from '../interface';

import { defaultConf } from '../utils';

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
  private onUpdate: ((data: any) => unknown) | undefined = () => true;

  public model: Model | null;

  public view: View | null;

  private startConfiguration: IPluginConfigurationFull = defaultConf;

  constructor(model: Model, view: View, startConfiguration: TPluginConfiguration) {
    super();
    this.model = model;
    this.view = view;
    this.startConfiguration = { ...defaultConf, ...startConfiguration };
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

  private init() {
    if (!this.view || !this.model) return;
    this.handleControlSet = this.handleControlSet.bind(this);
    this.view.subscribeDateSelect(this.handleControlSet);
    this.startConfiguration = {
      ...defaultConf,
      ...this.startConfiguration,
      ...this.view.dataAttributesConf,
    };
    const { onUpdate } = this.startConfiguration;
    this.onUpdate = onUpdate;
    this.model.init(Controller.selectData(this.startConfiguration, true));
    this.startConfiguration = {
      ...this.startConfiguration,
      ...this.model.conf,
    };
    this.view.init(this.startConfiguration);
    this.startConfiguration = { ...this.startConfiguration, ...this.view.configuration };
    if (!this.onUpdate) return;
    this.onUpdate(this.startConfiguration);
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

    this.model.update(Controller.selectData(checkedConfiguration, true));
    this.startConfiguration = {
      ...this.startConfiguration,
      ...Controller.selectData(checkedConfiguration),
      ...this.model.conf,
    };
    this.view.update(this.startConfiguration);
    if (!this.onUpdate) return;
    this.onUpdate({ ...this.startConfiguration, ...this.view.configuration });
  }

  handleControlSet(data: {
    from: number,
    to: number,
  }) {
    this.startConfiguration = { ...this.startConfiguration, ...data };
    if (!this.model) return;
    this.model.update(Controller.selectData(this.startConfiguration, true));
    if (this.onUpdate) this.onUpdate(this.startConfiguration);
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
    if (!this.view || !this.view.slider) return;
    this.view.slider.remove();
    this.view = null;
    this.model = null;
  }
}

export default Controller;
