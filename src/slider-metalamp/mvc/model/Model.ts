import Observer from '../Observer';
import {
  // IPluginConfigurationFull,
  TPluginConfiguration,
  TPluginConfigurationItem,
  // IPluginConfigurationFullIndexed,
  IBusinessDataIndexed,
} from '../interface';
import checkConfiguration from './configurationChecker';

class Model extends Observer {
  public conf: IBusinessDataIndexed = {
    min: 0,
    max: 0,
    from: 0,
    to: 0,
    range: true,
    step: 0,
    interval: 0,
    shiftOnKeyDown: 0,
    shiftOnKeyHold: 0,
    onStart: () => true,
    onChange: () => true,
    onUpdate: () => true,
  };

  private onStart: ((data: any) => unknown) | undefined = () => true;

  private onUpdate: ((data: any) => unknown) | undefined = () => true;

  private onChange: ((data: any) => unknown) | undefined = () => true;

  public init(configuration: IBusinessDataIndexed) {
    // const { onStart, onUpdate, onChange } = configuration;

    this.conf = checkConfiguration(configuration);
    // this.onStart = onStart;
    // this.onUpdate = onUpdate;
    // this.onChange = onChange;
    // if (typeof this.onStart === 'function') this.onStart(this.conf);
  }

  // public start() {
  //   if (typeof this.onStart === 'function') this.onStart(this.conf);
  // }

  public getData() {
    return this.conf;
  }

  public update(newConf: IBusinessDataIndexed) {
    console.log('UPDATE');
    let conf = { ...this.conf, ...newConf };
    conf = checkConfiguration(conf);
    const oldConf = this.conf;
    this.conf = conf;
    this.doCalculation(oldConf, this.conf);
    // if (typeof this.onUpdate === 'function') this.onUpdate(this.conf);
    return this.conf;
  }

  private doCalculation(oldConf: IBusinessDataIndexed, newConf: IBusinessDataIndexed) {
    const sortArray = (object: TPluginConfiguration) => Object.entries(object).sort(
      (a: TPluginConfigurationItem, b: TPluginConfigurationItem) => {
        if (a[0] > b[0]) return 1;
        return -1;
      },
    );

    const changedConfItems = sortArray(newConf).filter((newConfItem) => {
      const confItem = sortArray(oldConf).find(
        (oldConfItem) => oldConfItem[0] === newConfItem[0],
      );
      if (!confItem) return null;
      return confItem[1] !== newConfItem[1];
    });

    changedConfItems.forEach((item) => {
      switch (item[0]) {
        case 'min':
          this.notify('min', this.conf.min);
          break;
        case 'max':
          this.notify('max', this.conf.max);
          break;
        case 'from':
          this.notify('from', this.conf.from);
          break;
        case 'to':
          this.notify('to', this.conf.to);
          break;
        case 'step':
          this.notify('step', this.conf.step);
          break;
        case 'interval':
          this.notify('interval', this.conf.interval);
          break;
        case 'range':
          this.notify('range', this.conf.range);
          break;
        case 'shiftOnKeyDown':
          this.notify('shiftOnKeyDown', this.conf.shiftOnKeyDown);
          break;
        case 'shiftOnKeyHold':
          this.notify('shiftOnKeyHold', this.conf.shiftOnKeyHold);
          break;
        case 'onStart':
          if (newConf.onStart) {
            this.conf.onStart = newConf.onStart;
            this.onStart = newConf.onStart;
          }
          break;
        case 'onChange':
          if (newConf.onChange || newConf.onChange === null) {
            this.conf.onChange = newConf.onChange;
            // this.onChange = newConf.onChange;
          }
          break;
        case 'onUpdate':
          if (newConf.onUpdate) {
            this.conf.onUpdate = newConf.onUpdate;
            this.onUpdate = newConf.onUpdate;
          }
          break;
        default: break;
      }
    });
  }

  // public calcPositionSetByPointer(data: IControlStateData) {
  //   const {
  //     type,
  //     clientY,
  //     clientX,
  //     top,
  //     left,
  //     width,
  //     height,
  //     shiftBase,
  //     movingControl,
  //   } = data;

  //   let newPosition = 0;
  //   if (this.conf.vertical) newPosition = 100 - (((clientY - top) * 100) / height);
  //   else {
  //     const shift = (type === 'pointermove') ? (shiftBase * 100) / width : 0;
  //     newPosition = (((clientX - left) * 100) / width) - shift;
  //   }

  //   if (this.conf.sticky) newPosition = this.setSticky(newPosition);

  //   const updatePosition = (needChange = false, stopType: TControlStopTypes = 'min') => {
  //     this.calcValue(stopType, 0, movingControl);
  //     if (needChange && typeof this.onChange === 'function') this.onChange(this.conf);
  //   };

  //   if (newPosition < 0) {
  //     updatePosition(true);
  //     return newPosition;
  //   }

  //   if (newPosition > 100) {
  //     updatePosition(true, 'max');
  //     return newPosition;
  //   }

  //   const isMinControl = movingControl === 'min';
  //   const isBeyondToPosition = this.conf.range && isMinControl
  //     && newPosition > this.data.toPosition;
  //   if (isBeyondToPosition) {
  //     updatePosition(false, 'meetMax');
  //     return newPosition;
  //   }

  //   const isBelowFromPosition = this.conf.range && !isMinControl
  //     && newPosition < this.data.fromPosition;
  //   if (isBelowFromPosition) {
  //     updatePosition(false, 'meetMin');
  //     return newPosition;
  //   }

  //   const controlType = isMinControl ? 'fromPosition' : 'toPosition';
  //   const notificationType = isMinControl ? 'FromPosition' : 'ToPosition';
  //   this.data[controlType] = newPosition;
  //   this.notify(notificationType, this.data, this.conf);

  //   this.calcValue('normal', newPosition, movingControl);
  //   if (typeof this.onChange === 'function') this.onChange(this.conf);
  //   return newPosition;
  // }

  // public calcPositionSetByKey(data:
  // {
  //   direction: TControlKeydownTypes,
  //   repeat: boolean,
  //   movingControl: 'min' | 'max',
  // }) {
  //   const { direction, repeat, movingControl } = data;

  //   const isIncreasing = direction === 'ArrowRight' || direction === 'ArrowUp';
  //   const isDecreasing = direction === 'ArrowLeft' || direction === 'ArrowDown';

  //   const isMin = movingControl === 'min';
  //   const isMax = movingControl === 'max';

  //   const isIncreasingNoSticky = isIncreasing && !this.conf.sticky;
  //   const isDecreasingNoSticky = isDecreasing && !this.conf.sticky;

  //   const isMinIncreasingNoSticky = isMin && isIncreasingNoSticky;
  //   const isMinDecreasingNoSticky = isMin && isDecreasingNoSticky;
  //   const isMaxIncreasingNoSticky = isMax && isIncreasingNoSticky;
  //   const isMaxDecreasingNoSticky = isMax && isDecreasingNoSticky;

  //   const isIncreasingSticky = isIncreasing && this.conf.sticky;
  //   const isDecreasingSticky = isDecreasing && this.conf.sticky;

  //   const isMinIncreasingSticky = isMin && isIncreasingSticky;
  //   const isMinDecreasingSticky = isMin && isDecreasingSticky;
  //   const isMaxIncreasingSticky = isMax && isIncreasingSticky;
  //   const isMaxDecreasingSticky = isMax && isDecreasingSticky;

  //   if (isMinIncreasingNoSticky) return
  // this.getNewValueNoSticky('MinIncreasingNoSticky', repeat);
  //   if (isMinDecreasingNoSticky) return
  // this.getNewValueNoSticky('MinDecreasingNoSticky', repeat);
  //   if (isMaxIncreasingNoSticky) return
  // this.getNewValueNoSticky('MaxIncreasingNoSticky', repeat);
  //   if (isMaxDecreasingNoSticky) return
  // this.getNewValueNoSticky('MaxDecreasingNoSticky', repeat);

  //   const value = movingControl === 'min' ? this.conf.from : this.conf.to;
  //   const index = this.data.marksArray.findIndex((elem) => elem.value === value);
  //   const shift = this.getShift(repeat);
  //   const indexToSearch = isIncreasing ? index + shift : index - shift;
  //   const item = this.data.marksArray[indexToSearch];

  //   if (isMinIncreasingSticky) return this.getNewValueSticky('MinIncreasingSticky', item);
  //   if (isMinDecreasingSticky) return this.getNewValueSticky('MinDecreasingSticky', item);
  //   if (isMaxIncreasingSticky) return this.getNewValueSticky('MaxIncreasingSticky', item);
  //   if (isMaxDecreasingSticky) return this.getNewValueSticky('MaxDecreasingSticky', item);

  //   return null;
  // }

  // private calcControlPosition(result: number, isControlFrom = true) {
  //   const configurationValue = isControlFrom ? 'from' : 'to';

  //   this.data[`${configurationValue}Value`] = String(result);
  //   this.conf[configurationValue] = result;
  //   this[`${isControlFrom ? 'calcFromPosition' : 'calcToPosition'}`]();
  //   this.notify(`${configurationValue.toUpperCase()}Value`, this.data);

  //   return this.triggerControlPositionChange(result);
  // }

  // private triggerControlPositionChange =
  // (result: number | string | IPluginConfigurationItem) => {
  //   if (typeof this.onChange === 'function') this.onChange(this.conf);
  //   return result;
  // };

  // private getShift(isRepeating: boolean) {
  //   return isRepeating ? this.conf.shiftOnKeyHold : this.conf.shiftOnKeyDown;
  // }

  // private getNewValueNoSticky(condition: string, isRepeating: boolean) {
  //   const shift = this.getShift(isRepeating);
  //   switch (condition) {
  //     case 'MinIncreasingNoSticky':
  //     { const isBelowMax = (this.conf.range && this.conf.from < this.conf.to)
  //         || (!this.conf.range && this.conf.from < this.conf.max);
  //     const isAboveMaxRange = this.conf.range && this.conf.from >= this.conf.to;
  //     const isAboveMaxNoRange = !this.conf.range && this.conf.from >= this.conf.max;

  //     let newValue = 0;
  //     if (isBelowMax) {
  //       const limit = this.conf.range ? this.conf.to : this.conf.max;
  //       newValue = this.conf.from + shift;
  //       newValue = (newValue > limit) ? limit : newValue;
  //     }
  //     if (isAboveMaxRange) newValue = this.conf.to;
  //     if (isAboveMaxNoRange) newValue = this.conf.max;
  //     return this.calcControlPosition(newValue);
  //     }

  //     case 'MinDecreasingNoSticky':
  //     { let newValue = 0;
  //       if (this.conf.from > this.conf.min) {
  //         newValue = this.conf.from - shift;
  //         newValue = newValue < this.conf.min ? this.conf.min : newValue;
  //       } else newValue = this.conf.min;
  //       return this.calcControlPosition(newValue); }

  //     case 'MaxIncreasingNoSticky':
  //     { let newValue = 0;
  //       if (this.conf.to < this.conf.max) {
  //         newValue = this.conf.to + shift;
  //         newValue = newValue > this.conf.max ? this.conf.max : newValue;
  //       } else newValue = this.conf.max;
  //       return this.calcControlPosition(newValue, false); }

  //     case 'MaxDecreasingNoSticky':
  //     { let newValue = 0;
  //       if (this.conf.to > this.conf.from) {
  //         newValue = this.conf.to - shift;
  //         newValue = newValue < this.conf.from ? this.conf.from : newValue;
  //       } else newValue = this.conf.from;
  //       return this.calcControlPosition(newValue, false); }

  //     default: return 0;
  //   }
  // }

  // private getNewValueSticky(condition: string, item: IPluginConfigurationItem) {
  //   const changeFrom = (values: IPluginConfigurationItem) => {
  //     this.conf.from = values.value;
  //     this.data.fromPosition = values.position;
  //     this.data.fromValue = String(values.value);
  //     this.notify('FromPosition', this.data, this.conf);
  //     this.notify('FromValue', this.data);
  //     return values;
  //   };

  //   const changeTo = (values: IPluginConfigurationItem) => {
  //     this.conf.to = values.value;
  //     this.data.toPosition = values.position;
  //     this.data.toValue = String(values.value);
  //     this.notify('ToPosition', this.data, this.conf);
  //     this.notify('ToValue', this.data);
  //     return values;
  //   };

  //   switch (condition) {
  //     case 'MinIncreasingSticky':
  //     {
  //       if (item === undefined) return 'newPosition>100';
  //       const isValueAscending = item.value > this.conf.from
  //         && ((this.conf.range && item.value <= this.conf.to)
  //           || (!this.conf.range && item.value
  //             <= this.conf.max));
  //       const result = isValueAscending ? changeFrom(item) : 'too big newPosition';
  //       return this.triggerControlPositionChange(result);
  //     }

  //     case 'MinDecreasingSticky':
  //     {
  //       if (item === undefined) return 'newPosition<0';
  //       const isValueDescending = (this.conf.range && item.value < this.conf.to)
  //         || !this.conf.range;
  //       const result = isValueDescending ? changeFrom(item) : 'too small newPosition';
  //       return this.triggerControlPositionChange(result);
  //     }

  //     case 'MaxIncreasingSticky':
  //     {
  //       if (item === undefined) return 'newPosition>100';
  //       const isValueAscending = item && item.value > this.conf.to
  //         && this.conf.to < this.conf.max;
  //       const result = isValueAscending ? changeTo(item) : 'too big newPosition';
  //       return this.triggerControlPositionChange(result);
  //     }

  //     case 'MaxDecreasingSticky':
  //     {
  //       if (item === undefined) return 'newPosition<0';
  //       const isValueDescending = item.value >= this.conf.from
  //       && this.conf.to > this.conf.from;
  //       const result = isValueDescending ? changeTo(item) : 'too small newPosition';
  //       return this.triggerControlPositionChange(result);
  //     }
  //     default: return 0;
  //   }
  // }

  // private switchVertical() {
  //   this.notify('IsVertical', this.data, this.conf);

  //   /* Особый вариант использования: setTimeout(func, 0) или просто setTimeout(func).
  //   Это планирует вызов func настолько быстро, насколько это возможно.
  //   Но планировщик будет вызывать функцию только после завершения выполнения текущего кода.
  //   https://learn.javascript.ru/settimeout-setinterval */

  //   setTimeout(() => {
  //     this.calcFromPosition();
  //     this.calcToPosition();
  //     this.calcScaleMarks();
  //   });
  // }

  // private switchRange() {
  //   this.notify('IsRange', this.data, this.conf);
  //   if (typeof this.onChange === 'function') this.onChange(this.conf);
  // }

  // private updateControlPos() {
  //   this.calcFromPosition();
  //   this.calcToPosition();
  //   if (typeof this.onChange === 'function') this.onChange(this.conf);
  //   this.notify('IsSticky', this.data, this.conf);
  // }

  // private switchScale() {
  //   this.notify('IsScale', this.data, this.conf);
  // }

  // private switchBar() {
  //   this.notify('IsBar', this.data, this.conf);
  // }

  // private switchTip() {
  //   this.notify('IsTip', this.data, this.conf);
  // }

  // private setSticky(controlPosition: number) {
  //   let goal = this.data.marksArray.find((
  //     element: IPluginConfigurationItem,
  //     item: number,
  //     array: IPluginConfigurationItem[],
  //   ) => {
  //     let temporaryPosition = 0;
  //     if (item < array.length - 1) temporaryPosition = array[item + 1].position;
  //     return Math.abs(controlPosition - element.position)
  //       < Math.abs(controlPosition - temporaryPosition);
  //   });

  //   if (!goal) goal = { value: 0, position: 0 };
  //   return goal.position;
  // }

  // private calcFromPosition() {
  //   this.data.fromPosition = ((this.conf.from - this.conf.min) * 100)
  //     / (this.conf.max - this.conf.min);

  //   if (this.conf.sticky) this.data.fromPosition = this.setSticky(this.data.fromPosition);
  //   this.calcValue('normal', this.data.fromPosition, 'min');
  //   this.notify('FromPosition', this.data, this.conf);
  // }

  // private calcToPosition() {
  //   this.data.toPosition = ((this.conf.to - this.conf.min) * 100)
  //     / (this.conf.max - this.conf.min);
  //   if (this.conf.sticky) this.data.toPosition = this.setSticky(this.data.toPosition);
  //   this.calcValue('normal', this.data.toPosition, 'max');
  //   this.notify('ToPosition', this.data, this.conf);
  // }

  // private calcScaleMarks() {
  //   const { scaleBase } = this.conf;
  //   const isStep = scaleBase === 'step';
  //   const oppositeType = isStep ? 'interval' : 'step';
  //   const step = isStep ? this.conf.step : (this.conf.max - this.conf.min) / this.conf.interval;
  //   const interval = isStep ? (this.conf.max - this.conf.min) /
  // this.conf.step : this.conf.interval;

  //   const stepArgument = interval % 1 === 0 ? String(interval) :
  // String(Math.trunc(interval + 1));
  //   const intervalArgument = step % 1 === 0 ? String(step) : String(step.toFixed(2));
  //   const argument = isStep ? stepArgument : intervalArgument;

  //   this.data.scaleBase = scaleBase;

  //   this.data.intervalValue = isStep ? argument : String(interval);
  //   this.data.stepValue = isStep ? String(this.conf.step) : argument;
  //   this.conf[oppositeType] = parseFloat(argument);

  //   this.data.marksArray = [{ value: this.conf.min, position: 0 }];
  //   let value = this.conf.min;

  //   for (let i = 0; i < interval; i += 1) {
  //     const object: IPluginConfigurationItem = { value: 0, position: 0 };
  //     value += step;
  //     if (value <= this.conf.max) {
  //       const position = ((value - this.conf.min) * 100)
  //         / (this.conf.max - this.conf.min);

  //       object.value = parseFloat(value.toFixed(2));
  //       object.position = position;
  //       this.data.marksArray.push(object);
  //     }
  //   }
  //   if (this.data.marksArray[this.data.marksArray.length - 1].value
  //     < this.conf.max) this.data.marksArray.push({ value: this.conf.max, position: 100 });
  //   this.notify('Scale', this.data, this.conf);
  // }

  // private calcValue(
  //   stopType: TControlStopTypes,
  //   position: number,
  //   movingControl: 'min' | 'max',
  // ) {
  //   if (this.changeMode) return;

  //   const stopTypes = {
  //     normal: (this.conf.min + ((this.conf.max
  //       - this.conf.min) * position) / 100).toFixed(0),
  //     min: String(this.conf.min),
  //     max: String(this.conf.max),
  //     meetMax: String(this.conf.to),
  //     meetMin: String(this.conf.from),
  //   };

  //   const newValue = stopTypes[stopType];

  //   if (movingControl === 'min') {
  //     this.data.fromValue = newValue;
  //     this.conf.from = parseFloat(newValue);
  //     this.notify('FromValue', this.data);
  //     return;
  //   }
  //   this.data.toValue = newValue;
  //   this.conf.to = parseFloat(newValue);
  //   this.notify('ToValue', this.data);
  // }
}

export default Model;
