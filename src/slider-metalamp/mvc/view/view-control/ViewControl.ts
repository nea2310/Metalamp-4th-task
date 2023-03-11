import { defaultControlData } from '../../utils';
import Observer from '../../Observer';
import {
  IPluginConfigurationFull,
  TControlKeydownTypes,
  IDOMElement,
  TControlStopTypes,
  IScaleMark,
  IControlFull,
  IEventTarget,
} from '../../interface';

class ViewControl extends Observer {
  private isControlActive = true;

  private fromPosition = 0;

  private toPosition = 0;

  private tipMin: HTMLInputElement | null = null;

  private tipMax: HTMLInputElement | null = null;

  private track: IDOMElement | null = null;

  private configuration: IPluginConfigurationFull;

  private slider: HTMLElement;

  private scaleMarks: IScaleMark[];

  private controlData: IControlFull = defaultControlData;

  private controlMin?: HTMLElement;

  private controlMax?: HTMLElement;

  constructor(
    sliderElement: HTMLElement,
    configuration: IPluginConfigurationFull,
    scaleMarks: IScaleMark[],
  ) {
    super();
    this.slider = sliderElement;
    this.configuration = configuration;
    this.scaleMarks = scaleMarks;
    this.render();
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

  set controlConfigurationItem(data: {
    item: 'range' | 'sticky' | 'shiftOnKeyDown' | 'shiftOnKeyHold' | 'round',
    value: boolean | number,
  }) {
    this.configuration = { ...this.configuration, [data.item]: data.value };
  }

  set controlConfiguration(configuration: IPluginConfigurationFull) {
    this.configuration = configuration;
  }

  set isSliderActive(isActive: boolean) {
    this.isControlActive = isActive;
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
      this.notify('viewControlUpdate', {
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
    scaleMarks: IScaleMark[] = [],
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
    const value = isMinControl ? from : to;
    this.updateValue(String(value), isMinControl);
  }

  public switchRange(isRange = true) {
    this.controlConfigurationItem = { item: 'range', value: isRange };
    if (!this.track) return;
    if (!isRange) this.controlMax?.remove();
    else this.createControl(false);
  }

  private render() {
    this.track = this.slider.firstElementChild;
    this.createControl(true);
    if (this.configuration.range) this.createControl();

    this.dragControl();
    this.pressControl();
    this.clickTrack();
    this.clickScaleMark();
  }

  private createControl(isMinControl = false) {
    const controlType = isMinControl ? 'Min' : 'Max';
    const type = isMinControl ? 'from' : 'to';
    const control = ViewControl.renderControl(
      `slider-metalamp__control-${controlType.toLowerCase()}`,
      `slider-metalamp__tip-${controlType.toLowerCase()}`,
      this.configuration[type],
    );

    if (!control) return;

    this[`control${controlType}`] = control;
    this[`tip${controlType}`] = ViewControl.getElement(control, '.slider-metalamp__tip');
    this.track?.append(control);
    this.calcPositionSetByKey(isMinControl);
  }

  private dragControl() {
    const handlePointerStart = (event: PointerEvent) => {
      if (!this.isControlActive) return;
      event.preventDefault();
      const { target } = event;
      if (!(target instanceof HTMLElement)) return;
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
      if (!this.isControlActive) return;
      const directions: Array<TControlKeydownTypes> = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp'];
      const direction: TControlKeydownTypes | undefined = directions.find(
        (element) => element === event.code,
      );
      if (direction) event.preventDefault();
      const { target } = event;
      if (!(target instanceof HTMLElement)) return;
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
    const handlePointerDown = (event: PointerEvent) => {
      if (!this.isControlActive) return;
      event.preventDefault();
      const { target } = event;
      if (!(target instanceof HTMLElement)) return;

      const array = ['slider-metalamp__track',
        'slider-metalamp__progress-bar'];
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
        this.controlData.width = this.track.getBoundingClientRect().width;
        this.controlData.height = this.track.getBoundingClientRect().height;
        this.controlData.type = 'pointerdown';
        this.controlData.clientX = event.clientX;
        this.controlData.clientY = event.clientY;
      }

      if (this.controlMax && this.controlMax.classList.contains('hidden')) this.controlData.movingControl = 'min';
      else this.controlData.movingControl = controlMinDist <= controlMaxDist ? 'min' : 'max';
      this.calcPositionSetByPointer();
    };
    this.slider.addEventListener('pointerdown', handlePointerDown);
  }

  private clickScaleMark() {
    const handlePointerDown = (event: PointerEvent) => {
      if (!this.isControlActive) return;
      event.preventDefault();
      const { target } = event;

      if (!(target instanceof HTMLElement) || !target.classList.contains('slider-metalamp__label')) return;

      const value = Number(target.innerText);
      const { from, to, range } = this.configuration;
      const isFrom = (Math.abs(from - value) < Math.abs(to - value) && range) || !range;
      const type = isFrom ? 'from' : 'to';
      this.configuration[type] = value;
      this.calcPositionSetByKey(isFrom);
    };
    this.slider.addEventListener('pointerdown', handlePointerDown);
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

    const updateControl = (data: {
      stopType: TControlStopTypes,
      newPosition: number,
      controlPosition: number,
      positionType: 'fromPosition' | 'toPosition',
      control: HTMLElement | undefined

    }) => {
      const {
        stopType, newPosition, controlPosition, positionType, control,
      } = data;

      this.calcValueSetByPointer(stopType, newPosition, movingControl);
      this.updateConfiguration(controlPosition, positionType);
      this.setControlOnPosition(control, controlPosition);
    };

    let newPosition = 0;
    if (this.configuration.vertical) newPosition = 100 - (((clientY - top) * 100) / height);
    else {
      const shift = (type === 'pointermove') ? (shiftBase * 100) / width : 0;
      newPosition = (((clientX - left) * 100) / width) - shift;
    }

    if (this.configuration.sticky) newPosition = this.setSticky(newPosition);

    const isMinControl = movingControl === 'min';
    const isBeyondToPosition = this.configuration.range && isMinControl
      && newPosition > this.toPosition;
    if (isBeyondToPosition) {
      updateControl({
        stopType: 'meetMax',
        newPosition: 0,
        controlPosition: this.toPosition,
        positionType: 'fromPosition',
        control: this.controlMin,
      });
      return;
    }

    const isBelowFromPosition = this.configuration.range && !isMinControl
      && newPosition < this.fromPosition;
    if (isBelowFromPosition) {
      updateControl({
        stopType: 'meetMin',
        newPosition: 0,
        controlPosition: this.fromPosition,
        positionType: 'toPosition',
        control: this.controlMax,
      });
      return;
    }

    if (newPosition < 0) {
      updateControl({
        stopType: 'min',
        newPosition: 0,
        controlPosition: 0,
        positionType: 'fromPosition',
        control: this.controlMin,
      });
      return;
    }

    if (newPosition > 100) {
      const control = this.configuration.range ? this.controlMax : this.controlMin;
      updateControl({
        stopType: 'max',
        newPosition: 0,
        controlPosition: 100,
        positionType: 'toPosition',
        control,
      });
      return;
    }

    const controlType = isMinControl ? 'controlMin' : 'controlMax';
    const positionType = isMinControl ? 'fromPosition' : 'toPosition';
    updateControl({
      stopType: 'normal',
      newPosition,
      controlPosition: newPosition,
      positionType,
      control: this[controlType],
    });
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
      round,
    } = this.configuration;

    switch (condition) {
      case 'MinIncreasingNoSticky': {
        const isBelowMax = (range && from < to)
            || (!range && from < max);
        const isAboveMaxRange = range && from >= to;
        const isAboveMaxNoRange = !range && from >= max;

        let value = 0;
        if (isBelowMax) {
          const limit = range ? to : max;
          value = Number((from + shift).toFixed(round));
          value = (value > limit) ? limit : value;
        }
        if (isAboveMaxRange) value = to;
        if (isAboveMaxNoRange) value = max;
        this.calcPositionAndUpdateConfiguration(value);
        return;
      }

      case 'MinDecreasingNoSticky': {
        let value = 0;
        if (from > min) {
          value = Number((from - shift).toFixed(round));
          value = value < min ? min : value;
        } else value = min;

        this.calcPositionAndUpdateConfiguration(value);
        return;
      }

      case 'MaxIncreasingNoSticky': {
        let value = 0;
        if (to < max) {
          value = Number((to + shift).toFixed(round));
          value = value > max ? max : value;
        } else value = max;
        this.calcPositionAndUpdateConfiguration(value, 'toValue');
        return;
      }

      case 'MaxDecreasingNoSticky': {
        let value = 0;
        if (to > from) {
          value = Number((to - shift).toFixed(round));
          value = value < from ? from : value;
        } else value = from;
        this.calcPositionAndUpdateConfiguration(value, 'toValue');
        break;
      }

      default: break;
    }
  }

  private calcValueSetByKeySticky(condition: string, item: IScaleMark) {
    if (!item) return;
    const {
      range,
      from,
      to,
      max,
    } = this.configuration;
    const { value } = item;

    switch (condition) {
      case 'MinIncreasingSticky': {
        if (item === undefined) return;
        const isValueAscending = value > from
          && ((range && value <= to)
          || (!range && value <= max));
        if (!isValueAscending) return;
        this.calcPositionAndUpdateConfiguration(value);
        return;
      }

      case 'MinDecreasingSticky': {
        if (item === undefined) return;
        const isValueDescending = (range && value < to) || !range;
        if (!isValueDescending) return;
        this.calcPositionAndUpdateConfiguration(value);
        return;
      }

      case 'MaxIncreasingSticky': {
        if (item === undefined) return;
        const isValueAscending = item && value > to && to < max;
        if (!isValueAscending) return;
        this.calcPositionAndUpdateConfiguration(value, 'toValue');
        return;
      }

      case 'MaxDecreasingSticky': {
        if (item === undefined) return;
        const isValueDescending = value >= from && to > from;
        if (!isValueDescending) return;
        this.calcPositionAndUpdateConfiguration(value, 'toValue');
        break;
      }

      default: break;
    }
  }

  private updateValue(value: string, isFrom: boolean) {
    const { tipMin, tipMax } = this;
    const tip = isFrom ? tipMin : tipMax;
    if (tip) tip.innerText = value;
  }

  private setControlOnPosition(element: HTMLElement | undefined, newPosition: number) {
    if (!element) return;
    const item = element;
    const propertyToSet = this.configuration.vertical ? 'bottom' : 'left';
    const propertyToUnset = this.configuration.vertical ? 'left' : 'bottom';
    item.style[propertyToSet] = `${newPosition}%`;
    item.style[propertyToUnset] = '';
  }

  private defineControl = (element: IEventTarget): 'min' | 'max' | null => {
    if (!element.classList) return null;
    return element.classList.contains('slider-metalamp__control-min') ? 'min' : 'max';
  };

  private getMetrics(element: IEventTarget) {
    const scale = element.parentElement;
    if (!scale) return;
    this.controlData.top = scale.getBoundingClientRect().top;
    this.controlData.left = scale.getBoundingClientRect().left;
    this.controlData.width = scale.getBoundingClientRect().width;
    this.controlData.height = scale.getBoundingClientRect().height;
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

    if (isMinIncreasingNoSticky) {
      this.calcValueSetByKeyNoSticky('MinIncreasingNoSticky', repeat);
      return;
    }
    if (isMinDecreasingNoSticky) {
      this.calcValueSetByKeyNoSticky('MinDecreasingNoSticky', repeat);
      return;
    }
    if (isMaxIncreasingNoSticky) {
      this.calcValueSetByKeyNoSticky('MaxIncreasingNoSticky', repeat);
      return;
    }
    if (isMaxDecreasingNoSticky) {
      this.calcValueSetByKeyNoSticky('MaxDecreasingNoSticky', repeat);
      return;
    }

    const value = movingControl === 'min' ? this.configuration.from : this.configuration.to;
    const index = this.scaleMarks.findIndex((elem) => elem.value === value);
    const shift = this.getShift(repeat);
    const indexToSearch = isIncreasing ? index + shift : index - shift;
    const item = this.scaleMarks[indexToSearch];

    if (isMinIncreasingSticky) {
      this.calcValueSetByKeySticky('MinIncreasingSticky', item);
      return;
    }
    if (isMinDecreasingSticky) {
      this.calcValueSetByKeySticky('MinDecreasingSticky', item);
      return;
    }
    if (isMaxIncreasingSticky) {
      this.calcValueSetByKeySticky('MaxIncreasingSticky', item);
      return;
    }
    if (isMaxDecreasingSticky) {
      this.calcValueSetByKeySticky('MaxDecreasingSticky', item);
    }
  }

  private getShift(isRepeating: boolean) {
    return isRepeating ? this.configuration.shiftOnKeyHold : this.configuration.shiftOnKeyDown;
  }

  private calcPositionAndUpdateConfiguration(value: number, valueType: 'fromValue' | 'toValue' = 'fromValue') {
    const isMinControl = valueType === 'fromValue';
    if (isMinControl) {
      this.configuration.from = value;
      this.calcPositionSetByKey(isMinControl, value);
    } else {
      this.configuration.to = value;
      this.calcPositionSetByKey(isMinControl, this.configuration.from, value);
    }

    this.updateConfiguration(value, valueType);
  }

  private setSticky(controlPosition: number) {
    let goal = this.scaleMarks.find((
      element: IScaleMark,
      item: number,
      array: IScaleMark[],
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
