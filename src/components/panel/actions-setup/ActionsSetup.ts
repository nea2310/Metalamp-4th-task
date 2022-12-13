import PanelObserver from '../PanelObserver';

class ActionsSetup extends PanelObserver {
  private wrapper: HTMLElement;

  private optionSubscribe: HTMLInputElement | null = null;

  constructor(element: HTMLElement) {
    super();
    this.wrapper = element;
    this.render();
    this.bindEventListeners();
    this.addEventListeners();
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
    return this.wrapper.querySelector(`.js-toggle__checkbox_usage_${selector}`) as HTMLInputElement;
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
    const type = usageType ? usageType[0].replace('usage_', '') : '';
    this.notify(type, target.checked);
  }
}

export default ActionsSetup;
