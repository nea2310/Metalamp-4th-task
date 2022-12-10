import { IConfIndexed } from '../../../slider-metalamp/mvc/interface';
import PanelObserver from '../PanelObserver';

type AllowedTypes = 'input' | 'toggle' | 'radiobuttons';

class ScaleSetup extends PanelObserver {
  private optionObjects: Array<HTMLInputElement> = [];

  private options: Array<[string, AllowedTypes]>;

  private wrapper: HTMLElement;

  private optionInterval: HTMLInputElement;

  private optionStep: HTMLInputElement;

  private scaleBaseSteps: HTMLInputElement;

  private scaleBaseIntervals: HTMLInputElement;

  constructor(element: HTMLElement) {
    super();
    this.wrapper = element;
    this.options = [
      ['scale', 'toggle'],
      ['interval', 'input'],
      ['step', 'input'],
      ['scaleBaseStep', 'radiobuttons'],
      ['scaleBaseInterval', 'radiobuttons'],
    ];

    this.optionInterval = this.getElement('interval');
    this.optionStep = this.getElement('step');
    this.scaleBaseSteps = this.getElement('scaleBaseStep', 'radiobuttons');
    this.scaleBaseIntervals = this.getElement('scaleBaseInterval', 'radiobuttons');

    this.render();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.bindEventListeners();
  }

  public update(data: IConfIndexed) {
    const switchOption = (option: 'step' | 'interval' = 'step') => {
      if (option === 'step') {
        this.optionStep.disabled = false;
        this.optionInterval.disabled = true;
      } else {
        this.optionStep.disabled = true;
        this.optionInterval.disabled = false;
      }
    };

    this.optionObjects.forEach((optionObject) => {
      const usageType = optionObject.className.match(/usage_\S*/);
      const type = usageType ? usageType[0].replace('usage_', '') : '';
      const item = optionObject;
      item.checked = /toggle/.test(optionObject.className) ? !!data[type] : false;
      item.value = String(data[type]);
    });

    if (data.scaleBase === 'interval') {
      this.scaleBaseIntervals.checked = true;
      switchOption('interval');
    }

    if (data.scaleBase === 'step') {
      this.scaleBaseSteps.checked = true;
      switchOption();
    }
  }

  public disable(isDisabled = false) {
    this.optionObjects.forEach((optionObject) => {
      const item = optionObject;
      item.disabled = isDisabled;
    });
  }

  private render() {
    this.optionInterval = this.getElement('interval');
    this.optionStep = this.getElement('step');
    this.scaleBaseSteps = this.getElement('scaleBaseStep', 'radiobuttons');
    this.scaleBaseIntervals = this.getElement('scaleBaseInterval', 'radiobuttons');
    this.options.forEach((option) => {
      const [key, value] = option;
      this.prepareElement(key, value);
    });
  }

  private bindEventListeners() {
    this.wrapper.addEventListener('change', this.handleInputChange);
  }

  private handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const notificationText = (target.type === 'text') ? target.value : target.checked;
    const usageType = target.className.match(/usage_\S*/);
    const type = usageType ? usageType[0].replace('usage_', '') : '';
    if (type === 'scaleBaseInterval' || type === 'scaleBaseStep') {
      this.notify('scaleBase', type.substr(9).toLowerCase());
      return;
    }
    this.notify(type, notificationText);
  }

  private getElement(selector: string, type: AllowedTypes = 'input') {
    if (type === 'input') {
      return this.wrapper.querySelector(`.js-${type}-field__${type}_usage_${selector}`) as HTMLInputElement;
    }
    if (type === 'radiobuttons') {
      return this.wrapper.querySelector(`.js-category-checkbox_usage_${selector}`) as HTMLInputElement;
    }
    return this.wrapper.querySelector(`.js-${type}__checkbox_usage_${selector}`) as HTMLInputElement;
  }

  private prepareElement = (selector: string, type: AllowedTypes = 'input') => {
    const object = this.getElement(selector, type);
    this.optionObjects.push(object);
  };
}

export default ScaleSetup;
