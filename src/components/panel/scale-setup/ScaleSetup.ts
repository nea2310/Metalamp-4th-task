import updateObject from '../../../shared/utils/updateObject';
import prepareElements from '../../../shared/utils/prepareElements';
import getNotificationDetails from '../../../shared/utils/getNotificationDetails';
import getElement from '../../../shared/utils/getElement';
import { IConf } from '../../../slider-metalamp/mvc/interface';

import PanelObserver from '../PanelObserver';

type AllowedTypes = 'input' | 'toggle' | 'radiobuttons';

const OPTIONS: Array<[string, AllowedTypes]> = [
  ['scale', 'toggle'],
  ['interval', 'input'],
  ['step', 'input'],
  ['scaleBaseStep', 'radiobuttons'],
  ['scaleBaseInterval', 'radiobuttons'],
];

class ScaleSetup extends PanelObserver {
  private optionObjects: Array<HTMLInputElement> = [];

  private wrapper: HTMLElement;

  private optionInterval: HTMLInputElement | null = null;

  private optionStep: HTMLInputElement | null = null;

  private scaleBaseSteps: HTMLInputElement | null = null;

  private scaleBaseIntervals: HTMLInputElement | null = null;

  constructor(element: HTMLElement) {
    super();
    this.wrapper = element;
    this.render();
    this.bindEventListeners();
    this.addEventListeners();
  }

  public update(data: { [key: string]: unknown } & IConf) {
    const switchOption = (option: 'step' | 'interval' = 'step') => {
      if (!this.optionStep || !this.optionInterval) {
        return;
      }
      this.optionStep.disabled = (option === 'interval');
      this.optionInterval.disabled = (option === 'step');
    };

    this.optionObjects = updateObject(this.optionObjects, data);

    if (data.scaleBase === 'interval' && this.scaleBaseIntervals) {
      this.scaleBaseIntervals.checked = true;
      switchOption('interval');
    }

    if (data.scaleBase === 'step' && this.scaleBaseSteps) {
      this.scaleBaseSteps.checked = true;
      switchOption();
    }
  }

  public disable(isDisabled = false) {
    this.optionObjects.forEach((optionObject) => {
      const item = optionObject;
      item.disabled = isDisabled;
    });
  }

  private render() {
    this.optionInterval = getElement(this.wrapper, 'interval');
    this.optionStep = getElement(this.wrapper, 'step');
    this.scaleBaseSteps = getElement(this.wrapper, 'scaleBaseStep', 'radiobuttons');
    this.scaleBaseIntervals = getElement(this.wrapper, 'scaleBaseInterval', 'radiobuttons');
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
    let { type, notificationText } = getNotificationDetails(target);

    if (type === 'scaleBaseInterval' || type === 'scaleBaseStep') {
      notificationText = type.slice(9).toLowerCase();
      type = 'scaleBase';
    }
    this.notify(type, notificationText);
  }
}

export default ScaleSetup;
