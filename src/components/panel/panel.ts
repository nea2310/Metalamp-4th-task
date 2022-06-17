/* eslint-disable no-param-reassign */
import MainSetup from './main-setup/main-setup';

import PanelObserver from './panel-observer';

import { IConf } from '../../slider-metalamp/mvc/interface';

interface IConfAdvanced extends IConf {
  [value: string]: boolean | number | string | Function | undefined
}

class Panel extends PanelObserver {
  private optionObjects: (HTMLInputElement | null)[] | null = null;

  private mainSetup: MainSetup | null = null;

  private wrapper: HTMLElement;

  optionMin: HTMLInputElement | null = null;

  optionMax: HTMLInputElement | null = null;

  optionFrom: HTMLInputElement | null = null;

  optionTo: HTMLInputElement | null = null;

  optionVertical: HTMLInputElement | null = null;

  optionRange: HTMLInputElement | null = null;

  optionBar: HTMLInputElement | null = null;

  optionTip: HTMLInputElement | null = null;

  private mainSetupElement: HTMLElement | null = null;

  constructor(element: HTMLElement) {
    super();
    this.wrapper = element;
    this.render();
    this.createListeners();
  }

  public update(data: IConfAdvanced) {
    if (!this.optionObjects) return false;

    this.optionObjects.forEach((optionObject) => {
      if (!optionObject) return false;

      const usageType = optionObject.className.match(/usage_\S*/);
      if (!usageType) return false;

      const type = usageType[0].replace('usage_', '');

      if (/toggle/.test(optionObject.className)) {
        optionObject.checked = !!data[type];
        return true;
      }
      optionObject.value = String(data[type]);
      return true;
    });
    return true;
  }

  private render() {
    this.mainSetupElement = this.wrapper.querySelector('.js-main-setup');

    if (!this.mainSetupElement) return false;
    this.mainSetup = new MainSetup('.js-main-setup', this.mainSetupElement);

    this.optionMin = this.getElement('min');
    this.optionMax = this.getElement('max');
    this.optionFrom = this.getElement('from');
    this.optionTo = this.getElement('to');
    this.optionVertical = this.getElement('vertical', 'toggle');
    this.optionRange = this.getElement('range', 'toggle');
    this.optionBar = this.getElement('bar', 'toggle');
    this.optionTip = this.getElement('tip', 'toggle');

    this.optionObjects = [
      this.optionMin,
      this.optionMax,
      this.optionFrom,
      this.optionTo,
      this.optionVertical,
      this.optionRange,
      this.optionBar,
      this.optionTip,
    ];
    return true;
  }

  private getElement(selector: string, type: 'input' | 'toggle' = 'input') {
    if (!this.wrapper) return null;
    if (type === 'input') {
      return this.wrapper.querySelector(`.js-${type}-field__${type}_usage_${selector}`) as HTMLInputElement;
    }
    return this.wrapper.querySelector(`.js-${type}__checkbox_usage_${selector}`) as HTMLInputElement;
  }

  private createListeners() {
    if (!this.mainSetup) return false;
    this.mainSetup.subscribe(this.handleMainSetupChange);
    return true;
  }

  private handleMainSetupChange = (parameters: { key: string, data: string | boolean }) => {
    this.notify(parameters.key, parameters.data);
  }
}

export default Panel;
