/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-useless-constructor */
import MainSetup from './main-setup/main-setup';

import PanelObserver from './panel-observer';

class Panel extends PanelObserver {
  private mainSetup: MainSetup | null = null;

  private wrapper: HTMLElement;

  private mainSetupWrapper: HTMLElement | null = null;

  constructor(element: HTMLElement) {
    super();
    this.wrapper = element;
    this.render();
    this.createPanelElements();
    this.createListeners();
  }

  private render() {
    this.mainSetupWrapper = this.wrapper.querySelector('.js-main-setup');
  }

  private createPanelElements() {
    if (!this.mainSetupWrapper) return false;
    this.mainSetup = new MainSetup('.js-main-setup', this.mainSetupWrapper);
    return true;
  }

  private createListeners() {
    if (!this.mainSetup) return false;
    this.mainSetup.subscribe(this.handleMainSetupChange);
    return true;
  }

  private handleMainSetupChange = (parameters: { key: string, data: string | boolean }) => {
    this.notify(parameters.key, parameters.data);
  }
}

export default Panel;
