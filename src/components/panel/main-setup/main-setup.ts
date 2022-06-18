/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */

import { IConf } from '../../../slider-metalamp/mvc/interface';

import PanelObserver from '../panel-observer';

interface IConfAdvanced extends IConf {
  [value: string]: boolean | number | string | Function | undefined
}

class MainSetup extends PanelObserver {
  private elementName: string;

  private wrapper: HTMLElement;

  private optionObjects: (HTMLInputElement | null)[] | null = null;

  private optionMin: HTMLInputElement | null = null;

  private optionMax: HTMLInputElement | null = null;

  private optionFrom: HTMLInputElement | null = null;

  private optionTo: HTMLInputElement | null = null;

  private optionVertical: HTMLInputElement | null = null;

  private optionRange: HTMLInputElement | null = null;

  private optionBar: HTMLInputElement | null = null;

  private optionTip: HTMLInputElement | null = null;

  constructor(elementName: string, element: HTMLElement) {
    super();
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;
    this.render();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.bindEventListeners();
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
}

export default MainSetup;
