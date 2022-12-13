import { IConf } from '../../../slider-metalamp/mvc/interface';
import PanelObserver from '../PanelObserver';

type AllowedTypes = 'input' | 'toggle';

const OPTIONS: Array<[string, AllowedTypes]> = [
  ['min', 'input'],
  ['max', 'input'],
  ['from', 'input'],
  ['to', 'input'],
  ['vertical', 'toggle'],
  ['range', 'toggle'],
  ['bar', 'toggle'],
  ['tip', 'toggle'],
];

class MainSetup extends PanelObserver {
  private optionObjects: Array<HTMLInputElement> = [];

  private wrapper: HTMLElement;

  private optionTo: HTMLInputElement | null = null;

  constructor(element: HTMLElement) {
    super();
    this.wrapper = element;
    this.render();
    this.bindEventListeners();
    this.addEventListeners();
  }

  public update(data: { [key: string]: unknown } & IConf) {
    this.optionObjects.forEach((optionObject) => {
      const item = optionObject;
      const usageType = optionObject.className.match(/usage_\S*/);
      const type = usageType ? usageType[0].replace('usage_', '') : '';
      item.checked = /toggle/.test(optionObject.className) ? !!data[type] : false;
      item.value = String(data[type]);
    });

    if (this.optionTo) {
      this.optionTo.disabled = !data.range;
    }
  }

  public disable(isDisabled = false) {
    this.optionObjects.forEach((optionObject) => {
      const item = optionObject;
      item.disabled = isDisabled;
    });
  }

  private render() {
    this.optionTo = this.getElement('to');
    OPTIONS.forEach((option) => {
      const [key, value] = option;
      this.prepareElement(key, value);
    });
  }

  private bindEventListeners() {
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  private addEventListeners() {
    this.wrapper.addEventListener('change', this.handleInputChange);
  }

  private handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const notificationText = target.type === 'checkbox' ? target.checked : target.value;
    const usageType = target.className.match(/usage_\S*/);
    const type = usageType ? usageType[0].replace('usage_', '') : '';
    this.notify(type, notificationText);
  }

  private getElement(selector: string, type: AllowedTypes = 'input') {
    if (type === 'input') {
      return this.wrapper.querySelector(`.js-${type}-field__${type}_usage_${selector}`) as HTMLInputElement;
    }
    return this.wrapper.querySelector(`.js-${type}__checkbox_usage_${selector}`) as HTMLInputElement;
  }

  private prepareElement = (selector: string, type: AllowedTypes = 'input') => {
    const object = this.getElement(selector, type);
    this.optionObjects.push(object);
  };
}

export default MainSetup;
