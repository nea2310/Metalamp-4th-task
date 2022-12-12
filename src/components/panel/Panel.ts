import { IConf } from '../../slider-metalamp/mvc/interface';
import Toggle from '../toggle/Toggle';
import Radiobuttons from '../radiobuttons/Radiobuttons';
import ScaleSetup from './scale-setup/ScaleSetup';
import MainSetup from './main-setup/MainSetup';
import ControlMovementSetup from './control-movement-setup/ControlMovementSetup';
import ActionsSetup from './actions-setup/ActionsSetup';
import PanelObserver from './PanelObserver';

type IPanelComponents = MainSetup | ScaleSetup | ControlMovementSetup | ActionsSetup;

type IPanelElements = Radiobuttons | Toggle;

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

  public update(data: IConf) {
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
    const renderElements = <
    Y extends IPanelElements, T extends new(arg: Element) => Y>(selector: string, ClassName: T) => {
      const elements = this.wrapper.querySelectorAll(selector);
      elements.forEach((element) => new ClassName(element));
    };

    renderElements('.js-radiobuttons', Radiobuttons);
    renderElements('.js-toggle', Toggle);

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
    return this.wrapper.querySelector(`.js-${selector}-setup`) as HTMLElement;
  }

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
