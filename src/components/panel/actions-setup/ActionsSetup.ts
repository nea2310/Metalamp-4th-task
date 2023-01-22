import getNotificationDetails from '../../../shared/utils/getNotificationDetails';
import getElement from '../../../shared/utils/getElement';
import Observer from '../../../slider-metalamp/mvc/Observer';

class ActionsSetup extends Observer {
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
    if (this.optionSubscribe) this.optionSubscribe.disabled = isDisabled;
  }

  private render() {
    this.optionSubscribe = getElement(this.wrapper, 'subscribe');
  }

  private bindEventListeners() {
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  private addEventListeners() {
    this.wrapper.addEventListener('change', this.handleInputChange);
  }

  private handleInputChange(event: Event) {
    const { target } = event;
    const { type, notificationText } = getNotificationDetails(target);
    this.notify('actionsSetupUpdate', { key: type, value: notificationText });
  }
}

export default ActionsSetup;
