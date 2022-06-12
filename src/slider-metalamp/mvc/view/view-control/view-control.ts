import { IConfFull, IdataFull } from '../../interface';
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
    this.dragControlMouse();
    this.dragControlTouch();
    this.pressControl();
    this.clickTrack();
  }

  private render() {
    this.root = this.slider.previousElementSibling as Element;
    this.track = this.slider.firstElementChild as Element;

    /* Создаем ползунок минимального значения */
    this.controlMin = ViewControl.renderControl('slider-metalamp__control-min', 'slider-metalamp__tip-min', this.conf.from);
    this.tipMin = ViewControl.getElement(this.controlMin, '.slider-metalamp__tip') as HTMLInputElement;
    this.track.append(this.controlMin);

    /* Создаем ползунок максимального значения */
    this.controlMax = ViewControl.renderControl('slider-metalamp__control-max', 'slider-metalamp__tip-max', this.conf.to);
    this.tipMax = ViewControl.getElement(this.controlMax, '.slider-metalamp__tip') as HTMLInputElement;
    this.track.append(this.controlMax);
  }

  // Обновляем позицию ползунка (вызывается через контроллер)
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
    // пересчитать ширину подсказок
    if (!this.tipMin || !this.tipMax) return false;
    if (this.defineControl(elem) === 'min') {
      this.tipMin.style.left = ViewControl.calcTipPos(this.conf.vertical, this.tipMin);
    } else {
      this.tipMax.style.left = ViewControl.calcTipPos(this.conf.vertical, this.tipMax);
    }
    return true;
  }

  // Обновляем значение tip
  public updateVal(value: string, isFrom: boolean) {
    if (!this.tipMin || !this.tipMax) return false;
    if (isFrom) { this.tipMin.innerText = value; } else { this.tipMax.innerText = value; }
    return true;
  }

  // передать значения FROM и TO в инпут
  public updateInput(conf: IConfFull) {
    if (this.root && this.root.tagName === 'INPUT') {
      this.root.value = this.conf.range ? `${conf.from}, ${conf.to}`
        : String(conf.from);
    }
  }

  // включение / отключение вертикального режима
  public switchVertical(conf: IConfFull) {
    this.conf = conf;
  }

  // включение / отключение подсказок
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

  // Инициализация
  private init(conf: IConfFull) {
    this.conf = conf;
  }

  private defineControl = (elem: ITarget) => {
    if (elem.classList) { return elem.classList.contains('slider-metalamp__control-min') ? 'min' : 'max'; }
    return true;
  }

  private getMetrics(elem: ITarget) {
    const scale = elem.parentElement as HTMLElement;
    const { thumb } = this.data;
    thumb.top = scale.getBoundingClientRect().top;
    thumb.left = scale.getBoundingClientRect().left;
    thumb.width = scale.offsetWidth;
    thumb.height = scale.offsetHeight;
  }

  // Вешаем обработчики события нажатия мышью на ползунке (захвата ползунка) и перемещения ползунка
  private dragControlMouse() {
    const handlePointerStart = (e: PointerEvent) => {
      e.preventDefault();
      const { target } = e;// as HTMLElement;
      if (!(target instanceof HTMLElement)) {
        throw new Error('Cannot handle move outside of DOM');
      }
      if (target.classList.contains('slider-metalamp__control')) {
        target.classList.add('slider-metalamp__control_grabbing');
      }
      const { thumb } = this.data;
      if (target.classList.contains('slider-metalamp__control')) {
        // определяем ползунок, за который тянут
        thumb.moovingControl = String(this.defineControl(target));
        // определяем расстояние между позицией клика и левым краем ползунка
        if (!this.conf.vertical) {
          thumb.shiftBase = e.clientX
            - target.getBoundingClientRect().left;
        }
        this.getMetrics(target);

        const handlePointerMove = (event: PointerEvent) => {
          thumb.type = event.type;
          thumb.clientX = event.clientX;
          thumb.clientY = event.clientY;
          this.fire('MoveEvent', this.data);
        };

        const handlePointerUp = () => {
          target.classList.remove('slider-metalamp__control_grabbing');
          target
            .removeEventListener('pointermove', handlePointerMove);
          target
            .removeEventListener('pointerup', handlePointerUp);
        };
        /* elem.setPointerCapture(pointerId) – привязывает события с данным pointerId к elem.
        После такого вызова все события указателя с таким pointerId будут иметь elem в
        качестве целевого элемента (как будто произошли над elem), вне зависимости от того,
        где в документе они произошли. */
        target.setPointerCapture(e.pointerId);
        target.addEventListener('pointermove', handlePointerMove);
        target.addEventListener('pointerup', handlePointerUp);
      }
    };
    const handleDragSelectStart = () => false;

    this.slider.addEventListener('pointerdown', handlePointerStart);
    this.slider.addEventListener('dragstart', handleDragSelectStart);
    this.slider.addEventListener('selectstart', handleDragSelectStart);
  }

  // Вешаем обработчики события нажатия пальцем на ползунке и перемещения ползунка
  private dragControlTouch() {
    const handlePointerStart = (e: TouchEvent) => {
      e.preventDefault();
      const { target } = e;
      if (!(target instanceof HTMLElement)) {
        throw new Error('Cannot handle move outside of DOM');
      }
      const { thumb } = this.data;
      if (target.classList.contains('slider-metalamp__control')) {
        // определяем ползунок, за который тянут
        thumb.moovingControl = String(this.defineControl(target));
        this.getMetrics(target);

        const handlePointerMove = (event: TouchEvent) => {
          thumb.type = event.type;
          thumb.clientX = event.targetTouches[0] ? event.targetTouches[0].clientX : 0;
          thumb.clientY = event.targetTouches[0] ? event.targetTouches[0].clientY : 0;
          this.fire('MoveEvent', this.data);
        };
        target.addEventListener('touchmove', handlePointerMove);
      }
    };
    this.slider.addEventListener('touchstart', handlePointerStart);
  }

  // Вешаем обработчик нажатия стрелок на сфокусированном ползунке
  private pressControl() {
    const handlePointerStart = (e: KeyboardEvent) => {
      const directions = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp'];
      const result = directions.indexOf(e.code);
      if (result !== -1) {
        e.preventDefault();
        const { target } = e;
        if (!(target instanceof HTMLElement)) {
          throw new Error('Cannot handle move outside of DOM');
        }
        const T = this.data.thumb;

        if (target.classList.contains('slider-metalamp__control')) {
          // определяем ползунок, на который нажимают
          T.moovingControl = target.classList.contains('slider-metalamp__control-min') ? 'min' : 'max';

          T.key = e.code;
          T.repeat = e.repeat;
          this.fire('KeydownEvent', this.data);
        }
      }
    };
    this.slider.addEventListener('keydown', handlePointerStart);
  }

  // Обработчик клика по шкале
  private clickTrack() {
    const handlePointerStart = (e: PointerEvent) => {
      e.preventDefault();
      const { target } = e;
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
        // определяем расстояние от места клика до каждого из бегунков
        if (this.controlMin && this.controlMax) {
          if (this.conf.vertical) {
            controlMinDist = Math.abs(this.controlMin.getBoundingClientRect()
              .bottom - e.clientY);
            controlMaxDist = Math.abs(this.controlMax
              .getBoundingClientRect().bottom - e.clientY);
          } else {
            controlMinDist = Math.abs(this.controlMin.getBoundingClientRect().left
              - e.clientX);
            controlMaxDist = Math.abs(this.controlMax
              .getBoundingClientRect().left
              - e.clientX);
          }
        }
        if (this.track) {
          thumb.top = this.track.getBoundingClientRect().top;
          thumb.left = this.track.getBoundingClientRect().left;
          thumb.width = Number(this.track.offsetWidth);
          thumb.height = Number(this.track.offsetHeight);
          thumb.type = e.type;
          thumb.clientX = e.clientX;
          thumb.clientY = e.clientY;
        }

        // определяем ползунок, находящийся ближе к позиции клика
        if (this.controlMax && this.controlMax.classList.contains('hidden')) { // Single mode
          thumb.moovingControl = 'min';
        } else { // Double mode
          thumb.moovingControl = controlMinDist <= controlMaxDist ? 'min' : 'max';
        }
        this.fire('MoveEvent', this.data);
      }
    };
    this.slider.addEventListener('pointerdown', handlePointerStart);
  }
}

export default ViewControl;
