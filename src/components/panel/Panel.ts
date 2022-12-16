import { IPluginConfiguration } from '../../slider-metalamp/mvc/interface';
import ScaleSetup from './scale-setup/ScaleSetup';
import MainSetup from './main-setup/MainSetup';
import ControlMovementSetup from './control-movement-setup/ControlMovementSetup';
import ActionsSetup from './actions-setup/ActionsSetup';
import PanelObserver from './PanelObserver';

type IPanelComponents = MainSetup | ScaleSetup | ControlMovementSetup | ActionsSetup;

class Panel extends PanelObserver {
  private optionObjects: Array<IPanelComponents> = [];

  private wrapper: HTMLElement;

  private isSubscribed: boolean = true;

  private isDestroyed: boolean = false;

  constructor(element: HTMLElement) {
    super();
    this.wrapper = element;
    this.render();
  }

  public update(data: IPluginConfiguration) {
    if (!this.isSubscribed || this.isDestroyed) return;
    this.optionObjects.forEach((option) => {
      if (!(option instanceof ActionsSetup)) {
        option.update(data);
      }
    });
  }

  public disable(isDisabled = false) {
    this.optionObjects.forEach((option) => {
      option.disable(isDisabled);
    });
  }

  public destroy() {
    this.isDestroyed = true;
    this.optionObjects = [];
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
    const { key, data } = parameters;
    if (key === 'subscribe') {
      this.isSubscribed = !!data;
    }
    this.notify(key, data);
  };

  private getElement(selector: string) {
    return this.wrapper.querySelector(`.js-${selector}-setup`);
  }

  private prepareObject<Y extends IPanelComponents, T extends new(arg: HTMLElement) => Y>(
    selector: string, ClassName: T) {
    const DOMElement = this.getElement(selector);
    let object: IPanelComponents | null = null;

    if (DOMElement instanceof HTMLElement) {
      object = new ClassName(DOMElement);
    }

    if (object) {
      object.subscribe(this.handlePanelChange);
      this.optionObjects.push(object);
    }
    return object;
  }
}

export default Panel;
