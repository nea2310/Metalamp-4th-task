/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import MainSetup from './main-setup/main-setup';

import ScaleSetup from './scale-setup/scale-setup';

import ControlMovementSetup from './control-movement-setup/control-movement-setup';

import ActionsSetup from './actions-setup/actions-setup';

import PanelObserver from './panel-observer';

import { IConf } from '../../slider-metalamp/mvc/interface';

interface IConfAdvanced extends IConf {
  [value: string]: boolean | number | string | Function | undefined
}

class Panel extends PanelObserver {
  private optionObjects: (HTMLInputElement | null)[] | null = null;

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
    this.createListeners();
  }

  public update(data: IConfAdvanced) {
    if (!this.mainSetup) return false;
    this.mainSetup.update(data);
    if (!this.scaleSetup) return false;
    this.scaleSetup.update(data);
    if (!this.controlMovementSetup) return false;
    this.controlMovementSetup.update(data);
    return true;
  }

  public destroy() {
    this.mainSetup = null;
    this.scaleSetup = null;
    this.controlMovementSetup = null;
    this.actionsSetup = null;
    const panelChildren = this.wrapper.childNodes;
    panelChildren.forEach((element) => {
      element.remove();
    });
  }

  public disable(isDisabled = false) {
    if (!this.mainSetup) return false;
    this.mainSetup.disable(isDisabled);
    if (!this.scaleSetup) return false;
    this.scaleSetup.disable(isDisabled);
    if (!this.controlMovementSetup) return false;
    this.controlMovementSetup.disable(isDisabled);
    if (!this.actionsSetup) return false;
    this.actionsSetup.disable(isDisabled);
    return true;
  }

  private render() {
    this.mainSetupElement = this.wrapper.querySelector('.js-main-setup');
    this.scaleSetupElement = this.wrapper.querySelector('.js-scale-setup');
    this.controlMovementSetupElement = this.wrapper.querySelector('.js-control-movement-setup');
    this.actionsSetupElement = this.wrapper.querySelector('.js-actions-setup');

    if (!this.mainSetupElement) return false;
    this.mainSetup = new MainSetup('.js-main-setup', this.mainSetupElement);

    if (!this.scaleSetupElement) return false;
    this.scaleSetup = new ScaleSetup('.js-scale-setup', this.scaleSetupElement);

    if (!this.controlMovementSetupElement) return false;
    this.controlMovementSetup = new ControlMovementSetup('.js-control-movement-setup', this.controlMovementSetupElement);

    if (!this.actionsSetupElement) return false;
    this.actionsSetup = new ActionsSetup('.js-actions-setup', this.actionsSetupElement);
    return true;
  }

  private createListeners() {
    if (!this.mainSetup) return false;
    this.mainSetup.subscribe(this.handleMainSetupChange);

    if (!this.scaleSetup) return false;
    this.scaleSetup.subscribe(this.handleScaleSetupChange);

    if (!this.controlMovementSetup) return false;
    this.controlMovementSetup.subscribe(this.handleControlMovementSetupChange);

    if (!this.actionsSetup) return false;
    this.actionsSetup.subscribe(this.handleActionsSetupChange);

    return true;
  }

  private handleMainSetupChange = (parameters: { key: string, data: string | boolean }) => {
    this.notify(parameters.key, parameters.data);
  }

  private handleScaleSetupChange = (parameters: { key: string, data: string | boolean }) => {
    this.notify(parameters.key, parameters.data);
  }

  private handleControlMovementSetupChange = (parameters: {
    key: string, data: string | boolean
  }) => {
    this.notify(parameters.key, parameters.data);
  }

  private handleActionsSetupChange = (parameters: { key: string, data: string | boolean }) => {
    this.notify(parameters.key, parameters.data);
  }
}

export default Panel;
