import { TPluginConfiguration, IViewData } from '../../slider-metalamp/mvc/interface';
import ScaleSetup from './scale-setup/ScaleSetup';
import MainSetup from './main-setup/MainSetup';
import ControlMovementSetup from './control-movement-setup/ControlMovementSetup';
import ActionsSetup from './actions-setup/ActionsSetup';
import PanelObserver from './PanelObserver';

type TPanelComponents = MainSetup | ScaleSetup | ControlMovementSetup | ActionsSetup;

class Panel extends PanelObserver {
  private optionObjects: Array<TPanelComponents> = [];

  private wrapper: HTMLElement;

  private isSubscribed: boolean = true;

  private isDestroyed: boolean = false;

  private mainSetup: MainSetup | null = null;

  constructor(element: HTMLElement) {
    super();
    this.wrapper = element;
    this.render();
  }

  public update(data: TPluginConfiguration) {
    if (!this.isSubscribed || this.isDestroyed) return;
    this.optionObjects.forEach((option) => {
      if (!(option instanceof ActionsSetup)) option.update(data);
    });
  }

  public change(data: IViewData) {
    if (!this.mainSetup) return;
    this.mainSetup.change(data);
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

  private handlePanelChange = (data: { key: string, value: string | boolean }) => {
    const { key, value } = data;
    if (key === 'subscribe') this.isSubscribed = !!value;
    this.notify('panelUpdate', data);
  };

  private getElement(selector: string) {
    return this.wrapper.querySelector(`.js-${selector}-setup`);
  }

  private prepareObject<Y extends TPanelComponents, T extends new(arg: HTMLElement) => Y>(
    selector: string, ClassName: T) {
    const DOMElement = this.getElement(selector);
    let object: TPanelComponents | null = null;

    if (DOMElement instanceof HTMLElement) object = new ClassName(DOMElement);

    if (!object) return undefined;

    const nameMatch = String(ClassName).match(/^class (\w+)/);
    if (nameMatch) {
      const eventType = `${nameMatch[1][0].toLowerCase()}${nameMatch[1].slice(1)}Update`;
      object.subscribe(eventType, this.handlePanelChange);
    }

    if (object instanceof MainSetup) {
      this.mainSetup = object;
    }
    this.optionObjects.push(object);
    return object;
  }
}

export default Panel;
