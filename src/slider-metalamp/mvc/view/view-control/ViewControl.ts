import { defaultControlData } from '../../utils';
import Observer from '../../Observer';
import {
  IPluginConfigurationFull,
  TControlKeydownTypes,
  IDOMElement,
  TControlStopTypes,
  IPluginConfigurationItem,
  IControlFull,
} from '../../interface';

interface ITarget extends Omit<EventTarget, 'addEventListener'> {
  readonly classList?: DOMTokenList;
  readonly parentElement?: HTMLElement | null;
}

const TIP_SHIFT = 20;

class ViewControl extends Observer {
  private fromPosition = 0;

  private toPosition = 0;

  private controlMin: HTMLElement | undefined;

  private controlMax: HTMLElement | undefined;

  private tipMin: HTMLInputElement | null = null;

  private tipMax: HTMLInputElement | null = null;

  private track: IDOMElement | null = null;

  private configuration: IPluginConfigurationFull;

  private slider: HTMLElement;

  private scaleMarks: IPluginConfigurationItem[];

  private controlData: IControlFull = defaultControlData;

  private controlSetCallback: Function = () => {};

  constructor(
    sliderElement: HTMLElement,
    configuration: IPluginConfigurationFull,
    scaleMarks: IPluginConfigurationItem[],
    callback: Function = () => {},
  ) {
    super();
    this.slider = sliderElement;
    this.configuration = configuration;
    this.scaleMarks = scaleMarks;
    this.controlSetCallback = callback;
    this.render();
  }

  static getTipPosition(isVertical: boolean, elem: HTMLElement) {
    if (isVertical) return `-${elem.offsetWidth + TIP_SHIFT}px`;
    return `-${(elem.offsetWidth / 2)}px`;
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

  set controlConfiguration(data: { parameter: 'range' | 'sticky' | 'shiftOnKeyDown' | 'shiftOnKeyHold' | 'round', value: boolean | number }) {
    this.configuration = { ...this.configuration, [data.parameter]: data.value };
  }

  get positionFrom() {
    return this.fromPosition;
  }

  get positionTo() {
    return this.toPosition;
  }

  public updateConfiguration(
    newValue: number | boolean,
    valueType: 'fromValue' | 'toValue' | 'fromPosition' | 'toPosition',
  ) {
    const condition = (valueType === 'fromPosition' || valueType === 'toPosition') && typeof newValue === 'number';
    if (condition) {
      this[valueType] = newValue;
      this.controlSetCallback({
        fromPosition: this.fromPosition,
        toPosition: this.toPosition,
        from: this.configuration.from,
        to: this.configuration.to,
        isRange: this.configuration.range,
        isVertical: this.configuration.vertical,
      });
    }
    if (valueType.match(/Value/) && typeof newValue === 'number') {
      const isMinControl = valueType === 'fromValue';
      const configurationValue = isMinControl ? 'from' : 'to';
      this.configuration[configurationValue] = newValue;
      this.updateValue(String(newValue), isMinControl);
    }
  }

  public updateScaleMarks(
    scaleMarks: IPluginConfigurationItem[] = [],
    min = this.configuration.min,
    max = this.configuration.max,
    vertical = this.configuration.vertical,
  ) {
    this.scaleMarks = scaleMarks;
    this.configuration.min = min;
    this.configuration.max = max;
    this.configuration.vertical = vertical;
    this.calcPositionSetByKey(true);
    this.calcPositionSetByKey();
  }

  public switchSticky() {
    const { from, to, step } = this.configuration;

    const getNewValue = (value: number) => {
      const remainder = value % step;
      if (!remainder) return undefined;
      const condition = Math.abs(remainder) > step / 2;
      if (!condition) return value - remainder;
      return remainder > 0 ? value + (step - remainder) : value - (step + remainder);
    };

    const newFromValue = getNewValue(from);
    if (newFromValue) {
      this.configuration.from = newFromValue;
      this.calcPositionAndUpdateConfiguration(newFromValue);
    }

    const newToValue = getNewValue(to);
    if (newToValue) {
      this.configuration.to = newToValue;
      this.calcPositionAndUpdateConfiguration(newToValue, 'toValue');
    }
  }

  public calcPositionSetByKey(
    isMinControl = false,
    from = this.configuration.from,
    to = this.configuration.to,
  ) {
    const {
      min,
      max,
      sticky,
    } = this.configuration;
    const positionType = isMinControl ? 'fromPosition' : 'toPosition';
    const controlType = isMinControl ? 'controlMin' : 'controlMax';
    let positonValue = isMinControl ? ((from - min) * 100) / (max - min)
      : ((to - min) * 100) / (max - min);
    if (sticky) positonValue = this.setSticky(positonValue);
    this.updateConfiguration(positonValue, positionType);
    if (this[controlType]) this.setControlOnPosition(this[controlType], this[positionType]);
  }

  public switchTip(vertical: boolean) {
    if (!this.tipMax || !this.tipMin) return;
    this.tipMax.style.left = ViewControl.getTipPosition(vertical, this.tipMax);
    this.tipMin.style.left = ViewControl.getTipPosition(vertical, this.tipMin);
  }

  private render() {
    this.track = this.slider.firstElementChild;
    if (!this.track) return;

    this.controlMin = ViewControl.renderControl('slider-metalamp__control-min', 'slider-metalamp__tip-min', this.configuration.from);
    this.tipMin = ViewControl.getElement(this.controlMin, '.slider-metalamp__tip');
    this.track.append(this.controlMin);

    this.controlMax = ViewControl.renderControl('slider-metalamp__control-max', 'slider-metalamp__tip-max', this.configuration.to);
    this.tipMax = ViewControl.getElement(this.controlMax, '.slider-metalamp__tip');
    this.track.append(this.controlMax);

    this.dragControl();
    this.pressControl();
    this.clickTrack();

    this.calcPositionSetByKey(true);
    this.calcPositionSetByKey();
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
      const movingControl = this.defineControl(target);
      if (target.classList.contains('slider-metalamp__control') && movingControl) {
        this.controlData.movingControl = movingControl;

        this.controlData.shiftBase = this.configuration.vertical ? 0
          : event.clientX - target.getBoundingClientRect().left;
        this.getMetrics(target);

        const handlePointerMove = (innerEvent: PointerEvent) => {
          this.controlData.type = 'pointermove';
          this.controlData.clientX = innerEvent.clientX;
          this.controlData.clientY = innerEvent.clientY;
          this.calcPositionSetByPointer();
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
      const directions: Array<TControlKeydownTypes> = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp'];
      const direction: TControlKeydownTypes | undefined = directions.find(
        (element) => element === event.code,
      );
      if (direction) event.preventDefault();
      const { target } = event;
      if (!(target instanceof HTMLElement)) {
        throw new Error('Cannot handle move outside of DOM');
      }
      if (!direction) return;

      if (target.classList.contains('slider-metalamp__control')) {
        this.controlData.movingControl = target.classList.contains('slider-metalamp__control-min') ? 'min' : 'max';
        this.controlData.direction = direction;
        this.controlData.repeat = event.repeat;
        this.defineMoveType(this.controlData);
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

      const array = ['slider-metalamp__track',
        'slider-metalamp__progress-bar',
        'slider-metalamp__label',
        'slider-metalamp__mark',
        'slider-metalamp__frame'];
      const result = [...target.classList].some((className) => array.indexOf(className) !== -1);
      if (!result) return;
      let controlMinDist = 0;
      let controlMaxDist = 0;
      const property = this.configuration.vertical ? 'bottom' : 'left';
      const parameter = this.configuration.vertical ? 'clientY' : 'clientX';

      if (this.controlMin && this.controlMax) {
        controlMinDist = Math.abs(this.controlMin
          .getBoundingClientRect()[property] - event[parameter]);
        controlMaxDist = Math.abs(this.controlMax
          .getBoundingClientRect()[property] - event[parameter]);
      }

      if (this.track) {
        this.controlData.top = this.track.getBoundingClientRect().top;
        this.controlData.left = this.track.getBoundingClientRect().left;
        this.controlData.width = Number(this.track.offsetWidth);
        this.controlData.height = Number(this.track.offsetHeight);
        this.controlData.type = 'pointerdown';
        this.controlData.clientX = event.clientX;
        this.controlData.clientY = event.clientY;
      }

      if (this.controlMax && this.controlMax.classList.contains('hidden')) this.controlData.movingControl = 'min';
      else this.controlData.movingControl = controlMinDist <= controlMaxDist ? 'min' : 'max';
      this.calcPositionSetByPointer();
    };
    this.slider.addEventListener('pointerdown', handlePointerStart);
  }

  private calcPositionSetByPointer() {
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
    } = this.controlData;

    let newPosition = 0;
    if (this.configuration.vertical) newPosition = 100 - (((clientY - top) * 100) / height);
    else {
      const shift = (type === 'pointermove') ? (shiftBase * 100) / width : 0;
      newPosition = (((clientX - left) * 100) / width) - shift;
    }

    if (this.configuration.sticky) newPosition = this.setSticky(newPosition);

    if (newPosition < 0) {
      this.calcValueSetByPointer('min', 0, movingControl);
      return newPosition;
    }

    if (newPosition > 100) {
      this.calcValueSetByPointer('max', 0, movingControl);
      return newPosition;
    }
    const isMinControl = movingControl === 'min';
    const isBeyondToPosition = this.configuration.range && isMinControl
      && newPosition > this.toPosition;
    if (isBeyondToPosition) {
      this.calcValueSetByPointer('meetMax', 0, movingControl);
      return newPosition;
    }

    const isBelowFromPosition = this.configuration.range && !isMinControl
      && newPosition < this.fromPosition;
    if (isBelowFromPosition) {
      this.calcValueSetByPointer('meetMin', 0, movingControl);
      return newPosition;
    }

    const controlType = isMinControl ? 'controlMin' : 'controlMax';
    const positionType = isMinControl ? 'fromPosition' : 'toPosition';

    if (this[controlType]) this.setControlOnPosition(this[controlType], newPosition);
    this.calcValueSetByPointer('normal', newPosition, movingControl);
    this.updateConfiguration(newPosition, positionType);
    return newPosition;
  }

  private calcValueSetByPointer(
    stopType: TControlStopTypes,
    position: number,
    movingControl: 'min' | 'max',
  ) {
    const {
      min,
      max,
      from,
      to,
      round,
    } = this.configuration;

    const stopTypes = {
      normal: Number((min + ((max - min) * position) / 100).toFixed(round)),
      min,
      max,
      meetMax: to,
      meetMin: from,
    };
    const isMinControl = movingControl === 'min';
    const valueType = isMinControl ? 'fromValue' : 'toValue';
    this.updateConfiguration(stopTypes[stopType], valueType);
  }

  private calcValueSetByKeyNoSticky(condition: string, isRepeating: boolean) {
    const shift = this.getShift(isRepeating);
    const {
      range,
      from,
      to,
      min,
      max,
    } = this.configuration;

    switch (condition) {
      case 'MinIncreasingNoSticky':
      { const isBelowMax = (range && from < to)
          || (!range && from < max);
      const isAboveMaxRange = range && from >= to;
      const isAboveMaxNoRange = !range && from >= max;

      let value = 0;
      if (isBelowMax) {
        const limit = range ? to : max;
        value = from + shift;
        value = (value > limit) ? limit : value;
      }
      if (isAboveMaxRange) value = to;
      if (isAboveMaxNoRange) value = max;
      return this.calcPositionAndUpdateConfiguration(value); }

      case 'MinDecreasingNoSticky':
      { let value = 0;
        if (from > min) {
          value = from - shift;
          value = value < min ? min : value;
        } else value = min;
        return this.calcPositionAndUpdateConfiguration(value); }

      case 'MaxIncreasingNoSticky':
      { let value = 0;
        if (to < max) {
          value = to + shift;
          value = value > max ? max : value;
        } else value = max;
        return this.calcPositionAndUpdateConfiguration(value, 'toValue'); }

      case 'MaxDecreasingNoSticky':
      { let value = 0;
        if (to > from) {
          value = to - shift;
          value = value < from ? from : value;
        } else value = from;
        return this.calcPositionAndUpdateConfiguration(value, 'toValue'); }

      default: return 0;
    }
  }

  private calcValueSetByKeySticky(condition: string, item: IPluginConfigurationItem) {
    const {
      range,
      from,
      to,
      max,
    } = this.configuration;
    const { value } = item;
    switch (condition) {
      case 'MinIncreasingSticky':
      {
        if (item === undefined) return null;
        const isValueAscending = value > from
          && ((range && value <= to)
          || (!range && value <= max));
        if (!isValueAscending) return null;
        return this.calcPositionAndUpdateConfiguration(value);
      }

      case 'MinDecreasingSticky':
      {
        if (item === undefined) return null;
        const isValueDescending = (range && value < to) || !range;
        if (!isValueDescending) return null;
        return this.calcPositionAndUpdateConfiguration(value);
      }

      case 'MaxIncreasingSticky':
      {
        if (item === undefined) return null;
        const isValueAscending = item && value > to && to < max;
        if (!isValueAscending) return null;
        return this.calcPositionAndUpdateConfiguration(value, 'toValue');
      }

      case 'MaxDecreasingSticky':
      {
        if (item === undefined) return null;
        const isValueDescending = value >= from && to > from;
        if (!isValueDescending) return null;
        return this.calcPositionAndUpdateConfiguration(value, 'toValue');
      }
      default: return null;
    }
  }

  private updateValue(value: string, isFrom: boolean) {
    const { tipMin, tipMax } = this;
    if (!tipMin || !tipMax) return;
    const tip = isFrom ? tipMin : tipMax;
    tip.innerText = value;
  }

  private setControlOnPosition(element: HTMLElement | undefined, newPosition: number) {
    if (!element) return;
    const item = element;
    const propertyToSet = this.configuration.vertical ? 'bottom' : 'left';
    const propertyToUnset = this.configuration.vertical ? 'left' : 'bottom';
    item.style[propertyToSet] = `${newPosition}%`;
    item.style[propertyToUnset] = '';

    if (!this.tipMin || !this.tipMax) return;

    const tip = this.defineControl(item) === 'min' ? this.tipMin : this.tipMax;
    tip.style.left = ViewControl.getTipPosition(this.configuration.vertical, tip);
  }

  private defineControl = (elem: ITarget): 'min' | 'max' | null => {
    if (!elem.classList) return null;
    return elem.classList.contains('slider-metalamp__control-min') ? 'min' : 'max';
  };

  private getMetrics(elem: ITarget) {
    const scale = elem.parentElement;
    if (!scale) return;
    this.controlData.top = scale.getBoundingClientRect().top;
    this.controlData.left = scale.getBoundingClientRect().left;
    this.controlData.width = scale.offsetWidth;
    this.controlData.height = scale.offsetHeight;
  }

  private defineMoveType(data: IControlFull) {
    const { direction, repeat, movingControl } = data;

    const isIncreasing = direction === 'ArrowRight' || direction === 'ArrowUp';
    const isDecreasing = direction === 'ArrowLeft' || direction === 'ArrowDown';

    const isMin = movingControl === 'min';
    const isMax = movingControl === 'max';

    const isIncreasingNoSticky = isIncreasing && !this.configuration.sticky;
    const isDecreasingNoSticky = isDecreasing && !this.configuration.sticky;

    const isMinIncreasingNoSticky = isMin && isIncreasingNoSticky;
    const isMinDecreasingNoSticky = isMin && isDecreasingNoSticky;
    const isMaxIncreasingNoSticky = isMax && isIncreasingNoSticky;
    const isMaxDecreasingNoSticky = isMax && isDecreasingNoSticky;

    const isIncreasingSticky = isIncreasing && this.configuration.sticky;
    const isDecreasingSticky = isDecreasing && this.configuration.sticky;

    const isMinIncreasingSticky = isMin && isIncreasingSticky;
    const isMinDecreasingSticky = isMin && isDecreasingSticky;
    const isMaxIncreasingSticky = isMax && isIncreasingSticky;
    const isMaxDecreasingSticky = isMax && isDecreasingSticky;

    if (isMinIncreasingNoSticky) return this.calcValueSetByKeyNoSticky('MinIncreasingNoSticky', repeat);
    if (isMinDecreasingNoSticky) return this.calcValueSetByKeyNoSticky('MinDecreasingNoSticky', repeat);
    if (isMaxIncreasingNoSticky) return this.calcValueSetByKeyNoSticky('MaxIncreasingNoSticky', repeat);
    if (isMaxDecreasingNoSticky) return this.calcValueSetByKeyNoSticky('MaxDecreasingNoSticky', repeat);

    const value = movingControl === 'min' ? this.configuration.from : this.configuration.to;
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

  private getShift(isRepeating: boolean) {
    return isRepeating ? this.configuration.shiftOnKeyHold : this.configuration.shiftOnKeyDown;
  }

  private calcPositionAndUpdateConfiguration(value: number, valueType: 'fromValue' | 'toValue' = 'fromValue') {
    const isMinControl = valueType === 'fromValue';
    if (isMinControl) this.calcPositionSetByKey(isMinControl, value);
    else this.calcPositionSetByKey(isMinControl, this.configuration.from, value);
    this.updateConfiguration(value, valueType);
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
