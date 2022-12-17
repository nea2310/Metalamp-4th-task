import updateObject from '../../../shared/utils/updateObject';
import prepareElements from '../../../shared/utils/prepareElements';
import getNotificationDetails from '../../../shared/utils/getNotificationDetails';
import getElement from '../../../shared/utils/getElement';
import { TPluginConfiguration, TInputTypes } from '../../../slider-metalamp/mvc/interface';
import PanelObserver from '../PanelObserver';

const OPTIONS: Array<[string, TInputTypes]> = [
  ['min', 'input'],
  ['max', 'input'],
  ['from', 'input'],
  ['to', 'input'],
  ['vertical', 'toggle'],
  ['range', 'toggle'],
  ['bar', 'toggle'],
  ['tip', 'toggle'],
];

class MainSetup extends PanelObserver {
  private optionObjects: Array<HTMLInputElement> = [];

  private wrapper: HTMLElement;

  private optionTo: HTMLInputElement | null = null;

  constructor(element: HTMLElement) {
    super();
    this.wrapper = element;
    this.render();
    this.bindEventListeners();
    this.addEventListeners();
  }

  public update(data: { [key: string]: unknown } & TPluginConfiguration) {
    this.optionObjects = updateObject(this.optionObjects, data);

    if (this.optionTo) {
      this.optionTo.disabled = !data.range;
    }
  }

  public disable(isDisabled = false) {
    this.optionObjects.forEach((optionObject) => {
      const item = optionObject;
      item.disabled = isDisabled;
    });
  }

  private render() {
    this.optionTo = getElement(this.wrapper, 'to');
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

export default MainSetup;
