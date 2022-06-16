/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import PanelObserver from '../panel-observer';

class InputMinimum extends PanelObserver {
  private elementName: string;

  private wrapper: HTMLElement;

  private input: HTMLInputElement | null = null;

  constructor(elementName: string, element: HTMLElement) {
    super();
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;

    this.handleInputChange = this.handleInputChange.bind(this);

    this.render();
    this.bindEventListeners();
  }

  private render() {
    this.input = this.wrapper.querySelector('.input-field');
  }

  private bindEventListeners() {
    if (!this.input) return false;
    this.input.addEventListener('change', this.handleInputChange);
    return true;
  }

  private handleInputChange(e: Event) {
    console.log(e);
    this.notify('min', '1234');
  }
}

export default InputMinimum;

// function renderInputsMinimum(selector: string) {
//   const inputsMinimum = document.querySelectorAll(selector);
//   inputsMinimum.forEach((header) => new InputMinimum(selector, header));
// }
// renderInputsMinimum('.js-input-minimum');
