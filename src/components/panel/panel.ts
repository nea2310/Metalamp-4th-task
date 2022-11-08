import MainSetup from './main-setup/main-setup';

import ScaleSetup from './scale-setup/scale-setup';

import ControlMovementSetup from './control-movement-setup/control-movement-setup';

import ActionsSetup from './actions-setup/actions-setup';

import PanelObserver from './panel-observer';

import { IConf } from '../../slider-metalamp/mvc/interface';

interface IConfIndexed extends IConf {
  [value: string]: boolean | number | string | Function | undefined
}

type IPanelComponents = MainSetup | ScaleSetup | ControlMovementSetup | ActionsSetup;

class Panel extends PanelObserver {
  private optionObjects: Array<IPanelComponents | null> = [];

  private wrapper: HTMLElement;

  constructor(element: HTMLElement) {
    super();
    this.wrapper = element;
    this.render();
  }

  public update(data: IConfIndexed) {
    this.optionObjects.forEach((option) => {
      if (!(option instanceof ActionsSetup)) {
        if (!option) return false;
        option.update(data);
      }
      return true;
    });
  }

  public disable(isDisabled = false) {
    this.optionObjects.forEach((option) => {
      if (!option) return false;
      option.disable(isDisabled);
      return true;
    });
  }

  public destroy() {
    this.optionObjects.forEach((option) => {
      let item = option;
      item = null;
      return item;
    });
    const panelChildren = this.wrapper.childNodes;
    panelChildren.forEach((element) => {
      element.remove();
    });
  }

  private render() {
    const types = new Map();

    types
      .set('main', MainSetup)
      .set('scale', ScaleSetup)
      .set('control-movement', ControlMovementSetup)
      .set('actions', ActionsSetup);

    types.forEach((value, key) => {
      this.prepareObject<typeof value, InstanceType<typeof value>>(key, value);
    });
  }

  private handlePanelChange = (parameters: { key: string, data: string | boolean }) => {
    this.notify(parameters.key, parameters.data);
  }

  private getElement(selector: string) {
    return this.wrapper.querySelector(`.js-${selector}-setup`) as HTMLElement;
  }

  // eslint-disable-next-line no-unused-vars
  private prepareObject<Y extends IPanelComponents, T extends new(arg: HTMLElement) => Y>(
    selector: string, ClassName: T) {
    const DOMElement = this.getElement(selector);
    const object = new ClassName(DOMElement);

    if (object) {
      object.subscribe(this.handlePanelChange);
      this.optionObjects.push(object);
    }
    return object;
  }
}

export default Panel;
