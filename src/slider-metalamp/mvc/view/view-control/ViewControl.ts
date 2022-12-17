import { defaultData, defaultControl } from '../../utils';
import Observer from '../../Observer';
import {
  IPluginConfigurationFull,
  IPluginPrivateData,
  TControlKeydownTypes,
  IDOMElement,
} from '../../interface';

interface ITarget extends Omit<EventTarget, 'addEventListener'> {
  readonly classList?: DOMTokenList;
  readonly parentElement?: HTMLElement | null;
}

class ViewControl extends Observer {
  public controlMin: HTMLElement | undefined;

  public controlMax: HTMLElement | undefined;

  public tipMin: HTMLInputElement | null = null;

  public tipMax: HTMLInputElement | null = null;

  public track: IDOMElement | null = null;

  private conf: IPluginConfigurationFull;

  private control: HTMLElement;

  private root: IDOMElement | null = null;

  private data: IPluginPrivateData = {
    ...defaultData,
    control: { ...defaultControl },
  };

  private initDone: boolean = false;

  constructor(controlElement: HTMLElement, conf: IPluginConfigurationFull) {
    super();
    this.control = controlElement;
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

  public updateInput(conf: IPluginConfigurationFull) {
    if (this.root && this.root.tagName === 'INPUT') {
      this.root.value = this.conf.range ? `${conf.from}, ${conf.to}`
        : String(conf.from);
    }
  }

  public switchVertical(conf: IPluginConfigurationFull) {
    this.conf = conf;
  }

  public switchTip(conf: IPluginConfigurationFull) {
    if (this.tipMax && this.tipMin) {
      if (this.initDone) {
        this.tipMax.style.left = ViewControl.calcTipPos(conf.vertical, this.tipMax);
        this.tipMin.style.left = ViewControl.calcTipPos(conf.vertical, this.tipMin);
      }
    }
  }

  private render() {
    this.root = this.control.previousElementSibling;
    this.track = this.control.firstElementChild;
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

  private init(conf: IPluginConfigurationFull) {
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
    const { control } = this.data;
    control.top = scale.getBoundingClientRect().top;
    control.left = scale.getBoundingClientRect().left;
    control.width = scale.offsetWidth;
    control.height = scale.offsetHeight;
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
      const { control } = this.data;
      const movingControl = this.defineControl(target);
      if (target.classList.contains('slider-metalamp__control') && movingControl) {
        control.movingControl = movingControl;

        control.shiftBase = this.conf.vertical ? 0
          : event.clientX - target.getBoundingClientRect().left;
        this.getMetrics(target);

        const handlePointerMove = (innerEvent: PointerEvent) => {
          control.type = 'pointermove';
          control.clientX = innerEvent.clientX;
          control.clientY = innerEvent.clientY;
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

    this.control.addEventListener('pointerdown', handlePointerStart);
    this.control.addEventListener('dragstart', handleDragSelectStart);
    this.control.addEventListener('selectstart', handleDragSelectStart);
  }

  private pressControl() {
    const handlePointerStart = (event: KeyboardEvent) => {
      const directions: Array<TControlKeydownTypes> = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp'];
      if ((event.code in directions)) {
        event.preventDefault();
      }
      const { target } = event;
      if (!(target instanceof HTMLElement)) {
        throw new Error('Cannot handle move outside of DOM');
      }
      const { control } = this.data;
      const direction: TControlKeydownTypes | undefined = directions.find(
        (element) => element === event.code,
      );
      if (!direction) {
        return;
      }

      if (target.classList.contains('slider-metalamp__control')) {
        control.movingControl = target.classList.contains('slider-metalamp__control-min') ? 'min' : 'max';
        control.direction = direction;
        control.repeat = event.repeat;
        this.notify('KeydownEvent', this.data);
      }
    };
    this.control.addEventListener('keydown', handlePointerStart);
  }

  private clickTrack() {
    const handlePointerStart = (event: PointerEvent) => {
      event.preventDefault();
      const { target } = event;
      if (!(target instanceof HTMLElement)) {
        throw new Error('Cannot handle move outside of DOM');
      }
      const { control } = this.data;

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
        control.top = this.track.getBoundingClientRect().top;
        control.left = this.track.getBoundingClientRect().left;
        control.width = Number(this.track.offsetWidth);
        control.height = Number(this.track.offsetHeight);
        control.type = 'pointerdown';
        control.clientX = event.clientX;
        control.clientY = event.clientY;
      }

      if (this.controlMax && this.controlMax.classList.contains('hidden')) {
        control.movingControl = 'min';
      } else {
        control.movingControl = controlMinDist <= controlMaxDist ? 'min' : 'max';
      }
      this.notify('MoveEvent', this.data);
    };
    this.control.addEventListener('pointerdown', handlePointerStart);
  }
}

export default ViewControl;
