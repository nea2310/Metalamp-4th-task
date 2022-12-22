import { defaultData, defaultControl } from '../../utils';
import Observer from '../../Observer';
import {
  IPluginConfigurationFull,
  IPluginPrivateData,
  TControlKeydownTypes,
  IDOMElement,
  TControlStopTypes,
  IPluginConfigurationItem,
  IControlStateData,
  IControlFull,
} from '../../interface';

interface ITarget extends Omit<EventTarget, 'addEventListener'> {
  readonly classList?: DOMTokenList;
  readonly parentElement?: HTMLElement | null;
}

class ViewControl extends Observer {
  public fromPosition = 0;

  public toPosition = 0;

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

  private changeMode = false;

  private scaleMarks: IPluginConfigurationItem[];

  constructor(
    controlElement: HTMLElement,
    conf: IPluginConfigurationFull,
    scaleMarks: IPluginConfigurationItem[],
  ) {
    super();
    this.control = controlElement;
    this.conf = conf;
    this.scaleMarks = scaleMarks;
    this.render();
    this.init(conf);
    this.dragControl();
    this.pressControl();
    this.clickTrack();

    this.calcFromPosition();
    this.calcToPosition();
  }

  static calcTipPos(isVertical: boolean, elem: HTMLElement) {
    if (isVertical) return `${elem.offsetWidth * (-1) - 20}px`;
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
    if (!this.initDone) this.initDone = true;

    const propertyToSet = this.conf.vertical ? 'bottom' : 'left';
    const propertyToUnset = this.conf.vertical ? 'left' : 'bottom';
    elem.style[propertyToSet] = `${newPosition}%`;
    elem.style[propertyToUnset] = '';

    if (!this.tipMin || !this.tipMax) return;

    const tip = this.defineControl(elem) === 'min' ? this.tipMin : this.tipMax;
    tip.style.left = ViewControl.calcTipPos(this.conf.vertical, tip);
  }

  public updateVal(value: string, isFrom: boolean) {
    if (!this.tipMin || !this.tipMax) return;
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
    if (!this.tipMax || !this.tipMin) return;
    if (this.initDone) {
      this.tipMax.style.left = ViewControl.calcTipPos(conf.vertical, this.tipMax);
      this.tipMin.style.left = ViewControl.calcTipPos(conf.vertical, this.tipMin);
    }
  }

  private render() {
    this.root = this.control.previousElementSibling;
    this.track = this.control.firstElementChild;
    if (!this.track) return;

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
    if (!elem.classList) return null;
    return elem.classList.contains('slider-metalamp__control-min') ? 'min' : 'max';
  };

  private getMetrics(elem: ITarget) {
    const scale = elem.parentElement;
    if (!scale) return;
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
          this.calcPositionSetByPointer(control);
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

  public calcPositionSetByPointer(data: IControlStateData) {
    const {
      type,
      clientY,
      clientX,
      top,
      left,
      width,
      height,
      shiftBase,
      movingControl,
    } = data;

    let newPosition = 0;
    if (this.conf.vertical) newPosition = 100 - (((clientY - top) * 100) / height);
    else {
      const shift = (type === 'pointermove') ? (shiftBase * 100) / width : 0;
      newPosition = (((clientX - left) * 100) / width) - shift;
    }

    if (this.conf.sticky) newPosition = this.setSticky(newPosition);

    const updatePosition = (needChange = false, stopType: TControlStopTypes = 'min') => {
      this.calcValue(stopType, 0, movingControl);
      if (needChange) console.log('');
    };

    if (newPosition < 0) {
      updatePosition(true);
      return newPosition;
    }

    if (newPosition > 100) {
      updatePosition(true, 'max');
      return newPosition;
    }
    const isMinControl = movingControl === 'min';
    const isBeyondToPosition = this.conf.range && isMinControl
      && newPosition > this.toPosition;
    if (isBeyondToPosition) {
      updatePosition(false, 'meetMax');
      return newPosition;
    }

    const isBelowFromPosition = this.conf.range && !isMinControl
      && newPosition < this.fromPosition;
    if (isBelowFromPosition) {
      updatePosition(false, 'meetMin');
      return newPosition;
    }

    const controlType = isMinControl ? this.controlMin : this.controlMax;
    if (controlType) this.updatePos(controlType, newPosition);
    this.calcValue('normal', newPosition, movingControl);
    return newPosition;
  }

  private pressControl() {
    const handlePointerStart = (event: KeyboardEvent) => {
      const directions: Array<TControlKeydownTypes> = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp'];
      if ((event.code in directions)) event.preventDefault();
      const { target } = event;
      if (!(target instanceof HTMLElement)) {
        throw new Error('Cannot handle move outside of DOM');
      }
      const { control } = this.data;
      const direction: TControlKeydownTypes | undefined = directions.find(
        (element) => element === event.code,
      );
      if (!direction) return;

      if (target.classList.contains('slider-metalamp__control')) {
        control.movingControl = target.classList.contains('slider-metalamp__control-min') ? 'min' : 'max';
        control.direction = direction;
        control.repeat = event.repeat;
        this.calcPositionSetByKey(control);
        // this.notify('KeydownEvent', this.data);
      }
    };
    this.control.addEventListener('keydown', handlePointerStart);
  }

  public calcPositionSetByKey(data: IControlFull) {
    const { direction, repeat, movingControl } = data;

    const isIncreasing = direction === 'ArrowRight' || direction === 'ArrowUp';
    const isDecreasing = direction === 'ArrowLeft' || direction === 'ArrowDown';

    const isMin = movingControl === 'min';
    const isMax = movingControl === 'max';

    const isIncreasingNoSticky = isIncreasing && !this.conf.sticky;
    const isDecreasingNoSticky = isDecreasing && !this.conf.sticky;

    const isMinIncreasingNoSticky = isMin && isIncreasingNoSticky;
    const isMinDecreasingNoSticky = isMin && isDecreasingNoSticky;
    const isMaxIncreasingNoSticky = isMax && isIncreasingNoSticky;
    const isMaxDecreasingNoSticky = isMax && isDecreasingNoSticky;

    const isIncreasingSticky = isIncreasing && this.conf.sticky;
    const isDecreasingSticky = isDecreasing && this.conf.sticky;

    const isMinIncreasingSticky = isMin && isIncreasingSticky;
    const isMinDecreasingSticky = isMin && isDecreasingSticky;
    const isMaxIncreasingSticky = isMax && isIncreasingSticky;
    const isMaxDecreasingSticky = isMax && isDecreasingSticky;

    if (isMinIncreasingNoSticky) return this.getNewValueNoSticky('MinIncreasingNoSticky', repeat);
    if (isMinDecreasingNoSticky) return this.getNewValueNoSticky('MinDecreasingNoSticky', repeat);
    if (isMaxIncreasingNoSticky) return this.getNewValueNoSticky('MaxIncreasingNoSticky', repeat);
    if (isMaxDecreasingNoSticky) return this.getNewValueNoSticky('MaxDecreasingNoSticky', repeat);

    const value = movingControl === 'min' ? this.conf.from : this.conf.to;
    const index = this.data.marksArray.findIndex((elem) => elem.value === value);
    const shift = this.getShift(repeat);
    const indexToSearch = isIncreasing ? index + shift : index - shift;
    const item = this.data.marksArray[indexToSearch];

    if (isMinIncreasingSticky) return this.getNewValueSticky('MinIncreasingSticky', item);
    if (isMinDecreasingSticky) return this.getNewValueSticky('MinDecreasingSticky', item);
    if (isMaxIncreasingSticky) return this.getNewValueSticky('MaxIncreasingSticky', item);
    if (isMaxDecreasingSticky) return this.getNewValueSticky('MaxDecreasingSticky', item);

    return null;
  }

  private getNewValueNoSticky(condition: string, isRepeating: boolean) {
    const shift = this.getShift(isRepeating);
    switch (condition) {
      case 'MinIncreasingNoSticky':
      { const isBelowMax = (this.conf.range && this.conf.from < this.conf.to)
          || (!this.conf.range && this.conf.from < this.conf.max);
      const isAboveMaxRange = this.conf.range && this.conf.from >= this.conf.to;
      const isAboveMaxNoRange = !this.conf.range && this.conf.from >= this.conf.max;

      let newValue = 0;
      if (isBelowMax) {
        const limit = this.conf.range ? this.conf.to : this.conf.max;
        newValue = this.conf.from + shift;
        newValue = (newValue > limit) ? limit : newValue;
      }
      if (isAboveMaxRange) newValue = this.conf.to;
      if (isAboveMaxNoRange) newValue = this.conf.max;
      return this.calcControlPosition(newValue);
      }

      case 'MinDecreasingNoSticky':
      { let newValue = 0;
        if (this.conf.from > this.conf.min) {
          newValue = this.conf.from - shift;
          newValue = newValue < this.conf.min ? this.conf.min : newValue;
        } else newValue = this.conf.min;
        return this.calcControlPosition(newValue); }

      case 'MaxIncreasingNoSticky':
      { let newValue = 0;
        if (this.conf.to < this.conf.max) {
          newValue = this.conf.to + shift;
          newValue = newValue > this.conf.max ? this.conf.max : newValue;
        } else newValue = this.conf.max;
        return this.calcControlPosition(newValue, false); }

      case 'MaxDecreasingNoSticky':
      { let newValue = 0;
        if (this.conf.to > this.conf.from) {
          newValue = this.conf.to - shift;
          newValue = newValue < this.conf.from ? this.conf.from : newValue;
        } else newValue = this.conf.from;
        return this.calcControlPosition(newValue, false); }

      default: return 0;
    }
  }

  private calcControlPosition(result: number, isControlFrom = true) {
    const configurationValue = isControlFrom ? 'from' : 'to';

    this.data[`${configurationValue}Value`] = String(result);
    this.conf[configurationValue] = result;
    this[`${isControlFrom ? 'calcFromPosition' : 'calcToPosition'}`]();

    // this.notify(`${configurationValue.toUpperCase()}Value`, this.data);

    // return this.triggerControlPositionChange(result);
    return result;
  }

  private getShift(isRepeating: boolean) {
    return isRepeating ? this.conf.shiftOnKeyHold : this.conf.shiftOnKeyDown;
  }

  private getNewValueSticky(condition: string, item: IPluginConfigurationItem) {
    const changeFrom = (values: IPluginConfigurationItem) => {
      this.conf.from = values.value;
      this.data.fromPosition = values.position;
      this.data.fromValue = String(values.value);
      this.notify('FromPosition', this.data, this.conf);
      this.notify('FromValue', this.data);
      return values;
    };

    const changeTo = (values: IPluginConfigurationItem) => {
      this.conf.to = values.value;
      this.data.toPosition = values.position;
      this.data.toValue = String(values.value);
      this.notify('ToPosition', this.data, this.conf);
      this.notify('ToValue', this.data);
      return values;
    };

    switch (condition) {
      case 'MinIncreasingSticky':
      {
        if (item === undefined) return 'newPosition>100';
        const isValueAscending = item.value > this.conf.from
          && ((this.conf.range && item.value <= this.conf.to)
            || (!this.conf.range && item.value
              <= this.conf.max));
        const result = isValueAscending ? changeFrom(item) : 'too big newPosition';
        // return this.triggerControlPositionChange(result);
        return result;
      }

      case 'MinDecreasingSticky':
      {
        if (item === undefined) return 'newPosition<0';
        const isValueDescending = (this.conf.range && item.value < this.conf.to)
          || !this.conf.range;
        const result = isValueDescending ? changeFrom(item) : 'too small newPosition';
        // return this.triggerControlPositionChange(result);
        return result;
      }

      case 'MaxIncreasingSticky':
      {
        if (item === undefined) return 'newPosition>100';
        const isValueAscending = item && item.value > this.conf.to
          && this.conf.to < this.conf.max;
        const result = isValueAscending ? changeTo(item) : 'too big newPosition';
        // return this.triggerControlPositionChange(result);
        return result;
      }

      case 'MaxDecreasingSticky':
      {
        if (item === undefined) return 'newPosition<0';
        const isValueDescending = item.value >= this.conf.from
        && this.conf.to > this.conf.from;
        const result = isValueDescending ? changeTo(item) : 'too small newPosition';
        // return this.triggerControlPositionChange(result);
        return result;
      }
      default: return 0;
    }
  }

  // private triggerControlPositionChange =
  // (result: number | string | IPluginConfigurationItem) => {
  //   if (typeof this.onChange === 'function') this.onChange(this.conf);
  //   return result;
  // };

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
      if (!result) return;
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

      if (this.controlMax && this.controlMax.classList.contains('hidden')) control.movingControl = 'min';
      else control.movingControl = controlMinDist <= controlMaxDist ? 'min' : 'max';
      this.calcPositionSetByPointer(control);
    };
    this.control.addEventListener('pointerdown', handlePointerStart);
  }

  private calcFromPosition() {
    this.fromPosition = ((this.conf.from - this.conf.min) * 100)
    / (this.conf.max - this.conf.min);

    if (this.conf.sticky) this.fromPosition = this.setSticky(this.fromPosition);
    if (this.controlMin) this.updatePos(this.controlMin, this.fromPosition);
  }

  private calcToPosition() {
    this.toPosition = ((this.conf.to - this.conf.min) * 100)
      / (this.conf.max - this.conf.min);
    if (this.conf.sticky) this.toPosition = this.setSticky(this.toPosition);
    if (this.controlMax) this.updatePos(this.controlMax, this.toPosition);
  }

  private calcValue(
    stopType: TControlStopTypes,
    position: number,
    movingControl: 'min' | 'max',
  ) {
    if (this.changeMode) return;

    const stopTypes = {
      normal: (this.conf.min + ((this.conf.max
        - this.conf.min) * position) / 100).toFixed(0),
      min: String(this.conf.min),
      max: String(this.conf.max),
      meetMax: String(this.conf.to),
      meetMin: String(this.conf.from),
    };

    const newValue = stopTypes[stopType];
    if (movingControl === 'min') {
      this.data.fromValue = newValue;
      this.conf.from = parseFloat(newValue);
      return;
    }
    this.data.toValue = newValue;
    this.conf.to = parseFloat(newValue);
  }

  private setSticky(controlPosition: number) {
    let goal = this.scaleMarks.find((
      element: IPluginConfigurationItem,
      item: number,
      array: IPluginConfigurationItem[],
    ) => {
      let temporaryPosition = 0;
      if (item < array.length - 1) temporaryPosition = array[item + 1].position;
      return Math.abs(controlPosition - element.position)
        < Math.abs(controlPosition - temporaryPosition);
    });

    if (!goal) goal = { value: 0, position: 0 };
    return goal.position;
  }
}

export default ViewControl;
