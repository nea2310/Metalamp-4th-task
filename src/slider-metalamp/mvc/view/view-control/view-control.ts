import { defaultData, defaultThumb } from '../../utils';
import Observer from '../../observer';
import {
  IConfFull,
  IdataFull,
  TDirections,
  TDirectionsCortege,
} from '../../interface';

interface IElement extends Element {
  value?: string;
  readonly offsetHeight?: number;
  readonly offsetWidth?: number;
  clickOutsideEvent?(): void;
}

interface ITarget extends Omit<EventTarget, 'addEventListener'> {
  readonly classList?: DOMTokenList;
  readonly parentElement?: HTMLElement | null;
}

class ViewControl extends Observer {
  public controlMin: HTMLElement | undefined;

  public controlMax: HTMLElement | undefined;

  public tipMin: HTMLInputElement | null = null;

  public tipMax: HTMLInputElement | null = null;

  public track: IElement | null = null;

  private conf: IConfFull;

  private slider: HTMLElement;

  private root: IElement | null = null;

  private data: IdataFull = {
    ...defaultData,
    thumb: { ...defaultThumb },
  };

  private initDone: boolean = false;

  constructor(sliderElement: HTMLElement, conf: IConfFull) {
    super();
    this.slider = sliderElement;
    this.conf = conf;
    this.render();
    this.init(conf);
    this.dragControl();
    this.pressControl();
    this.clickTrack();
  }

  static calcTipPos(isVertical: boolean, elem: HTMLElement) {
    if (isVertical) { return `${elem.offsetWidth * (-1) - 20}px`; }
    return `${(elem.offsetWidth / 2) * (-1)}px`;
  }

  static getElement(object: HTMLElement, selector: string): HTMLInputElement | null {
    return object.querySelector(selector);
  }

  static renderControl(controlClassName: string, tipClassName: string, value: number) {
    const control = document.createElement('button');
    control.className = 'slider-metalamp__control';
    control.classList.add(controlClassName);
    const tip = document.createElement('span');
    tip.className = 'slider-metalamp__tip';
    tip.classList.add(tipClassName);
    tip.innerText = String(value);
    control.append(tip);
    return control;
  }

  public updatePos(element: HTMLElement, newPosition: number) {
    const elem = element;
    if (!this.initDone) {
      this.initDone = true;
    }

    const propertyToSet = this.conf.vertical ? 'bottom' : 'left';
    const propertyToUnset = this.conf.vertical ? 'left' : 'bottom';
    elem.style[propertyToSet] = `${newPosition}%`;
    elem.style[propertyToUnset] = '';

    if (!this.tipMin || !this.tipMax) {
      return;
    }

    const tip = this.defineControl(elem) === 'min' ? this.tipMin : this.tipMax;
    tip.style.left = ViewControl.calcTipPos(this.conf.vertical, tip);
  }

  public updateVal(value: string, isFrom: boolean) {
    if (!this.tipMin || !this.tipMax) {
      return;
    }
    const tip = isFrom ? this.tipMin : this.tipMax;
    tip.innerText = value;
  }

  public updateInput(conf: IConfFull) {
    if (this.root && this.root.tagName === 'INPUT') {
      this.root.value = this.conf.range ? `${conf.from}, ${conf.to}`
        : String(conf.from);
    }
  }

  public switchVertical(conf: IConfFull) {
    this.conf = conf;
  }

  public switchTip(conf: IConfFull) {
    if (this.tipMax && this.tipMin) {
      if (this.initDone) {
        this.tipMax.style.left = ViewControl.calcTipPos(conf.vertical, this.tipMax);
        this.tipMin.style.left = ViewControl.calcTipPos(conf.vertical, this.tipMin);
      }
    }
  }

  private render() {
    this.root = this.slider.previousElementSibling;
    this.track = this.slider.firstElementChild;
    if (!this.track) {
      return;
    }

    this.controlMin = ViewControl.renderControl('slider-metalamp__control-min', 'slider-metalamp__tip-min', this.conf.from);
    this.tipMin = ViewControl.getElement(this.controlMin, '.slider-metalamp__tip');
    this.track.append(this.controlMin);

    this.controlMax = ViewControl.renderControl('slider-metalamp__control-max', 'slider-metalamp__tip-max', this.conf.to);
    this.tipMax = ViewControl.getElement(this.controlMax, '.slider-metalamp__tip');
    this.track.append(this.controlMax);
  }

  private init(conf: IConfFull) {
    this.conf = conf;
  }

  private defineControl = (elem: ITarget): 'min' | 'max' | null => {
    if (!elem.classList) {
      return null;
    }
    return elem.classList.contains('slider-metalamp__control-min') ? 'min' : 'max';
  };

  private getMetrics(elem: ITarget) {
    const scale = elem.parentElement;
    if (!scale) {
      return;
    }
    const { thumb } = this.data;
    thumb.top = scale.getBoundingClientRect().top;
    thumb.left = scale.getBoundingClientRect().left;
    thumb.width = scale.offsetWidth;
    thumb.height = scale.offsetHeight;
  }

  private dragControl() {
    const handlePointerStart = (event: PointerEvent) => {
      event.preventDefault();
      const { target } = event;
      if (!(target instanceof HTMLElement)) {
        throw new Error('Cannot handle move outside of DOM');
      }
      if (target.classList.contains('slider-metalamp__control')) {
        target.classList.add('slider-metalamp__control_grabbing');
      }
      const { thumb } = this.data;
      const moovingControl = this.defineControl(target);
      if (target.classList.contains('slider-metalamp__control') && moovingControl) {
        thumb.moovingControl = moovingControl;

        thumb.shiftBase = this.conf.vertical ? 0
          : event.clientX - target.getBoundingClientRect().left;
        this.getMetrics(target);

        const handlePointerMove = (innerEvent: PointerEvent) => {
          thumb.type = 'pointermove';
          thumb.clientX = innerEvent.clientX;
          thumb.clientY = innerEvent.clientY;
          this.notify('MoveEvent', this.data);
        };

        const handlePointerUp = () => {
          target.classList.remove('slider-metalamp__control_grabbing');
          target
            .removeEventListener('pointermove', handlePointerMove);
          target
            .removeEventListener('pointerup', handlePointerUp);
        };

        target.setPointerCapture(event.pointerId);
        target.addEventListener('pointermove', handlePointerMove);
        target.addEventListener('pointerup', handlePointerUp);
      }
    };
    const handleDragSelectStart = () => false;

    this.slider.addEventListener('pointerdown', handlePointerStart);
    this.slider.addEventListener('dragstart', handleDragSelectStart);
    this.slider.addEventListener('selectstart', handleDragSelectStart);
  }

  private pressControl() {
    const handlePointerStart = (event: KeyboardEvent) => {
      const directions: TDirectionsCortege = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp'];
      if ((event.code in directions)) {
        event.preventDefault();
      }
      const { target } = event;
      if (!(target instanceof HTMLElement)) {
        throw new Error('Cannot handle move outside of DOM');
      }
      const { thumb } = this.data;
      const direction: TDirections | undefined = directions.find(
        (element) => element === event.code,
      );
      if (!direction) {
        return;
      }

      if (target.classList.contains('slider-metalamp__control')) {
        thumb.moovingControl = target.classList.contains('slider-metalamp__control-min') ? 'min' : 'max';
        thumb.direction = direction;
        thumb.repeat = event.repeat;
        this.notify('KeydownEvent', this.data);
      }
    };
    this.slider.addEventListener('keydown', handlePointerStart);
  }

  private clickTrack() {
    const handlePointerStart = (event: PointerEvent) => {
      event.preventDefault();
      const { target } = event;
      if (!(target instanceof HTMLElement)) {
        throw new Error('Cannot handle move outside of DOM');
      }
      const { thumb } = this.data;

      const array = ['slider-metalamp__track',
        'slider-metalamp__progress-bar',
        'slider-metalamp__label',
        'slider-metalamp__mark',
        'slider-metalamp__frame'];
      const result = [...target.classList].some((className) => array.indexOf(className) !== -1);
      if (!result) {
        return;
      }
      let controlMinDist = 0;
      let controlMaxDist = 0;
      const property = this.conf.vertical ? 'bottom' : 'left';
      const parameter = this.conf.vertical ? 'clientY' : 'clientX';

      if (this.controlMin && this.controlMax) {
        controlMinDist = Math.abs(this.controlMin
          .getBoundingClientRect()[property] - event[parameter]);
        controlMaxDist = Math.abs(this.controlMax
          .getBoundingClientRect()[property] - event[parameter]);
      }

      if (this.track) {
        thumb.top = this.track.getBoundingClientRect().top;
        thumb.left = this.track.getBoundingClientRect().left;
        thumb.width = Number(this.track.offsetWidth);
        thumb.height = Number(this.track.offsetHeight);
        thumb.type = 'pointerdown';
        thumb.clientX = event.clientX;
        thumb.clientY = event.clientY;
      }

      if (this.controlMax && this.controlMax.classList.contains('hidden')) {
        thumb.moovingControl = 'min';
      } else {
        thumb.moovingControl = controlMinDist <= controlMaxDist ? 'min' : 'max';
      }
      this.notify('MoveEvent', this.data);
    };
    this.slider.addEventListener('pointerdown', handlePointerStart);
  }
}

export default ViewControl;
