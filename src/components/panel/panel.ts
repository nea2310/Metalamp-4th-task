/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import MainSetup from './main-setup/main-setup';

import ScaleSetup from './scale-setup/scale-setup';

import ControlMovementSetup from './control-movement-setup/control-movement-setup';

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

  private wrapper: HTMLElement;

  private mainSetupElement: HTMLElement | null = null;

  private scaleSetupElement: HTMLElement | null = null;

  private controlMovementSetupElement: HTMLElement | null = null;

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

  private render() {
    this.mainSetupElement = this.wrapper.querySelector('.js-main-setup');
    this.scaleSetupElement = this.wrapper.querySelector('.js-scale-setup');
    this.controlMovementSetupElement = this.wrapper.querySelector('.js-control-movement-setup');

    if (!this.mainSetupElement) return false;
    this.mainSetup = new MainSetup('.js-main-setup', this.mainSetupElement);

    if (!this.scaleSetupElement) return false;
    this.scaleSetup = new ScaleSetup('.js-scale-setup', this.scaleSetupElement);

    if (!this.controlMovementSetupElement) return false;
    this.controlMovementSetup = new ControlMovementSetup('.js-control-movement-setup', this.controlMovementSetupElement);
    return true;
  }

  private createListeners() {
    if (!this.mainSetup) return false;
    this.mainSetup.subscribe(this.handleMainSetupChange);

    if (!this.scaleSetup) return false;
    this.scaleSetup.subscribe(this.handleScaleSetupChange);

    if (!this.controlMovementSetup) return false;
    this.controlMovementSetup.subscribe(this.handleControlMovementSetupChange);

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
}

export default Panel;
