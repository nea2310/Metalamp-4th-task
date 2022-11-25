import { IConfFull, IdataFull, TDirections } from '../../interface';
import Observer from '../../observer';
import { defaultData, defaultThumb } from '../../utils';

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

  public tipMin: HTMLInputElement | undefined;

  public tipMax: HTMLInputElement | undefined;

  public track: IElement | undefined;

  private conf: IConfFull;

  private slider: HTMLElement;

  private root: IElement | undefined;

  private data: IdataFull;

  private initDone: boolean = false;

  constructor(sliderElement: HTMLElement, conf: IConfFull) {
    super();
    this.slider = sliderElement;

    this.data = {
      ...defaultData,
      thumb: { ...defaultThumb },
    };

    this.conf = conf;

    this.render();
    this.init(conf);
    this.dragControl();
    this.pressControl();
    this.clickTrack();
  }

  private render() {
    this.root = this.slider.previousElementSibling as Element;
    this.track = this.slider.firstElementChild as Element;

    this.controlMin = ViewControl.renderControl('slider-metalamp__control-min', 'slider-metalamp__tip-min', this.conf.from);
    this.tipMin = ViewControl.getElement(this.controlMin, '.slider-metalamp__tip') as HTMLInputElement;
    this.track.append(this.controlMin);

    this.controlMax = ViewControl.renderControl('slider-metalamp__control-max', 'slider-metalamp__tip-max', this.conf.to);
    this.tipMax = ViewControl.getElement(this.controlMax, '.slider-metalamp__tip') as HTMLInputElement;
    this.track.append(this.controlMax);
  }

  public updatePos(element: HTMLElement, newPosition: number) {
    const elem = element;
    if (!this.initDone) {
      this.initDone = true;
    }

    if (this.conf.vertical) {
      elem.style.bottom = `${newPosition}%`;
      elem.style.left = '';
    } else {
      elem.style.left = `${newPosition}%`;
      elem.style.bottom = '';
    }

    if (!this.tipMin || !this.tipMax) return false;
    if (this.defineControl(elem) === 'min') {
      this.tipMin.style.left = ViewControl.calcTipPos(this.conf.vertical, this.tipMin);
    } else {
      this.tipMax.style.left = ViewControl.calcTipPos(this.conf.vertical, this.tipMax);
    }
    return true;
  }

  public updateVal(value: string, isFrom: boolean) {
    if (!this.tipMin || !this.tipMax) return false;
    if (isFrom) { this.tipMin.innerText = value; } else { this.tipMax.innerText = value; }
    return true;
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

  static calcTipPos(isVertical: boolean, elem: HTMLElement) {
    if (isVertical) { return `${elem.offsetWidth * (-1) - 5}px`; }
    return `${(elem.offsetWidth / 2) * (-1)}px`;
  }

  static getElement(object: HTMLElement, selector: string) {
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

  private init(conf: IConfFull) {
    this.conf = conf;
  }

  private defineControl = (elem: ITarget): 'min' | 'max' | false => {
    if (!elem.classList) return false;

    return elem.classList.contains('slider-metalamp__control-min') ? 'min' : 'max';
  };

  private getMetrics(elem: ITarget) {
    const scale = elem.parentElement as HTMLElement;
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
      if (target.classList.contains('slider-metalamp__control')) {
        const moovingControl = this.defineControl(target);
        if (typeof moovingControl === 'string') {
          thumb.moovingControl = moovingControl;
        }

        if (!this.conf.vertical) {
          thumb.shiftBase = event.clientX
            - target.getBoundingClientRect().left;
        }
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
      const directions = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp'];
      const result = directions.indexOf(event.code);
      if (result !== -1) {
        event.preventDefault();
        const { target } = event;
        if (!(target instanceof HTMLElement)) {
          throw new Error('Cannot handle move outside of DOM');
        }
        const { thumb } = this.data;

        if (target.classList.contains('slider-metalamp__control')) {
          thumb.moovingControl = target.classList.contains('slider-metalamp__control-min') ? 'min' : 'max';

          thumb.direction = event.code as TDirections;
          thumb.repeat = event.repeat;
          this.notify('KeydownEvent', this.data);
        }
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
        'slider-metalamp__progressBar',
        'slider-metalamp__label',
        'slider-metalamp__mark',
        'slider-metalamp__frame'];
      const result = [...target.classList].some((className) => array.indexOf(className) !== -1);
      if (result) {
        let controlMinDist = 0;
        let controlMaxDist = 0;

        if (this.controlMin && this.controlMax) {
          if (this.conf.vertical) {
            controlMinDist = Math.abs(this.controlMin.getBoundingClientRect()
              .bottom - event.clientY);
            controlMaxDist = Math.abs(this.controlMax
              .getBoundingClientRect().bottom - event.clientY);
          } else {
            controlMinDist = Math.abs(this.controlMin.getBoundingClientRect().left
              - event.clientX);
            controlMaxDist = Math.abs(this.controlMax
              .getBoundingClientRect().left
              - event.clientX);
          }
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
      }
    };
    this.slider.addEventListener('pointerdown', handlePointerStart);
  }
}

export default ViewControl;
