import sortObject from '../../../shared/utils/sortObject';
import { defaultConfiguration } from '../utils';
import Observer from '../Observer';
import {
  TPluginConfiguration,
  IPluginConfigurationFull,
  IDOMElement,
  IScaleMark,
} from '../interface';
import ViewScale from './view-scale/ViewScale';
import ViewControl from './view-control/ViewControl';
import ViewBar from './view-bar/ViewBar';

class View extends Observer {
  private dataAttributes: TPluginConfiguration = {};

  private configuration: IPluginConfigurationFull = defaultConfiguration;

  private root: IDOMElement;

  private viewControl?: ViewControl | null;

  private viewScale?: ViewScale | null;

  private viewBar?: ViewBar | null;

  private slider?: HTMLElement;

  private track?: HTMLElement;

  // private frame?: HTMLElement;

  constructor(root: Element) {
    super();
    this.root = root;
    this.render();
  }

  get dataAttributesConfiguration() {
    return this.dataAttributes;
  }

  public init(configuration: IPluginConfigurationFull) {
    this.configuration = configuration;
    const {
      vertical,
      range,
      tip,
      scale,
      bar,
    } = this.configuration;
    this.switchVertical(vertical);
    this.switchRange(range, vertical);
    this.switchTip(tip, vertical);
    this.switchScale(scale);
    this.switchBar(bar);
    this.createSubViews();
  }

  public update(configuration: IPluginConfigurationFull) {
    const base = this.configuration.scaleBase === 'step' ? 'interval' : 'step';
    const newConfiguration = {
      ...this.configuration,
      ...configuration,
      [base]: this.configuration[base],
    };
    const oldConfiguration = this.configuration;
    this.configuration = newConfiguration;

    const changedConfigurationItems = sortObject(newConfiguration)
      .filter((newConfigurationItem) => {
        const confItem = sortObject(oldConfiguration).find(
          (oldConfigurationItem) => oldConfigurationItem[0] === newConfigurationItem[0],
        );
        if (!confItem) return null;
        return confItem[1] !== newConfigurationItem[1];
      });

    const {
      min,
      max,
      step,
      interval,
      from,
      to,
      vertical,
      range,
      tip,
      bar,
      scale,
      scaleBase,
      round,
    } = newConfiguration;

    changedConfigurationItems.forEach((item) => {
      if (!this.viewScale || !this.viewControl) return;
      switch (item[0]) {
        case 'min':
          this.viewScale.update({ min });
          break;
        case 'max':
          this.viewScale.update({ max });
          break;
        case 'step':
          this.viewScale.update({ step, scaleBase });
          break;
        case 'interval':
          this.viewScale.update({ interval, scaleBase });
          break;
        case 'from':
          this.viewControl.controlConfiguration = this.configuration;
          this.viewControl.calcPositionSetByKey(true, from, to);
          break;
        case 'to':
          this.viewControl.controlConfiguration = this.configuration;
          this.viewControl.calcPositionSetByKey(false, from, to);
          break;
        case 'sticky':
          this.viewControl.controlConfiguration = this.configuration;
          this.viewControl.switchSticky();
          break;
        case 'shiftOnKeyDown':
        case 'shiftOnKeyHold':
          this.viewControl.controlConfiguration = this.configuration;
          break;
        case 'round':
          this.setRoundValue(round);
          break;
        case 'vertical':
          this.switchVertical(vertical);
          break;
        case 'range':
          this.switchRange(range, vertical);
          break;
        case 'tip':
          this.switchTip(tip, vertical);
          break;
        case 'bar':
          this.switchBar(bar);
          break;
        case 'scale':
          this.switchScale(scale);
          break;
        default: break;
      }
    });
  }

  public disable() {
    if (!this.slider) return;
    this.slider.classList.add('slider-metalamp__wrapper_disabled');
    if (!this.viewControl) return;
    this.viewControl.isSliderActive = false;
  }

  public enable() {
    if (!this.slider) return;
    this.slider.classList.remove('slider-metalamp__wrapper_disabled');
    if (!this.viewControl) return;
    this.viewControl.isSliderActive = true;
  }

  public destroy() {
    if (!this.viewScale) return;
    this.viewScale.destroy();
    this.viewScale = null;
    this.viewControl = null;
    this.viewBar = null;
    if (!this.slider) return;
    this.slider.remove();
  }

  private render() {
    this.slider = document.createElement('div');
    this.slider.className = 'slider-metalamp__wrapper';

    this.track = document.createElement('div');
    this.track.className = 'slider-metalamp__track';
    this.slider.append(this.track);

    // this.frame = document.createElement('div');
    // this.frame.className = 'slider-metalamp__frame';
    // this.slider.append(this.frame);

    this.root.after(this.slider);

    this.collectParameters();
  }

  private createSubViews() {
    if (!this.slider || !this.track) return;
    this.viewScale = new ViewScale(
      this.slider,
      this.track,
      this.configuration,
    );
    this.viewControl = new ViewControl(
      this.slider,
      this.configuration,
      this.viewScale.marks,
    );
    this.viewBar = new ViewBar(
      this.slider,
      this.configuration,
      this.viewControl.positionFrom,
      this.viewControl.positionTo,
    );
    this.bindListeners();
    this.createListeners();
  }

  private bindListeners() {
    this.handleScaleChange = this.handleScaleChange.bind(this);
    this.handleControlChange = this.handleControlChange.bind(this);
  }

  private createListeners() {
    if (!this.viewScale || !this.viewControl) return;
    this.viewScale.subscribe('viewScaleUpdate', this.handleScaleChange);
    this.viewControl.subscribe('viewControlUpdate', this.handleControlChange);
  }

  private setRoundValue(roundValue: number) {
    let newRoundValue = Math.round(Number(roundValue));
    const isNewRoundValueValid = newRoundValue >= 0 && newRoundValue <= 100;
    if (!isNewRoundValueValid) newRoundValue = 0;
    if (this.viewControl) {
      this.configuration = { ...this.configuration, round: newRoundValue };
      this.notify('viewUpdate', { round: newRoundValue });
      this.viewControl.controlConfigurationItem = { item: 'round', value: newRoundValue };
    }
  }

  private handleScaleChange(data: {
    scaleMarks: IScaleMark[],
    step: number,
    interval: number,
  }) {
    if (!this.viewControl) return;
    const { scaleMarks, step, interval } = data;
    const { min, max, vertical } = this.configuration;
    this.viewControl.updateScaleMarks(scaleMarks, min, max, vertical);
    this.configuration = { ...this.configuration, step, interval };
  }

  private handleControlChange(data: {
    fromPosition: number,
    toPosition: number,
    from: number,
    to: number,
    isRange: boolean,
    isVertical: boolean,
  }) {
    if (!this.viewBar) return;
    const { from, to } = data;
    this.configuration = { ...this.configuration, from, to };
    this.notify('viewUpdate', { from, to });
    this.viewBar.updateBar(data);
  }

  private switchVertical(isVertical: boolean) {
    this.changeMode(isVertical, 'orientation_vertical');
    if (!this.viewScale) return;
    this.viewScale.update({ vertical: isVertical });
  }

  private switchRange(isRange: boolean, isVertical = false) {
    this.changeMode(!isRange, 'range-mode_single');
    if (!this.viewBar || !this.viewControl) return;

    this.viewBar.updateBar({
      fromPosition: this.viewControl.positionFrom,
      toPosition: this.viewControl.positionTo,
      isRange,
      isVertical,
    });
    this.viewControl.switchRange(isRange);
  }

  private switchScale(isScale: boolean) {
    this.changeMode(!isScale, 'scale-mode_hidden');
  }

  private switchBar(isBar: boolean) {
    this.changeMode(!isBar, 'bar-mode_hidden');
  }

  private switchTip(isTip: boolean, isVertical: boolean) {
    this.changeMode(!isTip, 'tip-mode_hidden');
    if (!this.viewControl) return;
    this.viewControl.switchTip(isVertical);
  }

  private changeMode(parameter: boolean, modifier: string) {
    const className = `slider-metalamp__wrapper_${modifier}`;
    if (!this.slider) return;
    if (parameter) {
      this.slider.classList.add(className);
      return;
    }
    this.slider.classList.remove(className);
  }

  private collectParameters() {
    const booleanValues = ['vertical', 'range', 'sticky', 'scale', 'bar', 'tip'];
    const numberValues = ['min', 'max', 'from', 'to', 'round', 'step', 'interval', 'shiftonkeydown', 'shiftonkeyhold'];
    const stringValues = ['scalebase'];

    if (!(this.root instanceof HTMLElement)) return;
    const map = new Map();

    Object.entries(this.root.dataset).forEach((item) => {
      const [key, value] = item;
      if (typeof value !== 'string') return;
      if (booleanValues.includes(key) && value === 'true') map.set(key, true);
      if (booleanValues.includes(key) && value === 'false') map.set(key, false);
      if (numberValues.includes(key)) map.set(key, parseFloat(value));
      if (stringValues.includes(key)) map.set(key, value);
    });

    this.dataAttributes = Object.fromEntries(map.entries());
  }
}

export default View;
