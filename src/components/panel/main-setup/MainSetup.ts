import { IConf } from '../../../slider-metalamp/mvc/interface';

import PanelObserver from '../PanelObserver';

interface IConfAdvanced extends IConf {
  [value: string]: boolean | number | string | Function | undefined
}

type AllowedTypes = 'input' | 'toggle';

class MainSetup extends PanelObserver {
  private optionObjects: Array<HTMLInputElement | null> = [];

  private options: Array<[string, 'input' | 'toggle']> | null = null;

  private wrapper: HTMLElement;

  private optionTo: HTMLInputElement | null = null;

  constructor(element: HTMLElement) {
    super();
    this.wrapper = element;
    this.options = [
      ['min', 'input'],
      ['max', 'input'],
      ['from', 'input'],
      ['to', 'input'],
      ['vertical', 'toggle'],
      ['range', 'toggle'],
      ['bar', 'toggle'],
      ['tip', 'toggle'],
    ];
    this.render();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.bindEventListeners();
  }

  public update(data: IConfAdvanced) {
    if (!this.optionObjects) return false;

    this.optionObjects.forEach((optionObject) => {
      if (!optionObject) return false;

      const item = optionObject;

      const usageType = optionObject.className.match(/usage_\S*/);
      if (!usageType) return false;

      const type = usageType[0].replace('usage_', '');

      if (/toggle/.test(optionObject.className)) {
        item.checked = !!data[type];
        return true;
      }
      item.value = String(data[type]);
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

      const item = optionObject;

      item.disabled = isDisabled;
      return true;
    });
    return true;
  }

  private render() {
    this.optionTo = this.getElement('to');
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
    const notificationText = target.type === 'checkbox' ? target.checked : target.value;
    const usageType = target.className.match(/usage_\S*/);
    if (usageType) {
      this.notify(usageType[0].replace('usage_', ''), notificationText);
    }
  }

  private getElement(selector: string, type: AllowedTypes = 'input') {
    if (!this.wrapper) return null;
    if (type === 'input') {
      return this.wrapper.querySelector(`.js-${type}-field__${type}_usage_${selector}`) as HTMLInputElement;
    }
    return this.wrapper.querySelector(`.js-${type}__checkbox_usage_${selector}`) as HTMLInputElement;
  }

  private prepareElement = (selector: string, type: AllowedTypes = 'input') => {
    const object = this.getElement(selector, type);
    if (object) {
      this.optionObjects.push(object);
    }
  };
}

export default MainSetup;
