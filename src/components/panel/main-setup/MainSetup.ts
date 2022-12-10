import { IConfIndexed } from '../../../slider-metalamp/mvc/interface';
import PanelObserver from '../PanelObserver';

type AllowedTypes = 'input' | 'toggle';

class MainSetup extends PanelObserver {
  private optionObjects: Array<HTMLInputElement> = [];

  private options: Array<[string, AllowedTypes]>;

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

  public update(data: IConfIndexed) {
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
    this.options.forEach((option) => {
      const [key, value] = option;
      this.prepareElement(key, value);
    });
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
