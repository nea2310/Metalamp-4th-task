import updateObject from '../../../shared/utils/updateObject';
import prepareElements from '../../../shared/utils/prepareElements';
import getNotificationDetails from '../../../shared/utils/getNotificationDetails';
import { TPluginConfiguration, TInputTypes } from '../../../slider-metalamp/mvc/interface';
import Observer from '../../../slider-metalamp/mvc/Observer';

const OPTIONS: Array<[string, TInputTypes]> = [
  ['shiftOnKeyDown', 'input'],
  ['shiftOnKeyHold', 'input'],
  ['sticky', 'toggle'],
];

class ControlMovementSetup extends Observer {
  private optionObjects: Array<HTMLInputElement> = [];

  private wrapper: HTMLElement;

  constructor(element: HTMLElement) {
    super();
    this.wrapper = element;
    this.render();
    this.bindEventListeners();
    this.addEventListeners();
  }

  public update(data: { [key: string]: unknown } & TPluginConfiguration) {
    this.optionObjects = updateObject(this.optionObjects, data);
  }

  public disable(isDisabled = false) {
    this.optionObjects.forEach((optionObject) => {
      const item = optionObject;
      item.disabled = isDisabled;
    });
  }

  private render() {
    this.optionObjects = prepareElements(OPTIONS, this.wrapper);
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
    this.notify('controlMovementSetupUpdate', {
      key: type,
      value: notificationText,
    });
  }
}

export default ControlMovementSetup;
