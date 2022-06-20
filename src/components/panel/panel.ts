/* eslint-disable space-before-function-paren */
/* eslint-disable fsd/split-conditionals */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import MainSetup from './main-setup/main-setup';

import ScaleSetup from './scale-setup/scale-setup';

import ControlMovementSetup from './control-movement-setup/control-movement-setup';

import ActionsSetup from './actions-setup/actions-setup';

import PanelObserver from './panel-observer';

import { IConf } from '../../slider-metalamp/mvc/interface';

interface IConfAdvanced extends IConf {
  [value: string]: boolean | number | string | Function | undefined
}

interface test<T, U> { }

class Panel extends PanelObserver {
  private optionObjects: Array<MainSetup | ScaleSetup | ControlMovementSetup | ActionsSetup> = [];

  private mainSetup: MainSetup | null = null;

  private scaleSetup: ScaleSetup | null = null;

  private controlMovementSetup: ControlMovementSetup | null = null;

  private actionsSetup: ActionsSetup | null = null;

  private wrapper: HTMLElement;

  private mainSetupElement: HTMLElement | null = null;

  private scaleSetupElement: HTMLElement | null = null;

  private controlMovementSetupElement: HTMLElement | null = null;

  private actionsSetupElement: HTMLElement | null = null;

  constructor(element: HTMLElement) {
    super();
    this.wrapper = element;
    this.render();
  }

  public update(data: IConfAdvanced) {
    this.optionObjects.forEach((option: any) => {
      if (!(option instanceof ActionsSetup)) {
        option.update(data);
      }
    });
  }

  public disable(isDisabled = false) {
    this.optionObjects.forEach((option: any) => option.disable(isDisabled));
  }

  public destroy() {
    this.optionObjects.forEach((option: any) => { option = null; });
    const panelChildren = this.wrapper.childNodes;
    panelChildren.forEach((element) => {
      element.remove();
    });
  }

  private render() {
    this.mainSetup = this.prepareObject<typeof MainSetup, MainSetup>('main', MainSetup);
    this.scaleSetup = this.prepareObject<typeof ScaleSetup, ScaleSetup>('scale', ScaleSetup);
    this.controlMovementSetup = this.prepareObject<typeof ControlMovementSetup, ControlMovementSetup>('control-movement', ControlMovementSetup);
    this.actionsSetup = this.prepareObject<typeof ActionsSetup, ActionsSetup>('actions', ActionsSetup);
  }

  private handlePanelChange = (parameters: { key: string, data: string | boolean }) => {
    this.notify(parameters.key, parameters.data);
  }

  private getElement(selector: string) {
    return this.wrapper.querySelector(`.js-${selector}-setup`) as HTMLElement;
  }

  private prepareObject<T extends new (arg: HTMLElement) => Y, Y>(
    selector: string, ClassName: T) {
    const DOMElement = this.getElement(selector);
    const object = new ClassName(DOMElement);

    if (object instanceof MainSetup || object instanceof ScaleSetup || object instanceof ControlMovementSetup || object instanceof ActionsSetup) {
      object.subscribe(this.handlePanelChange);
      this.optionObjects.push(object);
    }
    return object;
  }
}

export default Panel;
