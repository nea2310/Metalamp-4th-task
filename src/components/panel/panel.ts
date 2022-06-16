/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-useless-constructor */
import InputMinimum from './input-minimum/input-minimum';

import PanelObserver from './panel-observer';

class Panel extends PanelObserver {
  private inputMinimum: InputMinimum | null = null;

  private wrapper: HTMLElement;

  private optionMinimum: HTMLElement | null = null;

  constructor(element: HTMLElement) {
    super();
    this.wrapper = element;
    this.render();
    this.createPanelElements();
  }

  private render() {
    this.optionMinimum = this.wrapper.querySelector('.js-input-minimum');
  }

  private createPanelElements() {
    if (!this.optionMinimum) return false;
    this.inputMinimum = new InputMinimum('.js-input-minimum', this.optionMinimum);
    return true;
  }
}

export default Panel;
