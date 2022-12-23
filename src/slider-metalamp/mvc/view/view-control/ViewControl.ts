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

  private fromValue = 0;

  private toValue = 0;

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

    this.calcPositionSetByKey(true);
    this.calcPositionSetByKey();
  }

  // === 1 ===
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

  // === 2 ===
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

    if (newPosition < 0) {
      this.calcValueSetByPointer('min', 0, movingControl);
      return newPosition;
    }

    if (newPosition > 100) {
      this.calcValueSetByPointer('max', 0, movingControl);
      return newPosition;
    }
    const isMinControl = movingControl === 'min';
    const isBeyondToPosition = this.conf.range && isMinControl
      && newPosition > this.toPosition;
    if (isBeyondToPosition) {
      this.calcValueSetByPointer('meetMax', 0, movingControl);
      return newPosition;
    }

    const isBelowFromPosition = this.conf.range && !isMinControl
      && newPosition < this.fromPosition;
    if (isBelowFromPosition) {
      this.calcValueSetByPointer('meetMin', 0, movingControl);
      return newPosition;
    }

    const controlType = isMinControl ? this.controlMin : this.controlMax;
    const positionType = isMinControl ? 'fromPosition' : 'toPosition';
    if (controlType) this.setControlOnPosition(controlType, newPosition);
    this.calcValueSetByPointer('normal', newPosition, movingControl);
    this[positionType] = newPosition;
    return newPosition;
  }

  // ===3===
  private calcValueSetByPointer(
    stopType: TControlStopTypes,
    position: number,
    movingControl: 'min' | 'max',
  ) {
    if (this.changeMode) return;

    const stopTypes = {
      normal: Math.round(this.conf.min + ((this.conf.max
        - this.conf.min) * position) / 100),
      min: this.conf.min,
      max: this.conf.max,
      meetMax: this.conf.to,
      meetMin: this.conf.from,
    };
    const isMinControl = movingControl === 'min';
    const valueType = isMinControl ? 'fromValue' : 'toValue';

    this.updateConfiguration(stopTypes[stopType], valueType);
  }

  // ===4===

  private updateConfiguration(newValue: number, valueType: 'fromValue' | 'toValue', shouldChangePosition = false) {
    this[valueType] = newValue;
    const isMinControl = valueType === 'fromValue';
    const configurationValue = isMinControl ? 'from' : 'to';
    this.conf[configurationValue] = newValue;
    if (shouldChangePosition) this.calcPositionSetByKey(valueType === 'fromValue');
    this.updateValue(String(newValue), isMinControl);
  }

  // ===5===
  public updateValue(value: string, isFrom: boolean) {
    if (!this.tipMin || !this.tipMax) return;
    const tip = isFrom ? this.tipMin : this.tipMax;
    tip.innerText = value;
  }

  // ===6===
  public setControlOnPosition(element: HTMLElement | undefined, newPosition: number) {
    if (!element) return;
    const item = element;
    if (!this.initDone) this.initDone = true;

    const propertyToSet = this.conf.vertical ? 'bottom' : 'left';
    const propertyToUnset = this.conf.vertical ? 'left' : 'bottom';
    item.style[propertyToSet] = `${newPosition}%`;
    item.style[propertyToUnset] = '';

    if (!this.tipMin || !this.tipMax) return;

    const tip = this.defineControl(item) === 'min' ? this.tipMin : this.tipMax;
    tip.style.left = ViewControl.getTipPosition(this.conf.vertical, tip);
  }

  // ===================

  static getTipPosition(isVertical: boolean, elem: HTMLElement) {
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
      this.tipMax.style.left = ViewControl.getTipPosition(conf.vertical, this.tipMax);
      this.tipMin.style.left = ViewControl.getTipPosition(conf.vertical, this.tipMin);
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

  private pressControl() {
    const handlePointerStart = (event: KeyboardEvent) => {
      const directions: Array<TControlKeydownTypes> = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp'];
      const direction: TControlKeydownTypes | undefined = directions.find(
        (element) => element === event.code,
      );
      if (direction) event.preventDefault();
      const { target } = event;
      if (!(target instanceof HTMLElement)) {
        throw new Error('Cannot handle move outside of DOM');
      }
      const { control } = this.data;
      if (!direction) return;

      if (target.classList.contains('slider-metalamp__control')) {
        control.movingControl = target.classList.contains('slider-metalamp__control-min') ? 'min' : 'max';
        control.direction = direction;
        control.repeat = event.repeat;
        this.defineMoveType(control);
      }
    };
    this.control.addEventListener('keydown', handlePointerStart);
  }

  public defineMoveType(data: IControlFull) {
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

    if (isMinIncreasingNoSticky) return this.calcValueSetByKeyNoSticky('MinIncreasingNoSticky', repeat);
    if (isMinDecreasingNoSticky) return this.calcValueSetByKeyNoSticky('MinDecreasingNoSticky', repeat);
    if (isMaxIncreasingNoSticky) return this.calcValueSetByKeyNoSticky('MaxIncreasingNoSticky', repeat);
    if (isMaxDecreasingNoSticky) return this.calcValueSetByKeyNoSticky('MaxDecreasingNoSticky', repeat);

    const value = movingControl === 'min' ? this.conf.from : this.conf.to;
    const index = this.scaleMarks.findIndex((elem) => elem.value === value);
    const shift = this.getShift(repeat);
    const indexToSearch = isIncreasing ? index + shift : index - shift;
    const item = this.scaleMarks[indexToSearch];

    if (isMinIncreasingSticky) return this.calcValueSetByKeySticky('MinIncreasingSticky', item);
    if (isMinDecreasingSticky) return this.calcValueSetByKeySticky('MinDecreasingSticky', item);
    if (isMaxIncreasingSticky) return this.calcValueSetByKeySticky('MaxIncreasingSticky', item);
    if (isMaxDecreasingSticky) return this.calcValueSetByKeySticky('MaxDecreasingSticky', item);

    return null;
  }

  private calcValueSetByKeyNoSticky(condition: string, isRepeating: boolean) {
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
      return this.updateConfiguration(newValue, 'fromValue', true);
      }

      case 'MinDecreasingNoSticky':
      { let newValue = 0;
        if (this.conf.from > this.conf.min) {
          newValue = this.conf.from - shift;
          newValue = newValue < this.conf.min ? this.conf.min : newValue;
        } else newValue = this.conf.min;
        return this.updateConfiguration(newValue, 'fromValue', true); }

      case 'MaxIncreasingNoSticky':
      { let newValue = 0;
        if (this.conf.to < this.conf.max) {
          newValue = this.conf.to + shift;
          newValue = newValue > this.conf.max ? this.conf.max : newValue;
        } else newValue = this.conf.max;
        return this.updateConfiguration(newValue, 'toValue', true); }

      case 'MaxDecreasingNoSticky':
      { let newValue = 0;
        if (this.conf.to > this.conf.from) {
          newValue = this.conf.to - shift;
          newValue = newValue < this.conf.from ? this.conf.from : newValue;
        } else newValue = this.conf.from;
        return this.updateConfiguration(newValue, 'toValue', true); }

      default: return 0;
    }
  }

  private getShift(isRepeating: boolean) {
    return isRepeating ? this.conf.shiftOnKeyHold : this.conf.shiftOnKeyDown;
  }

  private calcValueSetByKeySticky(condition: string, item: IPluginConfigurationItem) {
    switch (condition) {
      case 'MinIncreasingSticky':
      {
        if (item === undefined) return 'newPosition>100';
        const isValueAscending = item.value > this.conf.from
          && ((this.conf.range && item.value <= this.conf.to)
            || (!this.conf.range && item.value
              <= this.conf.max));
        return isValueAscending ? this.updateConfiguration(item.value, 'fromValue', true) : null;
        // return this.triggerControlPositionChange(result);
        // return result;
      }

      case 'MinDecreasingSticky':
      {
        if (item === undefined) return 'newPosition<0';
        const isValueDescending = (this.conf.range && item.value < this.conf.to)
          || !this.conf.range;
        return isValueDescending ? this.updateConfiguration(item.value, 'fromValue', true) : null;
        // return this.triggerControlPositionChange(result);
        // return result;
      }

      case 'MaxIncreasingSticky':
      {
        if (item === undefined) return 'newPosition>100';
        const isValueAscending = item && item.value > this.conf.to
          && this.conf.to < this.conf.max;
        return isValueAscending ? this.updateConfiguration(item.value, 'toValue', true) : null;
        // return this.triggerControlPositionChange(result);
        // return result;
      }

      case 'MaxDecreasingSticky':
      {
        if (item === undefined) return 'newPosition<0';
        const isValueDescending = item.value >= this.conf.from
        && this.conf.to > this.conf.from;
        return isValueDescending ? this.updateConfiguration(item.value, 'toValue', true) : null;
        // return this.triggerControlPositionChange(result);
        // return result;
      }
      default: return null;
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

  private calcPositionSetByKey(isMinControl = false) {
    const {
      from,
      to,
      min,
      max,
      sticky,
    } = this.conf;
    const positionType = isMinControl ? 'fromPosition' : 'toPosition';
    const controlType = isMinControl ? 'controlMin' : 'controlMax';
    const positonValue = isMinControl ? ((from - min) * 100) / (max - min)
      : ((to - min) * 100) / (max - min);
    this[positionType] = positonValue;

    if (sticky) this[positionType] = this.setSticky(this[positionType]);
    if (this[controlType]) this.setControlOnPosition(this[controlType], this[positionType]);
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
