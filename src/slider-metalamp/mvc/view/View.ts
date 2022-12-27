import { defaultConf } from '../utils';
import Observer from '../Observer';
import {
  IPluginPrivateData,
  TPluginConfiguration,
  // INotificationParameters,
  IPluginConfigurationFull,
  IDOMElement,
  IPluginConfigurationItem,
  TPluginConfigurationItem,
} from '../interface';
import ViewScale from './view-scale/ViewScale';
import ViewControl from './view-control/ViewControl';
import ViewBar from './view-bar/ViewBar';

class View extends Observer {
  public viewControl: ViewControl | undefined;

  public viewScale: ViewScale | undefined;

  public viewBar: ViewBar | undefined;

  public dataAttributesConf: TPluginConfiguration = {};

  public slider: HTMLElement | undefined;

  private track: HTMLElement | undefined;

  private frame: HTMLElement | undefined;

  public configuration: IPluginConfigurationFull = defaultConf;

  private root: IDOMElement;

  constructor(root: Element) {
    super();
    this.handleScaleReady = this.handleScaleReady.bind(this);
    this.root = root;
    this.render();
    this.collectParms();
    this.handleControlSet = this.handleControlSet.bind(this);
  }

  public init(conf: IPluginConfigurationFull) {
    this.configuration = conf;
    // this.createListeners();
    this.switchVertical(this.configuration.vertical);
    // this.switchRange(conf);
    // this.switchTip(conf);
    // this.switchScale(conf);
    // this.switchBar(conf);
    this.createSubViews();
  }

  public update(newConf: any) {
    const test = this.configuration.scaleBase === 'step' ? 'interval' : 'step';
    const configuration = { ...this.configuration, ...newConf, [test]: this.configuration[test] };
    const oldConfiguration = this.configuration;
    this.configuration = configuration;
    this.doCalculation(oldConfiguration, this.configuration);
  }

  private doCalculation(
    oldConfiguration: IPluginConfigurationFull,
    newConfiguration: IPluginConfigurationFull,
  ) {
    const sortArray = (object: TPluginConfiguration) => Object.entries(object).sort(
      (a: TPluginConfigurationItem, b: TPluginConfigurationItem) => {
        if (a[0] > b[0]) return 1;
        return -1;
      },
    );

    const changedConfigurationItems = sortArray(newConfiguration).filter((newConfigurationItem) => {
      const confItem = sortArray(oldConfiguration).find(
        (oldConfigurationItem) => oldConfigurationItem[0] === newConfigurationItem[0],
      );
      if (!confItem) return null;
      return confItem[1] !== newConfigurationItem[1];
    });
    const {
      from,
      to,
      vertical,
      step,
      interval,
      min,
      max,
      scaleBase,
    } = newConfiguration;
    changedConfigurationItems.forEach((item) => {
      switch (item[0]) {
        case 'step':
          console.log('step: ', step);
          console.log('scaleBase: ', scaleBase);
          if (!this.viewScale) return;
          this.viewScale.updateStep(step, scaleBase);
          break;
        case 'interval':
          console.log('interval: ', interval);
          if (!this.viewScale) return;
          this.viewScale.updateInterval(interval, scaleBase);
          break;
        case 'min':
          console.log('min');
          if (!this.viewScale) return;
          this.configuration.min = min;
          this.viewScale.updateMin(min);
          break;
        case 'max':
          console.log('max');
          if (!this.viewScale) return;
          this.configuration.max = max;
          this.viewScale.updateMax(max);
          break;
        case 'vertical':
          console.log('vertical');
          if (!vertical) return;
          this.switchVertical(vertical);
          break;
        case 'from':
          console.log('from');
          if (!this.viewControl) return;
          this.viewControl.updateConfiguration(from, 'fromValue');
          this.viewControl.calcPositionSetByKey(true, from, to);
          break;
        case 'to':
          console.log('to');
          if (!this.viewControl) return;
          this.viewControl.updateConfiguration(to, 'toValue');
          this.viewControl.calcPositionSetByKey(false, from, to);
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

  // public updateFromPos(data: IPluginPrivateData, conf: IPluginConfigurationFull) {
  //   if (!this.viewControl || !this.viewControl.controlMin) return;
  //   this.viewControl.setControlOnPosition(
  //     this.viewControl.controlMin,
  //     data.fromPosition,
  //   );
  //   this.viewControl.updateInput(conf);
  //   // if (!this.viewBar) return;
  //   // this.viewBar
  //   // .updateBar(data.fromPosition, data.toPosition, conf.range, conf.vertical);
  // }

  // public updateToPos(data: IPluginPrivateData, conf: IPluginConfigurationFull) {
  //   if (!this.viewControl || !this.viewControl.controlMax) return;
  //   this.viewControl.setControlOnPosition(
  //     this.viewControl.controlMax,
  //     data.toPosition,
  //   );
  //   this.viewControl.updateInput(conf);
  //   // if (!this.viewBar) return;
  //   // this.viewBar.updateBar(data.fromPosition, data.toPosition, conf.range, conf.vertical);
  // }

  public updateFromValue(data: IPluginPrivateData) {
    if (!this.viewControl) return;
    this.viewControl.updateValue(data.fromValue, true);
  }

  public updateToValue(data: IPluginPrivateData) {
    if (!this.viewControl) return;
    this.viewControl.updateValue(data.toValue, false);
  }

  // public updateScale(data: IPluginPrivateData, conf: IPluginConfigurationFull) {
  //   if (!this.viewScale) return;
  //   console.log(data.marksArray, conf);
  // }

  // public updateStep(newValue: number) {
  //   if (!this.viewScale) return;
  //   this.viewScale.updateStep(newValue);
  // }

  // public updateInterval(newValue: number) {
  //   if (!this.viewScale) return;
  //   this.viewScale.updateInterval(newValue);
  // }

  public updateMin(newValue: number) {
    if (!this.viewScale) return;
    this.configuration.min = newValue;
    this.viewScale.updateMin(newValue);
  }

  public updateMax(newValue: number) {
    if (!this.viewScale) return;
    this.configuration.max = newValue;
    this.viewScale.updateMax(newValue);
  }

  handleScaleReady(data: {
    scaleMarks: IPluginConfigurationItem[],
    step: number,
    interval: number,
  }) {
    if (!this.viewControl) return;
    const { scaleMarks, step, interval } = data;
    const { min, max, vertical } = this.configuration;
    this.viewControl.updateScaleMarks(scaleMarks, min, max, vertical);
    this.configuration.step = step;
    this.configuration.interval = interval;
    console.log('this.configuration>>>', this.configuration);
  }

  handleControlSet(data: {
    fromPosition: number,
    toPosition: number,
    isRange: boolean,
    isVertical: boolean,
  }) {
    if (!this.viewBar) return;
    this.viewBar.updateBar(data);
  }

  public switchVertical(newState: boolean) {
    this.configuration = { ...this.configuration, vertical: newState };
    this.changeMode(newState, 'orientation_vertical');
    if (!this.viewScale) return;
    this.viewScale.switchScale(newState);
  }

  // public updateScale(newValue: boolean) {
  //   if (!this.viewScale) return;
  //   this.viewScale.updateScale(newValue);
  // }

  // public switchRange(conf: IPluginConfigurationFull, data: IPluginPrivateData | {} = {}) {
  //   console.log(data);
  //   this.changeMode(!conf.range, 'range-mode_single');
  //   // if (!('fromPosition' in data) || !this.viewBar) return;
  //   // this.viewBar.updateBar(data.fromPosition, data.toPosition, conf.range, conf.vertical);
  // }

  // public switchScale(conf: IPluginConfigurationFull) {
  //   this.changeMode(!conf.scale, 'scale-mode_hidden');
  // }

  // public switchBar(conf: IPluginConfigurationFull) {
  //   this.changeMode(!conf.bar, 'bar-mode_hidden');
  // }

  // public switchTip(conf: IPluginConfigurationFull) {
  //   this.changeMode(!conf.tip, 'tip-mode_hidden');
  //   if (!this.viewControl) return;
  //   this.viewControl.switchTip(conf);
  // }

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
    this.dataAttributesConf = {};
    const map = new Map();
    const properties = [
      'min',
      'max',
      'from',
      'to',
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
    this.dataAttributesConf = Object.fromEntries(map.entries());
  }

  private createSubViews() {
    if (!this.slider || !this.track) return;
    // console.log('conf.interval>>>', this.configuration.interval);
    this.viewScale = new ViewScale(
      this.slider,
      this.track,
      this.configuration,
      this.handleScaleReady,
    );
    this.viewControl = new ViewControl(
      this.slider,
      this.configuration,
      this.viewScale.scaleMarks,
      this.handleControlSet,
    );
    this.viewBar = new ViewBar(
      this.slider,
      this.configuration,
      this.viewControl.fromPosition,
      this.viewControl.toPosition,
    );
  }

  // private createListeners() {
  //   if (!this.viewControl) return;
  //   this.viewControl.subscribe(this.handleMoveEvent);
  //   this.viewControl.subscribe(this.handleKeydownEvent);
  // }

  // private handleMoveEvent = (parms: INotificationParameters) => {
  //   if (parms.key !== 'MoveEvent') return;
  //   this.notify('MoveEvent', parms.data);
  // };

  // private handleKeydownEvent = (parms: INotificationParameters) => {
  //   if (parms.key !== 'KeydownEvent') return;
  //   this.notify('KeydownEvent', parms.data);
  // };
}

export default View;
