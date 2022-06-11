/* eslint-disable fsd/split-conditionals */
import ViewBar from '../view/view-bar/view-bar';
import ViewControl from '../view/view-control/view-control';
import ViewScale from '../view/view-scale/view-scale';
import {
  IdataFull,
  IConf,
  IFireParms,
  IConfFull,
} from '../interface';
import Observer from '../observer';
import { defaultConf } from '../utils';

interface IElement extends Element {
  value?: string;
  readonly offsetHeight?: number;
  readonly offsetWidth?: number;
  clickOutsideEvent?(): void;
}

class View extends Observer {
  public viewControl: ViewControl | undefined;

  public viewScale: ViewScale | undefined;

  public viewBar: ViewBar | undefined;

  public backEndConf: IConf = {};

  public slider: HTMLElement | undefined;

  private track: HTMLElement | undefined;

  private frame: HTMLElement | undefined;

  private conf: IConfFull = defaultConf;

  private root: IElement;

  constructor(root: Element) {
    super();
    this.root = root;
    this.render();
    this.collectParms();
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

    /* Находим корневой элемент и добавляем слайдер */
    this.root.after(this.slider);
  }

  public init(conf: IConfFull) {
    this.conf = conf;
    this.createSubViews();
    this.createListeners();
    this.switchVertical(conf);
  }

  public disable() {
    if (this.slider) {
      this.slider.classList.add('slider-metalamp__wrapper_disabled');
    }
  }

  public enable() {
    if (this.slider) {
      this.slider.classList.remove('slider-metalamp__wrapper_disabled');
    }
  }

  public updateFromPos(data: IdataFull, conf: IConfFull) {
    if (this.viewControl && this.viewControl.controlMin) {
      this.viewControl.updatePos(
        this.viewControl.controlMin,
        data.fromPosition,
      );
      this.viewControl.updateInput(conf);
    }
  }

  public updateToPos(data: IdataFull, conf: IConfFull) {
    if (this.viewControl && this.viewControl.controlMax) {
      this.viewControl.updatePos(
        this.viewControl.controlMax,
        data.toPosition,
      );
      this.viewControl.updateInput(conf);
    }
  }

  public updateFromValue(data: IdataFull) {
    if (this.viewControl) { this.viewControl.updateVal(data.fromValue, true); }
  }

  public updateToValue(data: IdataFull) {
    if (this.viewControl) { this.viewControl.updateVal(data.toValue, false); }
  }

  public updateScale(data: IdataFull, conf: IConfFull) {
    if (this.viewScale) { this.viewScale.createScale(data.marksArray, conf); }
  }

  public updateBar(data: IdataFull, conf: IConfFull) {
    if (this.viewBar) {
      this.viewBar
        .updateBar(data.barPos, data.barWidth, conf.vertical);
    }
  }

  public switchVertical(conf: IConfFull) {
    if (this.slider && this.track && this.frame) {
      if (conf.vertical) {
        this.slider.classList.add('slider-metalamp__wrapper__orientation_vertical');
        this.track.classList.add('slider-metalamp__track__orientation_vertical');
        this.frame.classList.add('slider-metalamp__frame__orientation_vertical');
      } else {
        this.slider.classList.remove('slider-metalamp__wrapper__orientation_vertical');
        this.track.classList.remove('slider-metalamp__track__orientation_vertical');
        this.frame.classList.remove('slider-metalamp__frame__orientation_vertical');
      }
    }
    if (this.viewBar && this.viewControl) {
      this.viewBar.switchVertical(conf);
      this.viewControl.switchVertical(conf);
    }
  }

  public switchRange(conf: IConfFull) {
    if (this.viewControl) { this.viewControl.switchRange(conf); }
  }

  public switchScale(conf: IConfFull) {
    if (this.viewScale) {
      this.viewScale.switchScale(conf);
    }
  }

  public switchBar(conf: IConfFull) {
    if (this.viewBar) {
      this.viewBar.switchBar(conf);
    }
  }

  public switchTip(conf: IConfFull) {
    if (this.viewControl) {
      this.viewControl.switchTip(conf);
    }
  }

  private collectParms() {
    this.backEndConf = {};
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

    for (let i = 0; i < this.root.attributes.length; i += 1) {
      const elem = this.root.attributes[i];
      const a = elem.name.replace(/^data-/, '');
      if (properties.indexOf(a) !== -1) {
        map.set(a, elem.value);
      }
    }
    map.forEach((value, key) => {
      // если значение содержит только цифры
      if (/^-?\d+\.?\d*$/.test(value)) {
        map.set(key, parseFloat(value));
      }
      // если значение содержит строку 'true'
      if (value === 'true') {
        map.set(key, true);
      }
      // если значение содержит строку 'false'
      if (value === 'false') {
        map.set(key, false);
      }
      // перевод ключей в camelCase
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
    this.backEndConf = Object.fromEntries(map.entries());
  }

  private createSubViews() {
    if (this.slider && this.track) {
      this.viewControl = new ViewControl(this.slider, this.conf);
      this.viewScale = new ViewScale(this.slider, this.track, this.conf);
      this.viewBar = new ViewBar(this.slider, this.conf);
    }
  }

  private createListeners() {
    if (this.viewControl) {
      this.viewControl.subscribe(this.handleMoveEvent);
      this.viewControl.subscribe(this.handleKeydownEvent);
    }
  }

  private handleMoveEvent = (parms: IFireParms) => {
    if (parms.key !== 'MoveEvent') return;

    this.fire('MoveEvent', parms.data);
  }

  private handleKeydownEvent = (parms: IFireParms) => {
    if (parms.key !== 'KeydownEvent') return;

    this.fire('KeydownEvent', parms.data);
  }
}

export default View;
