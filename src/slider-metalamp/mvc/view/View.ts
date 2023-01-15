import sortArray from '../../../shared/utils/sortArray';
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
  private viewControl: ViewControl | undefined;

  private viewScale: ViewScale | undefined;

  private viewBar: ViewBar | undefined;

  private dataAttributes: TPluginConfiguration = {};

  private slider: HTMLElement | undefined;

  private track: HTMLElement | undefined;

  private frame: HTMLElement | undefined;

  private configuration: IPluginConfigurationFull = defaultConfiguration;

  private root: IDOMElement;

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

    const changedConfigurationItems = sortArray(newConfiguration)
      .filter((newConfigurationItem) => {
        const confItem = sortArray(oldConfiguration).find(
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
      sticky,
      shiftOnKeyDown,
      shiftOnKeyHold,
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
          this.viewControl.updateConfiguration(from, 'fromValue');
          this.viewControl.calcPositionSetByKey(true, from, to);
          break;
        case 'to':
          this.viewControl.updateConfiguration(to, 'toValue');
          this.viewControl.calcPositionSetByKey(false, from, to);
          break;
        case 'sticky':
          this.viewControl.controlConfiguration = { parameter: 'sticky', value: sticky };
          this.viewControl.switchSticky();
          break;
        case 'shiftOnKeyDown':
          this.viewControl.controlConfiguration = { parameter: 'shiftOnKeyDown', value: shiftOnKeyDown };
          break;
        case 'shiftOnKeyHold':
          this.viewControl.controlConfiguration = { parameter: 'shiftOnKeyHold', value: shiftOnKeyHold };
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
  }

  public enable() {
    if (!this.slider) return;
    this.slider.classList.remove('slider-metalamp__wrapper_disabled');
  }

  public destroy() {
    if (!this.slider) return;
    this.slider.remove();
  }

  private render() {
    this.slider = document.createElement('div');
    this.slider.className = 'slider-metalamp__wrapper';

    this.track = document.createElement('div');
    this.track.className = 'slider-metalamp__track';
    this.slider.append(this.track);

    this.frame = document.createElement('div');
    this.frame.className = 'slider-metalamp__frame';
    this.slider.append(this.frame);

    this.root.after(this.slider);

    this.collectParms();
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
    this.viewScale.subscribe(this.handleScaleChange, 'viewScale');
    this.viewControl.subscribe(this.handleControlChange, 'viewControl');
  }

  private setRoundValue(roundValue: number) {
    let newRoundValue = Math.round(Number(roundValue));
    const isNewRoundValueValid = newRoundValue >= 0 && newRoundValue <= 100;
    if (!isNewRoundValueValid) newRoundValue = 0;
    this.configuration = { ...this.configuration, round: newRoundValue };
    this.notify('view', { round: newRoundValue });
    if (!this.viewControl) return;
    this.viewControl.controlConfiguration = { parameter: 'round', value: newRoundValue };
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
    const { from, to } = data;
    this.configuration = { ...this.configuration, from, to };
    this.notify('view', { from, to });
    if (!this.viewBar) return;
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
    this.viewControl.controlConfiguration = { parameter: 'range', value: isRange };
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

  private collectParms() {
    this.dataAttributes = {};
    const map = new Map();
    const properties = [
      'min',
      'max',
      'from',
      'to',
      'round',
      'step',
      'interval',
      'shiftonkeydown',
      'shiftonkeyhold',
      'scalebase',
      'vertical',
      'range',
      'sticky',
      'scale',
      'bar',
      'tip',
    ];

    const attributesArray = Array.from(this.root.attributes);

    attributesArray.forEach((element: Attr) => {
      const name = element.name.replace(/^data-/, '');
      if (properties.indexOf(name) === -1) return;
      map.set(name, element.value);
    });

    map.forEach((value, key) => {
      if (/^-?\d+\.?\d*$/.test(value)) map.set(key, parseFloat(value));

      if (value === 'true') map.set(key, true);

      if (value === 'false') map.set(key, false);

      if (key === 'shiftonkeydown') {
        map.set('shiftOnKeyDown', value);
        map.delete(key);
      }
      if (key === 'shiftonkeyhold') {
        map.set('shiftOnKeyHold', value);
        map.delete(key);
      }
      if (key === 'scalebase') {
        map.set('scaleBase', value);
        map.delete(key);
      }
    });
    this.dataAttributes = Object.fromEntries(map.entries());
  }
}

export default View;
