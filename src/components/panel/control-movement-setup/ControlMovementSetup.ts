import updateObject from '../../../shared/utils/updateObject';
import prepareElements from '../../../shared/utils/prepareElements';
import getNotificationDetails from '../../../shared/utils/getNotificationDetails';
import { IPluginConfiguration, TAllowedTypes } from '../../../slider-metalamp/mvc/interface';
import PanelObserver from '../PanelObserver';

const OPTIONS: Array<[string, TAllowedTypes]> = [
  ['shiftOnKeyDown', 'input'],
  ['shiftOnKeyHold', 'input'],
  ['sticky', 'toggle'],
];

class ControlMovementSetup extends PanelObserver {
  private optionObjects: Array<HTMLInputElement> = [];

  private wrapper: HTMLElement;

  constructor(element: HTMLElement) {
    super();
    this.wrapper = element;
    this.render();
    this.bindEventListeners();
    this.addEventListeners();
  }

  public update(data: { [key: string]: unknown } & IPluginConfiguration) {
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
    this.notify(type, notificationText);
  }
}

export default ControlMovementSetup;
