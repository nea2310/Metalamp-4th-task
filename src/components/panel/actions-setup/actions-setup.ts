/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */

import PanelObserver from '../panel-observer';

import { IConf } from '../../../slider-metalamp/mvc/interface';

interface IConfAdvanced extends IConf {
  [value: string]: boolean | number | string | Function | undefined
}

class ActionsSetup extends PanelObserver {
  private optionObjects: (HTMLInputElement | null)[] | null = null;

  private elementName: string;

  private wrapper: HTMLElement;

  private optionSubscribe: HTMLInputElement | null = null;

  private optionDisable: HTMLInputElement | null = null;

  private optionDestroy: HTMLInputElement | null = null;

  constructor(elementName: string, element: HTMLElement) {
    super();
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;
    this.render();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.bindEventListeners();
  }

  public disable(isDisabled = false) {
    if (this.optionSubscribe) {
      this.optionSubscribe.disabled = isDisabled;
    }
  }

  private render() {
    this.optionSubscribe = this.getElement('subscribe');
  }

  private getElement(selector: string) {
    if (!this.wrapper) return null;
    return this.wrapper.querySelector(`.js-toggle__checkbox_usage_${selector}`) as HTMLInputElement;
  }

  private bindEventListeners() {
    this.wrapper.addEventListener('change', this.handleInputChange);
  }

  private handleInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const usageType = target.className.match(/usage_\S*/);

    if (!usageType) return false;
    const type = usageType[0].replace('usage_', '');
    this.notify(type, target.checked);
    return true;
  }
}

export default ActionsSetup;
