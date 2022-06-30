/* eslint-disable no-param-reassign */

import PanelObserver from '../panel-observer';

import { IConf } from '../../../slider-metalamp/mvc/interface';

interface IConfAdvanced extends IConf {
  [value: string]: boolean | number | string | Function | undefined
}

type allowedTypes = 'input' | 'toggle';

class ControlMovementSetup extends PanelObserver {
  private optionObjects: Array<HTMLInputElement | null> = [];

  private options: Array<[string, 'input' | 'toggle']> | null = null;

  private wrapper: HTMLElement;

  constructor(element: HTMLElement) {
    super();
    this.wrapper = element;
    this.options = [
      ['shiftOnKeyDown', 'input'],
      ['shiftOnKeyHold', 'input'],
      ['sticky', 'toggle'],
    ];
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
    if (!this.options) return false;
    this.options.forEach((option) => {
      const [key, value] = option;
      this.prepareElement(key, value);
    });
    return true;
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

  private getElement(selector: string, type: allowedTypes = 'input') {
    if (!this.wrapper) return null;
    if (type === 'input') {
      return this.wrapper.querySelector(`.js-${type}-field__${type}_usage_${selector}`) as HTMLInputElement;
    }
    return this.wrapper.querySelector(`.js-${type}__checkbox_usage_${selector}`) as HTMLInputElement;
  }

  private prepareElement = (selector: string, type: allowedTypes = 'input') => {
    const object = this.getElement(selector, type);
    if (object) {
      this.optionObjects.push(object);
    }
    return object;
  }
}

export default ControlMovementSetup;
