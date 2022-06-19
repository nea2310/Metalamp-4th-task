/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */

import PanelObserver from '../panel-observer';

import { IConf } from '../../../slider-metalamp/mvc/interface';

interface IConfAdvanced extends IConf {
  [value: string]: boolean | number | string | Function | undefined
}

class ControlMovementSetup extends PanelObserver {
  private optionObjects: (HTMLInputElement | null)[] | null = null;

  private elementName: string;

  private wrapper: HTMLElement;

  private optionShiftOnKeyDown: HTMLInputElement | null = null;

  private optionShiftOnKeyHold: HTMLInputElement | null = null;

  private optionSticky: HTMLInputElement | null = null;

  constructor(elementName: string, element: HTMLElement) {
    super();
    this.elementName = elementName.replace(/^.js-/, '');
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
    this.optionShiftOnKeyDown = this.getElement('shiftOnKeyDown');
    this.optionShiftOnKeyHold = this.getElement('shiftOnKeyHold');
    this.optionSticky = this.getElement('sticky', 'toggle');

    this.optionObjects = [
      this.optionShiftOnKeyDown,
      this.optionShiftOnKeyHold,
      this.optionSticky,
    ];
  }

  private getElement(selector: string, type: 'input' | 'toggle' = 'input') {
    if (!this.wrapper) return null;
    if (type === 'input') {
      return this.wrapper.querySelector(`.js-${type}-field__${type}_usage_${selector}`) as HTMLInputElement;
    }
    return this.wrapper.querySelector(`.js-${type}__checkbox_usage_${selector}`) as HTMLInputElement;
  }

  private bindEventListeners() {
    this.wrapper.addEventListener('change', this.handleInputChange);
  }

  private handleInputChange(e: Event) {
    const target = e.target as HTMLInputElement;

    const notificationText = (target.type === 'text') ? target.value : target.checked;
    const usageType = target.className.match(/usage_\S*/);

    if (!usageType) return false;
    const type = usageType[0].replace('usage_', '');
    this.notify(type, notificationText);
    return true;
  }
}

export default ControlMovementSetup;
