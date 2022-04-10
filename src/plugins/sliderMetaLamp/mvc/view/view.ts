import { ViewBar } from './../view/view-bar/view-bar';
import { ViewControl } from
  './../view/view-control/view-control';
import { ViewScale } from './../view/view-scale/view-scale';
import { IdataFull, IConf, IFireParms, IConfFull } from '../interface';
import { Observer } from '../observer';
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
  private root: IElement;
  public slider: HTMLElement;
  private track: HTMLElement;
  private frame: HTMLElement;
  private conf: IConfFull = defaultConf;
  public backEndConf: IConf = {};

  constructor(root: Element) {
    super();
    /*Находим корневой элемент*/
    this.root = root;
    // this.render();
    // start render
    this.slider = document.createElement('div');
    this.slider.className = 'rs-metalamp__wrapper';
    this.root.after(this.slider);
    this.track = document.createElement('div');

    this.track.className = 'rs-metalamp__track';
    this.slider.append(this.track);
    this.frame = document.createElement('div');
    this.frame.className = 'rs-metalamp__frame';
    this.slider.append(this.frame);
    // finish render
    this.collectParms();
  }


  public init(conf: IConfFull) {
    this.conf = conf;
    this.createSubViews();
    this.createListeners();
    this.switchVertical(conf);
  }

  public disable() {
    this.slider.classList.add('rs-metalamp__wrapper_disabled');
  }

  public enable() {
    this.slider.classList.remove('rs-metalamp__wrapper_disabled');
  }

  public updateFromPos(data: IdataFull, conf: IConfFull) {
    if (this.viewControl) {
      this.viewControl.updatePos(this.viewControl.controlMin,
        data.fromPos);
      this.viewControl.updateInput(conf);
    }
  }

  public updateToPos(data: IdataFull, conf: IConfFull) {
    if (this.viewControl) {
      this.viewControl.updatePos(this.viewControl.controlMax,
        data.toPos);
      this.viewControl.updateInput(conf);
    }
  }

  public updateFromVal(data: IdataFull) {
    if (this.viewControl) { this.viewControl.updateVal(data.fromVal, true); }
  }

  public updateToVal(data: IdataFull) {
    if (this.viewControl) { this.viewControl.updateVal(data.toVal, false); }
  }

  public updateScale(data: IdataFull, conf: IConfFull) {
    if (this.viewScale) { this.viewScale.createScale(data.marksArr, conf); }

  }

  public updateBar(data: IdataFull, conf: IConfFull) {
    if (this.viewBar) {
      this.viewBar.
        updateBar(data.barPos, data.barWidth, conf.vertical);
    }
  }

  public switchVertical(conf: IConfFull) {
    if (conf.vertical) {
      this.slider.classList.add('rs-metalamp__wrapper_vert');
      this.track.classList.add('rs-metalamp__track_vert');
      this.frame.classList.add('rs-metalamp__frame_vert');
    } else {
      this.slider.classList.remove('rs-metalamp__wrapper_vert');
      this.track.classList.remove('rs-metalamp__track_vert');
      this.frame.classList.remove('rs-metalamp__frame_vert');
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

  private render() {
    this.slider = document.createElement('div');
    this.slider.className = 'rs-metalamp__wrapper';
    this.root.after(this.slider);
    this.track = document.createElement('div');

    this.track.className = 'rs-metalamp__track';
    this.slider.append(this.track);
    this.frame = document.createElement('div');
    this.frame.className = 'rs-metalamp__frame';
    this.slider.append(this.frame);
  }

  private collectParms() {
    this.backEndConf = {};
    let map = new Map();
    let arr = ['min',
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
    for (let elem of this.root.attributes) {
      let a = elem.name.replace(/^data-/, '');
      if (arr.indexOf(a) != -1) {
        map.set(a, elem.value);
      }
    }
    for (let elem of map) {
      //если значение содержит только цифры
      if (/^-?\d+\.?\d*$/.test(elem[1])) {
        map.set(elem[0], parseFloat(elem[1]));
      }
      //если значение содержит строку 'true'
      if (elem[1] == 'true') {
        map.set(elem[0], true);
      }
      //если значение содержит строку 'false'
      if (elem[1] == 'false') {
        map.set(elem[0], false);
      }
      //перевод ключей в camelCase
      if (elem[0] == 'shiftonkeydown') {
        map.set('shiftOnKeyDown', elem[1]);
        map.delete(elem[0]);
      }
      if (elem[0] == 'shiftonkeyhold') {
        map.set('shiftOnKeyHold', elem[1]);
        map.delete(elem[0]);
      }
      if (elem[0] == 'scalebase') {
        map.set('scaleBase', elem[1]);
        map.delete(elem[0]);
      }
    }
    this.backEndConf = Object.fromEntries(map.entries());
  }

  private createSubViews() {
    this.viewControl = new ViewControl(this.slider, this.conf);
    this.viewScale =
      new ViewScale(this.slider, this.track, this.conf);
    this.viewBar = new ViewBar(this.slider, this.conf);
  }

  private createListeners() {
    if (this.viewControl) {
      this.viewControl.subscribe(this.handleMoveEvent);
      this.viewControl.subscribe(this.handleKeydownEvent);
    }
  }

  private handleMoveEvent = (parms: IFireParms) => {
    if (parms.key !== 'MoveEvent') return;
    else {
      this.fire('MoveEvent', parms.data);
    }
  }

  private handleKeydownEvent = (parms: IFireParms) => {
    if (parms.key !== 'KeydownEvent') return;
    else {
      this.fire('KeydownEvent', parms.data);
    }
  }
}

export { View };

