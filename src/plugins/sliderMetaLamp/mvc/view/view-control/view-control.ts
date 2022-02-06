import { IConf, Idata } from '../../interface';
import { Observer } from '../../observer';

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
  public controlMin: HTMLElement;
  public controlMax: HTMLElement;
  public tipMin: HTMLInputElement;
  public tipMax: HTMLInputElement;
  public track: IElement;

  private conf: IConf;
  private slider: HTMLElement;
  //private root: HTMLInputElement;
  private root: IElement;
  private data: Idata;
  private initDone: boolean;

  constructor(sliderElem: HTMLElement, conf: IConf) {
    super();
    this.slider = sliderElem;
    this.root = sliderElem.previousElementSibling;
    this.track = sliderElem.firstElementChild;

    this.data = {};
    this.data.thumb = {};
    this.init(conf);
    this.dragControlMouse();
    this.dragControlTouch();
    this.pressControl();
    this.clickTrack();
  }

  //Обновляем позицию ползунка (вызывается через контроллер)
  public updatePos(elem: HTMLElement, newPos: number) {
    if (!this.initDone) {
      this.initDone = true;
    }

    if (this.conf.vertical) {
      elem.style.bottom = newPos + '%';
      elem.style.left = '';
    } else {
      elem.style.left = newPos + '%';
      elem.style.bottom = '';
    }
    //пересчитать ширину подсказок (возможно это надо вынести в отдельный метод)
    if (this.defineControl(elem) == 'min') {
      this.tipMin.style.left =
        this.calcTipPos(this.conf.vertical, this.tipMin);
    } else {
      this.tipMax.style.left =
        this.calcTipPos(this.conf.vertical, this.tipMax);
    }
  }

  //Обновляем значение tip
  public updateVal(val: string, isFrom: boolean) {
    isFrom ? this.tipMin.innerText = val : this.tipMax.innerText = val;
  }


  // передать значения FROM и TO в инпут
  public updateInput(conf: IConf) {

    if (this.root.tagName === 'INPUT') {
      this.root.value =
        this.conf.range ? conf.from + ', ' + conf.to :
          String(conf.from);
    }
  }

  //включение / отключение вертикального режима
  public switchVertical(conf: IConf) {
    this.conf = conf;
    if (this.conf.vertical) {
      this.controlMax.classList.add('rs-metalamp__control_vert');
      this.tipMax.classList.add('rs-metalamp__tip_vert');
      this.controlMin.classList.add('rs-metalamp__control_vert');
      this.tipMin.classList.add('rs-metalamp__tip_vert');
      this.controlMax.classList.remove('rs-metalamp__control_horizontal');
      this.tipMax.classList.remove('rs-metalamp__tip_horizontal');
      this.controlMin.classList.remove('rs-metalamp__control_horizontal');
      this.tipMin.classList.remove('rs-metalamp__tip_horizontal');
    } else {
      this.controlMax.classList.remove('rs-metalamp__control_vert');
      this.tipMax.classList.remove('rs-metalamp__tip_vert');
      this.controlMin.classList.remove('rs-metalamp__control_vert');
      this.tipMin.classList.remove('rs-metalamp__tip_vert');
      this.controlMax.classList.add('rs-metalamp__control_horizontal');
      this.tipMax.classList.add('rs-metalamp__tip_horizontal');
      this.controlMin.classList.add('rs-metalamp__control_horizontal');
      this.tipMin.classList.add('rs-metalamp__tip_horizontal');
    }
  }

  //включение / отключение single режима
  public switchRange(conf: IConf) {
    this.conf = conf;
    if (this.conf.range) {
      this.controlMax.classList.remove('rs-metalamp__control_hidden');
      if (this.conf.tip) {
        this.tipMax.classList.remove('rs-metalamp__tip_hidden');
      }
    } else {
      this.controlMax.classList.add('rs-metalamp__control_hidden');
      this.tipMax.classList.add('rs-metalamp__tip_hidden');
    }
  }

  //включение / отключение подсказок
  public switchTip(conf: IConf) {
    this.conf = conf;
    if (this.conf.tip) {
      this.tipMax.classList.remove('rs-metalamp__tip_hidden');
      this.tipMin.classList.remove('rs-metalamp__tip_hidden');
      if (this.initDone) {
        this.tipMax.style.left =
          this.calcTipPos(conf.vertical, this.tipMax);
        this.tipMin.style.left =
          this.calcTipPos(conf.vertical, this.tipMin);
      }
    } else {
      this.tipMax.classList.add('rs-metalamp__tip_hidden');
      this.tipMin.classList.add('rs-metalamp__tip_hidden');
    }
  }

  // Инициализация
  private init(conf: IConf) {
    this.conf = conf;
    this.renderLeftControl();
    this.renderRightControl();
    this.switchRange(this.conf);
    this.switchTip(this.conf);
  }

  private renderControl(
    controlClassName: string, tipClassName: string, value: number) {
    let control = document.createElement('button');
    control.className = 'rs-metalamp__control';
    control.classList.add(controlClassName);
    let tip = document.createElement('span');
    tip.className = 'rs-metalamp__tip';
    tip.classList.add(tipClassName);
    tip.innerText = String(value);
    control.append(tip);
    return control;
  }


  /*Создаем ползунок минимального значения*/
  private renderLeftControl() {
    this.controlMin = this.renderControl(
      'rs-metalamp__control-min', 'rs-metalamp__tip-min', this.conf.from);
    this.tipMin = this.controlMin.querySelector('.rs-metalamp__tip');
    this.track.append(this.controlMin);
  }

  /*Создаем ползунок максимального значения*/
  private renderRightControl() {
    this.controlMax = this.renderControl(
      'rs-metalamp__control-max', 'rs-metalamp__tip-max', this.conf.to);
    this.tipMax = this.controlMax.querySelector('.rs-metalamp__tip');
    this.track.append(this.controlMax);
  }

  private defineControl = (elem: ITarget) =>
    elem.classList.contains('rs-metalamp__control-min') ? 'min' : 'max';

  private getMetrics(elem: ITarget) {
    const scale = elem.parentElement;
    const T = this.data.thumb;
    T.top = scale.getBoundingClientRect().top;
    T.left = scale.getBoundingClientRect().left;
    T.width = scale.offsetWidth;
    T.height = scale.offsetHeight;
  }

  // Вешаем обработчики события нажатия мышью на ползунке (захвата ползунка) и перемещения ползунка 
  private dragControlMouse() {
    let pointerDownHandler = (e: PointerEvent) => {
      e.preventDefault();
      const target = e.target;// as HTMLElement;
      if (!(target instanceof HTMLElement)) {
        throw new Error('Cannot handle move outside of DOM');
      }
      if (target.classList.contains('rs-metalamp__control')) {
        target.classList.add('rs-metalamp__control_grabbing');
      }
      const T = this.data.thumb;
      if (target.classList.contains('rs-metalamp__control')) {

        //определяем ползунок, за который тянут
        T.moovingControl = this.defineControl(target);
        //определяем расстояние между позицией клика и левым краем ползунка
        if (!this.conf.vertical) {
          T.shiftBase = e.clientX -
            target.getBoundingClientRect().left;
        }
        this.getMetrics(target);

        const pointerMoveHandler = (e: PointerEvent) => {
          T.type = e.type;
          T.clientX = e.clientX;
          T.clientY = e.clientY;
          this.fire('MoveEvent', this.data);
        };

        const pointerUpHandler = () => {
          target.classList.remove('rs-metalamp__control_grabbing');
          target.
            removeEventListener('pointermove', pointerMoveHandler);
          target.
            removeEventListener('pointerup', pointerUpHandler);
        };
        /*elem.setPointerCapture(pointerId) – привязывает события с данным pointerId к elem. 
        После такого вызова все события указателя с таким pointerId будут иметь elem в качестве целевого элемента 
        (как будто произошли над elem), вне зависимости от того, где в документе они произошли.*/
        target.setPointerCapture(e.pointerId);
        target.addEventListener('pointermove', pointerMoveHandler);
        target.addEventListener('pointerup', pointerUpHandler);
      }
    };

    this.slider.addEventListener('pointerdown', pointerDownHandler);
    this.slider.addEventListener('dragstart', () => false);
    this.slider.addEventListener('selectstart', () => false);
  }

  // Вешаем обработчики события нажатия пальцем на ползунке и перемещения ползунка
  private dragControlTouch() {
    let pointerDownHandler = (e: TouchEvent) => {
      e.preventDefault();
      const target = e.target;// as HTMLElement;
      if (!(target instanceof HTMLElement)) {
        throw new Error('Cannot handle move outside of DOM');
      }
      const T = this.data.thumb;
      if (target.classList.contains('rs-metalamp__control')) {

        //определяем ползунок, за который тянут
        T.moovingControl = this.defineControl(target);
        this.getMetrics(target);

        const pointerMoveHandler = (e: TouchEvent) => {
          T.type = e.type;
          T.clientX =
            e.targetTouches[0] ? e.targetTouches[0].clientX : 0;
          T.clientY =
            e.targetTouches[0] ? e.targetTouches[0].clientY : 0;
          this.fire('MoveEvent', this.data);
        };
        target.addEventListener('touchmove', pointerMoveHandler);
      }
    };
    this.slider.addEventListener('touchstart', pointerDownHandler);
  }

  // Вешаем обработчик нажатия стрелок на сфокусированном ползунке
  private pressControl() {
    let pointerDownHandler = (e: KeyboardEvent) => {
      let arr = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp'];
      const result = arr.indexOf(e.code);
      if (result != -1) {
        e.preventDefault();
        const target = e.target;// as HTMLElement;
        if (!(target instanceof HTMLElement)) {
          throw new Error('Cannot handle move outside of DOM');
        }
        const T = this.data.thumb;

        if (target.classList.contains('rs-metalamp__control')) {

          //определяем ползунок, на который нажимают
          target.classList.contains('rs-metalamp__control-min') ?
            T.moovingControl = 'min' :
            T.moovingControl = 'max';
          T.key = e.code;
          T.repeat = e.repeat;
          this.fire('KeydownEvent', this.data);
        }
      }
    };
    this.slider.addEventListener('keydown', pointerDownHandler);
  }
  // Обработчик клика по шкале
  private clickTrack() {
    let pointerDownHandler = (e: PointerEvent) => {
      e.preventDefault();
      const target = e.target;// as HTMLElement;
      if (!(target instanceof HTMLElement)) {
        throw new Error('Cannot handle move outside of DOM');
      }
      const T = this.data.thumb;

      let arr =
        ['rs-metalamp__track',
          'rs-metalamp__progressBar',
          'rs-metalamp__label',
          'rs-metalamp__mark',
          'rs-metalamp__frame'];
      const result = [...target.classList].some(className =>
        arr.indexOf(className) !== -1);
      if (result) {
        let controlMinDist = 0;
        let controlMaxDist = 0;
        //определяем расстояние от места клика до каждого из бегунков
        if (this.conf.vertical) {
          controlMinDist =
            Math.abs(this.controlMin.getBoundingClientRect().
              bottom - e.clientY);
          controlMaxDist = Math.abs(this.controlMax.
            getBoundingClientRect().bottom - e.clientY);
        } else {
          controlMinDist =
            Math.abs(this.controlMin.getBoundingClientRect().left -
              e.clientX);
          controlMaxDist =
            Math.abs(this.controlMax.
              getBoundingClientRect().left -
              e.clientX);
        }

        T.top = this.track.getBoundingClientRect().top;
        T.left =
          this.track.getBoundingClientRect().left;
        T.width = this.track.offsetWidth;
        T.height = this.track.offsetHeight;
        T.type = e.type;
        T.clientX = e.clientX;
        T.clientY = e.clientY;

        //определяем ползунок, находящийся ближе к позиции клика
        if (this.controlMax.classList.contains('hidden')) {//Single mode
          T.moovingControl = 'min';
        }

        else {//Double mode
          controlMinDist <= controlMaxDist ?
            T.moovingControl = 'min' :
            T.moovingControl = 'max';
        }
        this.fire('MoveEvent', this.data);
      }
    };
    this.slider.addEventListener('pointerdown', pointerDownHandler);
  }

  private calcTipPos(isVertical: boolean, elem: HTMLElement) {
    if (isVertical)
      return elem.offsetWidth * (-1) - 5 + 'px';
    else return elem.offsetWidth / 2 * (-1) + 'px';
  }


}

export { ViewControl };












