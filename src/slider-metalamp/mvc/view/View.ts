import { defaultConf } from '../utils';
import Observer from '../Observer';
import {
  IPluginPrivateData,
  TPluginConfiguration,
  INotificationParameters,
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

  private conf: IPluginConfigurationFull = defaultConf;

  private root: IDOMElement;

  // private min = 0;

  // private max = 0;

  constructor(root: Element) {
    super();
    this.handleScaleReady = this.handleScaleReady.bind(this);
    this.root = root;
    this.render();
    this.collectParms();
  }

  public init(conf: IPluginConfigurationFull) {
    this.conf = conf;
    this.createListeners();
    this.switchVertical(this.conf.vertical);
    this.switchRange(conf);
    this.switchTip(conf);
    this.switchScale(conf);
    this.switchBar(conf);
    this.createSubViews();
  }

  public update(newConf: any) {
    const conf = { ...this.conf, ...newConf };
    const oldConf = this.conf;
    this.conf = conf;
    this.doCalculation(oldConf, this.conf);
  }

  private doCalculation(oldConf: IPluginConfigurationFull, newConf: IPluginConfigurationFull) {
    const sortArray = (object: TPluginConfiguration) => Object.entries(object).sort(
      (a: TPluginConfigurationItem, b: TPluginConfigurationItem) => {
        if (a[0] > b[0]) return 1;
        return -1;
      },
    );

    const changedConfItems = sortArray(newConf).filter((newConfItem) => {
      const confItem = sortArray(oldConf).find(
        (oldConfItem) => oldConfItem[0] === newConfItem[0],
      );
      if (!confItem) return null;
      return confItem[1] !== newConfItem[1];
    });

    changedConfItems.forEach((item) => {
      switch (item[0]) {
        case 'vertical':
          this.switchVertical(this.conf.vertical);
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

  public updateFromPos(data: IPluginPrivateData, conf: IPluginConfigurationFull) {
    if (!this.viewControl || !this.viewControl.controlMin) return;
    this.viewControl.setControlOnPosition(
      this.viewControl.controlMin,
      data.fromPosition,
    );
    this.viewControl.updateInput(conf);
    if (!this.viewBar) return;
    this.viewBar
      .updateBar(data.fromPosition, data.toPosition, conf.range, conf.vertical);
  }

  public updateToPos(data: IPluginPrivateData, conf: IPluginConfigurationFull) {
    if (!this.viewControl || !this.viewControl.controlMax) return;
    this.viewControl.setControlOnPosition(
      this.viewControl.controlMax,
      data.toPosition,
    );
    this.viewControl.updateInput(conf);
    if (!this.viewBar) return;
    this.viewBar.updateBar(data.fromPosition, data.toPosition, conf.range, conf.vertical);
  }

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

  public updateStep(newValue: number) {
    if (!this.viewScale) return;
    this.viewScale.updateStep(newValue);
  }

  public updateInterval(newValue: number) {
    if (!this.viewScale) return;
    this.viewScale.updateInterval(newValue);
  }

  public updateMin(newValue: number) {
    if (!this.viewScale) return;
    this.conf.min = newValue;
    this.viewScale.updateMin(newValue);
  }

  public updateMax(newValue: number) {
    if (!this.viewScale) return;
    this.conf.max = newValue;
    this.viewScale.updateMax(newValue);
  }

  handleScaleReady(scaleMarks: IPluginConfigurationItem[] = []) {
    if (!this.viewControl) return;
    this.viewControl.updateScaleMarks(scaleMarks, this.conf.min, this.conf.max, this.conf.vertical);
  }

  public switchVertical(newState: boolean) {
    this.conf = { ...this.conf, vertical: newState };
    this.changeMode(newState, 'orientation_vertical');
    if (!this.viewScale) return;
    this.viewScale.switchScale(newState);
    // if (!this.viewControl) return;
    // this.viewControl.switchVertical(conf);
  }

  // public updateScale(newValue: boolean) {
  //   if (!this.viewScale) return;
  //   this.viewScale.updateScale(newValue);
  // }

  public switchRange(conf: IPluginConfigurationFull, data: IPluginPrivateData | {} = {}) {
    this.changeMode(!conf.range, 'range-mode_single');
    if (!('fromPosition' in data) || !this.viewBar) return;
    this.viewBar.updateBar(data.fromPosition, data.toPosition, conf.range, conf.vertical);
  }

  public switchScale(conf: IPluginConfigurationFull) {
    this.changeMode(!conf.scale, 'scale-mode_hidden');
  }

  public switchBar(conf: IPluginConfigurationFull) {
    this.changeMode(!conf.bar, 'bar-mode_hidden');
  }

  public switchTip(conf: IPluginConfigurationFull) {
    this.changeMode(!conf.tip, 'tip-mode_hidden');
    if (!this.viewControl) return;
    this.viewControl.switchTip(conf);
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
    this.viewScale = new ViewScale(this.slider, this.track, this.conf, this.handleScaleReady);
    this.viewControl = new ViewControl(this.slider, this.conf, this.viewScale.scaleMarks);
    this.viewBar = new ViewBar(this.slider);
  }

  private createListeners() {
    if (!this.viewControl) return;
    this.viewControl.subscribe(this.handleMoveEvent);
    this.viewControl.subscribe(this.handleKeydownEvent);
  }

  private handleMoveEvent = (parms: INotificationParameters) => {
    if (parms.key !== 'MoveEvent') return;
    this.notify('MoveEvent', parms.data);
  };

  private handleKeydownEvent = (parms: INotificationParameters) => {
    if (parms.key !== 'KeydownEvent') return;
    this.notify('KeydownEvent', parms.data);
  };
}

export default View;
