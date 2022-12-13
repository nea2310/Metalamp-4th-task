import { IConf } from '../../../slider-metalamp/mvc/interface';
import PanelObserver from '../PanelObserver';

type AllowedTypes = 'input' | 'toggle' | 'radiobuttons';

const OPTIONS: Array<[string, AllowedTypes]> = [
  ['scale', 'toggle'],
  ['interval', 'input'],
  ['step', 'input'],
  ['scaleBaseStep', 'radiobuttons'],
  ['scaleBaseInterval', 'radiobuttons'],
];

class ScaleSetup extends PanelObserver {
  private optionObjects: Array<HTMLInputElement> = [];

  private wrapper: HTMLElement;

  private optionInterval: HTMLInputElement | null = null;

  private optionStep: HTMLInputElement | null = null;

  private scaleBaseSteps: HTMLInputElement | null = null;

  private scaleBaseIntervals: HTMLInputElement | null = null;

  constructor(element: HTMLElement) {
    super();
    this.wrapper = element;
    this.render();
    this.bindEventListeners();
    this.addEventListeners();
  }

  public update(data: { [key: string]: unknown } & IConf) {
    const switchOption = (option: 'step' | 'interval' = 'step') => {
      if (!this.optionStep || !this.optionInterval) {
        return;
      }
      this.optionStep.disabled = (option === 'interval');
      this.optionInterval.disabled = (option === 'step');
    };

    this.optionObjects.forEach((optionObject) => {
      const usageType = optionObject.className.match(/usage_\S*/);
      const type = usageType ? usageType[0].replace('usage_', '') : '';
      const item = optionObject;
      item.checked = /toggle/.test(optionObject.className) ? !!data[type] : false;
      item.value = String(data[type]);
    });

    if (data.scaleBase === 'interval' && this.scaleBaseIntervals) {
      this.scaleBaseIntervals.checked = true;
      switchOption('interval');
    }

    if (data.scaleBase === 'step' && this.scaleBaseSteps) {
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
    const usageType = target.className.match(/usage_\S*/);

    let notificationText = (target.type === 'text') ? target.value : target.checked;
    let type = usageType ? usageType[0].replace('usage_', '') : '';

    if (type === 'scaleBaseInterval' || type === 'scaleBaseStep') {
      notificationText = type.slice(9).toLowerCase();
      type = 'scaleBase';
    }
    this.notify(type, notificationText);
  }

  private getElement(selector: string, type: AllowedTypes = 'input') {
    if (type === 'input') {
      return this.wrapper.querySelector(`.js-${type}-field__${type}_usage_${selector}`) as HTMLInputElement;
    }
    if (type === 'radiobuttons') {
      return this.wrapper.querySelector(`.js-${type}__category-checkbox_usage_${selector}`) as HTMLInputElement;
    }
    return this.wrapper.querySelector(`.js-${type}__checkbox_usage_${selector}`) as HTMLInputElement;
  }

  private prepareElement = (selector: string, type: AllowedTypes = 'input') => {
    const object = this.getElement(selector, type);
    this.optionObjects.push(object);
  };
}

export default ScaleSetup;
