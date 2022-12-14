import {
  defaultConf,
  defaultData,
  defaultThumb,
} from '../utils';
import Observer from '../observer';
import {
  IConfFull,
  IConf,
  IObject,
  Imethods,
  IdataFull,
  TDirections,
  TValueType,
  IData,
  TStopType,
  INewObject,
} from '../interface';

class Model extends Observer {
  public conf: IConfFull;

  private changeMode: boolean = false;

  private startConf: IConf;

  private dataAttributesConf: IConf = {};

  private methods: Imethods;

  private data: IdataFull;

  private onStart?: (data: IConf) => unknown | null;

  private onUpdate?: (data: IConf) => unknown | null;

  private onChange?: (data: IConf) => unknown | null;

  private needCalcValue: boolean;

  constructor(conf: IConf) {
    super();
    this.conf = defaultConf;
    this.data = {
      ...defaultData, thumb: { ...defaultThumb },
    };

    this.methods = {
      calcFromPosition: false,
      calcToPosition: false,
      calcScaleMarks: false,
      switchVertical: false,
      switchRange: false,
      switchScale: false,
      switchBar: false,
      switchTip: false,
      updateControlPos: false,
    };
    this.startConf = conf;
    this.needCalcValue = true;
  }

  /* метод Object.keys возвращает тип string[] (см. https://github.com/Microsoft/TypeScript/issues/12870),
  поэтому элементы массива не могут использоваться в качестве индекса в записи вида
  this.methods[key].   Чтобы преобразовать тип string[] к типу объединения значений
  ключей объекта ('key1' | 'key2' | 'key3'... используем метод Model.getKeys) */

  static getKeys = <T extends object>(obj: T): (keyof T)[] => Object.keys(obj) as (keyof T)[];

  static checkConf(config: IConfFull) {
    let conf = config;

    const validateNumber = (value: TValueType) => (Number.isNaN(+value) ? 0 : +value);
    const validateBoolean = (value: TValueType) => value === true || value === 'true';

    const numbers = ['min', 'max', 'from', 'to', 'step', 'interval', 'shiftOnKeyDown', 'shiftOnKeyHold'];
    const booleans = ['vertical', 'range', 'sticky', 'scale', 'bar', 'tip'];

    const temporaryArray = Object.entries(conf);

    const validatePropertyValue = (
      key: string,
      value: TValueType,
      validationFunction: typeof validateNumber | typeof validateBoolean,
    ) => {
      const checkedValue = validationFunction(value);
      const obj = { [key]: checkedValue };
      conf = {
        ...conf, ...obj,
      };
    };

    temporaryArray.forEach((element) => {
      const [key, value] = element;
      if (numbers.includes(key)) {
        validatePropertyValue(key, value, validateNumber);
      }
      if (booleans.includes(key)) {
        validatePropertyValue(key, value, validateBoolean);
      }
    });

    const checkValue = (type: string, value: number) => {
      if (value <= 0) {
        switch (type) {
          case 'step':
            return (conf.max - conf.min) / 2;
          case 'interval':
            return 2;
          default:
            return 1;
        }
      }
      return value;
    };

    const checkMax = () => {
      if (conf.max <= conf.min) {
        return conf.min + 10;
      }
      return conf.max;
    };

    const checkFrom = () => {
      if (conf.max <= conf.min) {
        return conf.min;
      }
      if (conf.from < conf.min) {
        return conf.min;
      }
      if (conf.from > conf.max) {
        return conf.range ? conf.to - 10 : conf.max;
      }
      if (conf.range && conf.from > conf.to) {
        return conf.min;
      }
      return conf.from;
    };

    const checkTo = () => {
      if (conf.max <= conf.min) {
        return conf.min + 10;
      }
      if (conf.to < conf.min) {
        return conf.from;
      }
      if (conf.to > conf.max) {
        return conf.range ? conf.max : conf.from;
      }
      return conf.to;
    };

    const checkScaleBase = () => {
      if (conf.scaleBase !== 'step' && conf.scaleBase !== 'interval') {
        return 'step';
      }
      return conf.scaleBase;
    };
    conf.scaleBase = checkScaleBase();
    conf.shiftOnKeyDown = checkValue('shiftOnKeyDown', conf.shiftOnKeyDown);
    conf.shiftOnKeyHold = checkValue('shiftOnKeyHold', conf.shiftOnKeyHold);
    conf.max = checkMax();
    conf.to = checkTo();
    conf.from = checkFrom();
    conf.step = checkValue('step', conf.step);
    conf.interval = checkValue('interval', conf.interval);
    return conf;
  }

  public getConf(conf: IConf) {
    this.dataAttributesConf = conf;
    const joinedConf = { ...this.conf, ...this.startConf, ...this.dataAttributesConf };
    this.conf = Model.checkConf(joinedConf);
    return this.conf;
  }

  public start() {
    this.onStart = this.conf.onStart;
    this.onUpdate = this.conf.onUpdate;
    this.onChange = this.conf.onChange;
    this.calcScaleMarks();
    this.calcFromPosition();
    this.calcToPosition();
    if (typeof this.onStart === 'function') {
      this.onStart(this.conf);
    }
  }

  public getData() {
    return this.conf;
  }

  public update(newConf: IConf) {
    let conf = { ...this.conf, ...newConf };

    conf = Model.checkConf(conf);

    this.findChangedConf(this.conf, conf);
    this.conf = conf;
    const keys = Model.getKeys(this.methods);

    keys.forEach((element) => {
      const key = element;
      if (this.methods[key]) {
        this[key]();
      }
    });

    if (typeof this.onUpdate === 'function') {
      this.onUpdate(this.conf);
    }

    keys.forEach((element) => {
      const key = element;
      if (this.methods[key]) {
        this.methods[key] = false;
      }
    });
    this.needCalcValue = true;
    return { ...this.conf, ...this.data };
  }

  public calcPositionSetByPointer(data: IData) {
    const {
      type,
      clientY,
      clientX,
      top,
      left,
      width,
      height,
      shiftBase,
      moovingControl,
    } = data;

    let newPosition = 0;
    if (this.conf.vertical) {
      newPosition = 100 - (((clientY - top) * 100) / height);
    } else {
      const shift = (type === 'pointermove') ? (shiftBase * 100) / width : 0;
      newPosition = (((clientX - left) * 100) / width) - shift;
    }

    if (this.conf.sticky) {
      newPosition = this.setSticky(newPosition);
    }

    let isStop = false;
    const updatePosition = (returnValue = '', needChange = false, stopType: TStopType = 'min') => {
      isStop = true;
      this.calcValue(stopType, 0, moovingControl);
      if (needChange && typeof this.onChange === 'function') {
        this.onChange(this.conf);
      }
      return returnValue;
    };

    if (newPosition < 0) {
      return updatePosition('newPosition < 0', true);
    }

    if (newPosition > 100) {
      return updatePosition('newPosition > 100', true, 'max');
    }

    const isBeyondToPosition = this.conf.range && moovingControl === 'min' && newPosition > this.data.toPosition;
    if (isBeyondToPosition) {
      return updatePosition('newPosition > toPosition', false, 'meetMax');
    }

    const isBelowFromPosition = this.conf.range && moovingControl === 'max' && newPosition < this.data.fromPosition;
    if (isBelowFromPosition) {
      return updatePosition('newPosition < fromPosition', false, 'meetMin');
    }

    if (moovingControl === 'min') {
      this.data.fromPosition = newPosition;
      this.notify('FromPosition', this.data, this.conf);
    } else {
      this.data.toPosition = newPosition;
      this.notify('ToPosition', this.data, this.conf);
    }
    if (!isStop) {
      this.calcValue('normal', newPosition, moovingControl);
    }
    if (typeof this.onChange === 'function') {
      this.onChange(this.conf);
    }
    return newPosition;
  }

  public calcPositionSetByKey(data:
  {
    direction: TDirections,
    repeat: boolean,
    moovingControl: 'min' | 'max',
  }) {
    const { direction, repeat, moovingControl } = data;

    const isIncreasing = direction === 'ArrowRight' || direction === 'ArrowUp';
    const isDecreasing = direction === 'ArrowLeft' || direction === 'ArrowDown';

    const isMin = moovingControl === 'min';
    const isMax = moovingControl === 'max';

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

    if (isMinIncreasingNoSticky) {
      return this.getNewValueNoSticky('MinIncreasingNoSticky', repeat);
    }

    if (isMinDecreasingNoSticky) {
      return this.getNewValueNoSticky('MinDecreasingNoSticky', repeat);
    }

    if (isMaxIncreasingNoSticky) {
      return this.getNewValueNoSticky('MaxIncreasingNoSticky', repeat);
    }

    if (isMaxDecreasingNoSticky) {
      return this.getNewValueNoSticky('MaxDecreasingNoSticky', repeat);
    }

    const value = moovingControl === 'min' ? this.conf.from : this.conf.to;
    const index = this.data.marksArray.findIndex((elem) => elem.value === value);
    const shift = this.getShift(repeat);
    const indexToSearch = isIncreasing ? index + shift : index - shift;
    const item = this.data.marksArray[indexToSearch];

    if (isMinIncreasingSticky) {
      return this.getNewValueSticky('MinIncreasingSticky', item);
    }

    if (isMinDecreasingSticky) {
      return this.getNewValueSticky('MinDecreasingSticky', item);
    }

    if (isMaxIncreasingSticky) {
      return this.getNewValueSticky('MaxIncreasingSticky', item);
    }

    if (isMaxDecreasingSticky) {
      return this.getNewValueSticky('MaxDecreasingSticky', item);
    }

    return null;
  }

  private calcControlPosition(res: number, isControlFrom = true) {
    if (isControlFrom) {
      this.data.fromValue = String(res);
      this.conf.from = res;
      this.calcFromPosition();
      this.notify('FromValue', this.data);
    } else {
      this.data.toValue = String(res);
      this.conf.to = res;
      this.calcToPosition();
      this.notify('ToValue', this.data);
    }
    return this.triggerControlPositionChange(res);
  }

  private triggerControlPositionChange = (result: number | string | INewObject) => {
    if (typeof this.onChange === 'function') {
      this.onChange(this.conf);
    }
    return result;
  };

  private getShift(isRepeating: boolean) {
    return isRepeating ? this.conf.shiftOnKeyHold : this.conf.shiftOnKeyDown;
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
      if (isAboveMaxRange) {
        newValue = this.conf.to;
      }
      if (isAboveMaxNoRange) {
        newValue = this.conf.max;
      }
      return this.calcControlPosition(newValue);
      }

      case 'MinDecreasingNoSticky':
      { let newValue = 0;
        if (this.conf.from > this.conf.min) {
          newValue = this.conf.from - shift;
          newValue = newValue < this.conf.min ? this.conf.min : newValue;
        } else {
          newValue = this.conf.min;
        }
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

  private getNewValueSticky(condition: string, item: IObject) {

    const changeFrom = (values: IObject) => {
      this.conf.from = values.value;
      this.data.fromPosition = values.position;
      this.data.fromValue = String(values.value);
      this.notify('FromPosition', this.data, this.conf);
      this.notify('FromValue', this.data);
      return { newValue: String(values.value), newPosition: values.position };
    };

    const changeTo = (values: IObject) => {
      this.conf.to = values.value;
      this.data.toPosition = values.position;
      this.data.toValue = String(values.value);
      this.notify('ToPosition', this.data, this.conf);
      this.notify('ToValue', this.data);
      return { newValue: String(values.value), newPosition: values.position };
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
        return this.triggerControlPositionChange(result);
      }

      case 'MinDecreasingSticky':
      {
        if (item === undefined) return 'newPosition<0';
        const isValueDescending = (this.conf.range && item.value < this.conf.to)
          || !this.conf.range;
        const result = isValueDescending ? changeFrom(item) : 'too small newPosition';
        return this.triggerControlPositionChange(result);
      }

      case 'MaxIncreasingSticky':
      {
        if (item === undefined) return 'newPosition>100';
        const isValueAscending = item && item.value > this.conf.to
          && this.conf.to < this.conf.max;
        const result = isValueAscending ? changeTo(item) : 'too big newPosition';
        return this.triggerControlPositionChange(result);
      }

      case 'MaxDecreasingSticky':
      {
        if (item === undefined) return 'newPosition<0';
        const isValueDescending = item.value >= this.conf.from
        && this.conf.to > this.conf.from;
        const result = isValueDescending ? changeTo(item) : 'too small newPosition';
        return this.triggerControlPositionChange(result);
      }
      default: return 0;
    }
  }

  private findChangedConf(currentConf: IConfFull, newConf: IConf) {
    const keys = Model.getKeys(newConf);
    keys.forEach((element) => {
      const key = element;
      if (newConf[key] !== currentConf[key]) {
        switch (key) {
          case 'min':
          case 'max':
            this.needCalcValue = true;
            this.methods.calcScaleMarks = true;
            this.methods.calcFromPosition = true;
            this.methods.calcToPosition = true;
            break;
          case 'from':
            this.methods.calcFromPosition = true;
            break;
          case 'to':
            this.methods.calcToPosition = true;
            break;
          case 'step':
          case 'interval':
            this.methods.calcScaleMarks = true;
            this.methods.updateControlPos = true;
            break;
          case 'scaleBase':
            this.methods.calcScaleMarks = true;
            break;
          case 'vertical':
            this.methods.switchVertical = true;
            break;
          case 'range':
            this.methods.switchRange = true;
            break;
          case 'scale':
            this.methods.switchScale = true;
            break;
          case 'bar':
            this.methods.switchBar = true;
            break;
          case 'tip':
            this.methods.switchTip = true;
            break;
          case 'sticky':
            this.methods.updateControlPos = true;
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
              this.onChange = newConf.onChange;
            }
            break;
          case 'onUpdate':
            if (newConf.onUpdate) {
              this.conf.onUpdate = newConf.onUpdate;
              this.onUpdate = newConf.onUpdate;
            }
            break;
          default: return null;
        }
      }
      return null;
    });
    return this.methods;
  }

  private switchVertical() {
    this.notify('IsVertical', this.data, this.conf);

    /* Особый вариант использования: setTimeout(func, 0) или просто setTimeout(func).
    Это планирует вызов func настолько быстро, насколько это возможно.
    Но планировщик будет вызывать функцию только после завершения выполнения текущего кода.
    https://learn.javascript.ru/settimeout-setinterval */

    setTimeout(() => {
      this.calcFromPosition();
      this.calcToPosition();
      this.calcScaleMarks();
    });
  }

  private switchRange() {
    this.notify('IsRange', this.data, this.conf);
    if (typeof this.onChange === 'function') {
      this.onChange(this.conf);
    }
  }

  private updateControlPos() {
    this.calcFromPosition();
    this.calcToPosition();
    if (typeof this.onChange === 'function') {
      this.onChange(this.conf);
    }
    this.notify('IsSticky', this.data, this.conf);
  }

  private switchScale() {
    this.notify('IsScale', this.data, this.conf);
  }

  private switchBar() {
    this.notify('IsBar', this.data, this.conf);
  }

  private switchTip() {
    this.notify('IsTip', this.data, this.conf);
  }

  private setSticky(controlPosition: number) {
    let goal = this.data.marksArray.find((element: IObject, item: number, array: IObject[]) => {
      let temporaryPosition = 0;
      if (item < array.length - 1) {
        temporaryPosition = array[item + 1].position;
      }
      return Math.abs(controlPosition - element.position)
        < Math.abs(controlPosition - temporaryPosition);
    });

    if (!goal) {
      goal = { value: 0, position: 0 };
    }
    return goal.position;
  }

  private calcFromPosition() {
    this.data.fromPosition = ((this.conf.from
      - this.conf.min) * 100)
      / (this.conf.max - this.conf.min);

    if (this.conf.sticky) {
      this.data.fromPosition = this.setSticky(this.data.fromPosition);
    }
    if (this.needCalcValue) {
      this.calcValue('normal', this.data.fromPosition, 'min');
    }
    this.notify('FromPosition', this.data, this.conf);
  }

  private calcToPosition() {
    this.data.toPosition = ((this.conf.to - this.conf.min) * 100)
      / (this.conf.max - this.conf.min);
    if (this.conf.sticky) {
      this.data.toPosition = this.setSticky(this.data.toPosition);
    }
    if (this.needCalcValue) {
      this.calcValue('normal', this.data.toPosition, 'max');
    }
    this.notify('ToPosition', this.data, this.conf);
  }

  private calcScaleMarks() {
    let interval = 1;
    let step = 1;
    if (this.conf.scaleBase === 'step') {
      step = this.conf.step;
      interval = (this.conf.max - this.conf.min) / step;
      const argument = interval % 1 === 0 ? String(interval)
        : String(Math.trunc(interval + 1));
      this.data.scaleBase = 'step';
      this.data.intervalValue = argument;
      this.data.stepValue = String(this.conf.step);
      this.conf.interval = parseFloat(argument);
    }

    if (this.conf.scaleBase === 'interval') {
      interval = this.conf.interval;
      step = (this.conf.max - this.conf.min) / interval;
      const argument = step % 1 === 0 ? String(step)
        : String(step.toFixed(2));
      this.data.scaleBase = 'interval';
      this.data.intervalValue = String(interval);
      this.data.stepValue = argument;
      this.conf.step = parseFloat(argument);
    }

    this.data.marksArray = [{ value: this.conf.min, position: 0 }];
    let value = this.conf.min;

    for (let i = 0; i < interval; i += 1) {
      const object: IObject = { value: 0, position: 0 };
      value += step;
      if (value <= this.conf.max) {
        const position = ((value - this.conf.min) * 100)
          / (this.conf.max - this.conf.min);

        object.value = parseFloat(value.toFixed(2));
        object.position = position;
        this.data.marksArray.push(object);
      }
    }
    if (this.data.marksArray[this.data.marksArray.length - 1].value
      < this.conf.max) {
      this.data.marksArray.push({ value: this.conf.max, position: 100 });
    }
    this.notify('Scale', this.data, this.conf);
  }

  private calcValue(
    stopType: TStopType,
    position: number,
    moovingControl: 'min' | 'max',
  ) {
    if (this.changeMode) {
      return;
    }

    const stopTypes = {
      normal: (this.conf.min + ((this.conf.max
        - this.conf.min) * position) / 100).toFixed(0),
      min: String(this.conf.min),
      max: String(this.conf.max),
      meetMax: String(this.conf.to),
      meetMin: String(this.conf.from),
    };

    const newValue = stopTypes[stopType];

    if (moovingControl === 'min') {
      this.data.fromValue = newValue;
      this.conf.from = parseFloat(newValue);
      this.notify('FromValue', this.data);
      return;
    }
    this.data.toValue = newValue;
    this.conf.to = parseFloat(newValue);
    this.notify('ToValue', this.data);
  }
}

export default Model;
