/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
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
    if (!this.optionObjects) return false;

    this.optionObjects.forEach((optionObject) => {
      console.log('optionObject>>>', optionObject);
      console.log('optionObject.className>>>', optionObject?.className);

      // if (!optionObject) return false;

      // const usageType = optionObject.className.match(/usage_\S*/);
      // if (!usageType) return false;

      // const type = usageType[0].replace('usage_', '');

      // if (/toggle/.test(optionObject.className)) {
      //   optionObject.checked = !!data[type];
      //   return true;
      // }
      // optionObject.value = String(data[type]);
      // return true;
    });
    return true;
  }

  private render() {
    this.optionScale = this.getElement('scale', 'toggle');
    this.optionInterval = this.getElement('interval');
    this.optionStep = this.getElement('step');
    this.scaleBaseSteps = this.getElement('step', 'radiobuttons');
    this.scaleBaseIntervals = this.getElement('interval', 'radiobuttons');

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
    return this.wrapper.querySelector(`.js-${type}__checkbox_usage_${selector}`) as HTMLInputElement;
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
}

export default ScaleSetup;
