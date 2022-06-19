/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */

import PanelObserver from '../panel-observer';

import { IConf } from '../../../slider-metalamp/mvc/interface';

interface IConfAdvanced extends IConf {
  [value: string]: boolean | number | string | Function | undefined
}

class ScaleSetup extends PanelObserver {
  private optionObjects: (HTMLInputElement | null)[] | null = null;

  private elementName: string;

  private wrapper: HTMLElement;

  private optionScale: HTMLInputElement | null = null;

  private optionInterval: HTMLInputElement | null = null;

  private optionStep: HTMLInputElement | null = null;

  private scaleBaseSteps: HTMLInputElement | null = null;

  private scaleBaseIntervals: HTMLInputElement | null = null;

  constructor(elementName: string, element: HTMLElement) {
    super();
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;
    this.render();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.bindEventListeners();
  }

  public update(data: IConfAdvanced) {
    const switchOption = (option: 'step' | 'interval' = 'step') => {
      if (!this.optionStep || !this.optionInterval) return false;
      if (option === 'step') {
        this.optionStep.disabled = false;
        this.optionInterval.disabled = true;
      } else {
        this.optionStep.disabled = true;
        this.optionInterval.disabled = false;
      }
      return true;
    };

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

    if (data.scaleBase === 'interval' && this.scaleBaseIntervals) {
      this.scaleBaseIntervals.checked = true;
      switchOption('interval');
      return true;
    }

    if (data.scaleBase === 'step' && this.scaleBaseSteps) {
      this.scaleBaseSteps.checked = true;
      switchOption();
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
    this.optionScale = this.getElement('scale', 'toggle');
    this.optionInterval = this.getElement('interval');
    this.optionStep = this.getElement('step');
    this.scaleBaseSteps = this.getElement('scaleBaseStep', 'radiobuttons');
    this.scaleBaseIntervals = this.getElement('scaleBaseInterval', 'radiobuttons');

    this.optionObjects = [
      this.optionScale,
      this.optionInterval,
      this.optionStep,
      this.scaleBaseSteps,
      this.scaleBaseIntervals,
    ];
  }

  private getElement(selector: string, type: 'input' | 'toggle' | 'radiobuttons' = 'input') {
    if (!this.wrapper) return null;
    if (type === 'input') {
      return this.wrapper.querySelector(`.js-${type}-field__${type}_usage_${selector}`) as HTMLInputElement;
    }
    if (type === 'radiobuttons') {
      return this.wrapper.querySelector(`.js-${type}__category-checkbox_usage_${selector}`) as HTMLInputElement;
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
    if (type === 'scaleBaseInterval' || type === 'scaleBaseStep') {
      this.notify('scaleBase', type.substr(9).toLowerCase());
      return true;
    }
    this.notify(type, notificationText);
    return true;
  }
}

export default ScaleSetup;
