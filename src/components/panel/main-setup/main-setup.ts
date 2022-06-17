/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import PanelObserver from '../panel-observer';

class MainSetup extends PanelObserver {
  private elementName: string;

  private wrapper: HTMLElement;

  constructor(elementName: string, element: HTMLElement) {
    super();
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;
    this.handleInputChange = this.handleInputChange.bind(this);

    this.bindEventListeners();
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

export default MainSetup;
