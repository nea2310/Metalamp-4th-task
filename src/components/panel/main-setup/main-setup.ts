/* eslint-disable no-param-reassign */

import { IConf } from '../../../slider-metalamp/mvc/interface';

import PanelObserver from '../panel-observer';

interface IConfAdvanced extends IConf {
  [value: string]: boolean | number | string | Function | undefined
}

class MainSetup extends PanelObserver {
  private wrapper: HTMLElement;

  private optionObjects: Array<HTMLInputElement | null> = [];

  private optionMin: HTMLInputElement | null = null;

  private optionMax: HTMLInputElement | null = null;

  private optionFrom: HTMLInputElement | null = null;

  private optionTo: HTMLInputElement | null = null;

  private optionVertical: HTMLInputElement | null = null;

  private optionRange: HTMLInputElement | null = null;

  private optionBar: HTMLInputElement | null = null;

  private optionTip: HTMLInputElement | null = null;

  constructor(element: HTMLElement) {
    super();
    this.wrapper = element;
    this.render();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.bindEventListeners();
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

    if (this.optionTo) {
      this.optionTo.disabled = !data.range;
    }
    return true;
  }

  public disable(isDisabled = false) {
    if (!this.optionObjects) return false;
    this.optionObjects.forEach((optionObject) => {
      if (!optionObject) return false;
      optionObject.disabled = isDisabled;
      return true;
    });
    return true;
  }

  private render() {
    this.optionMin = this.prepareElement('min');
    this.optionMax = this.prepareElement('max');
    this.optionFrom = this.prepareElement('from');
    this.optionTo = this.prepareElement('to');
    this.optionVertical = this.prepareElement('vertical', 'toggle');
    this.optionRange = this.prepareElement('range', 'toggle');
    this.optionBar = this.prepareElement('bar', 'toggle');
    this.optionTip = this.prepareElement('tip', 'toggle');
  }

  private bindEventListeners() {
    this.wrapper.addEventListener('change', this.handleInputChange);
  }

  private handleInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const notificationText = target.type === 'checkbox' ? target.checked : target.value;
    const usageType = target.className.match(/usage_\S*/);
    if (usageType) {
      this.notify(usageType[0].replace('usage_', ''), notificationText);
    }
  }

  private getElement(selector: string, type: string) {
    if (!this.wrapper) return null;
    if (type === 'input') {
      return this.wrapper.querySelector(`.js-${type}-field__${type}_usage_${selector}`) as HTMLInputElement;
    }
    return this.wrapper.querySelector(`.js-${type}__checkbox_usage_${selector}`) as HTMLInputElement;
  }

  private prepareElement = (selector: string, type: 'input' | 'toggle' = 'input') => {
    const object = this.getElement(selector, type);
    if (object) {
      this.optionObjects.push(object);
    }
    return object;
  }
}

export default MainSetup;
