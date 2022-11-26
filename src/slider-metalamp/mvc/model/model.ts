import {
  IConfFull,
  IConf,
  IObject,
  Imethods,
  IdataFull,
  TMoveTypes,
  TDirections,
} from '../interface';
import Observer from '../observer';
import {
  defaultConf,
  defaultData,
  defaultThumb,
} from '../utils';

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

  public calcPositionSetByPointer(
    data: {
      type: TMoveTypes,
      clientY: number,
      clientX: number,
      top: number,
      left: number,
      width: number,
      height: number,
      shiftBase: number,
      moovingControl: 'min' | 'max',
    },
  ) {
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
      newPosition = 100
        - (((clientY - top) * 100) / height);
    } else {
      let shift = 0;
      if (type === 'pointermove') {
        shift = (shiftBase * 100) / width;
      }

      newPosition = (((clientX - left) * 100) / width) - shift;
    }

    if (this.conf.sticky) {
      newPosition = this.setSticky(newPosition);
    }

    let isStop = false;
    if (newPosition < 0) {
      isStop = true;
      this.calcValue('min', 0, moovingControl);
      if (typeof this.onChange === 'function') {
        this.onChange(this.conf);
      }
      return 'newPosition < 0';
    }
    if (newPosition > 100) {
      isStop = true;
      this.calcValue('max', 0, moovingControl);
      if (typeof this.onChange === 'function') {
        this.onChange(this.conf);
      }
      return 'newPosition > 100';
    }

    if (this.conf.range) {
      if (moovingControl === 'min') {
        if (newPosition > this.data.toPosition) {
          isStop = true;
          this.calcValue('meetMax', 0, moovingControl);
          return 'newPosition > toPosition';
        }
      }
      if (moovingControl === 'max') {
        if (newPosition < this.data.fromPosition) {
          isStop = true;
          this.calcValue('meetMin', 0, moovingControl);
          return 'newPosition < fromPosition';
        }
      }
    }

    if (moovingControl === 'min') {
      this.data.fromPosition = newPosition;
      this.notify('FromPosition', this.data, this.conf);
    } else {
      this.data.toPosition = newPosition;
      this.notify('ToPosition', this.data, this.conf);
    }
    if (!isStop) { this.calcValue('normal', newPosition, moovingControl); }
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

    const changeFrom = (item: IObject) => {
      this.conf.from = item.value;
      this.data.fromPosition = item.position;
      this.data.fromValue = String(item.value);
      this.notify('FromPosition', this.data, this.conf);
      this.notify('FromValue', this.data);

      return { newValue: String(item.value), newPosition: item.position };
    };

    const changeTo = (item: IObject) => {
      this.conf.to = item.value;
      this.data.toPosition = item.position;
      this.data.toValue = String(item.value);
      this.notify('ToPosition', this.data, this.conf);
      this.notify('ToValue', this.data);
      return { newValue: String(item.value), newPosition: item.position };
    };

    const increment = (index: number) => {
      if (repeat) {
        return this.data.marksArray[index
          + this.conf.shiftOnKeyHold];
      }
      return this.data.marksArray[index
        + this.conf.shiftOnKeyDown];
    };

    const decrement = (index: number) => {
      if (repeat) {
        return this.data.marksArray[index
          - this.conf.shiftOnKeyHold];
      }
      return this.data.marksArray[index
        - this.conf.shiftOnKeyDown];
    };

    let newValue;
    let item;
    let result;

    if (!this.conf.sticky) {
      this.needCalcValue = false;
      if (moovingControl === 'min') {
        if (direction === 'ArrowRight' || direction === 'ArrowUp') {
          const belowMaxRange = this.conf.range && this.conf.from
            < this.conf.to;
          const belowMaxNoRange = !this.conf.range
            && this.conf.from < this.conf.max;
          const aboveMaxRange = this.conf.range
            && this.conf.from >= this.conf.to;
          const aboveMaxNoRange = !this.conf.range
            && this.conf.from >= this.conf.max;

          if (belowMaxRange || belowMaxNoRange) {
            newValue = repeat
              ? this.conf.from
              + this.conf.shiftOnKeyHold
              : this.conf.from
              + this.conf.shiftOnKeyDown;
            if (this.conf.range && newValue > this.conf.to) {
              newValue = this.conf.to;
            }
            if (!this.conf.range && newValue > this.conf.max) {
              newValue = this.conf.max;
            }
          }
          if (aboveMaxRange) {
            newValue = this.conf.to;
          }
          if (aboveMaxNoRange) {
            newValue = this.conf.max;
          }
        } else if (this.conf.from > this.conf.min) {
          newValue = repeat
            ? this.conf.from
            - this.conf.shiftOnKeyHold
            : this.conf.from
            - this.conf.shiftOnKeyDown;
          if (newValue < this.conf.min) {
            newValue = this.conf.min;
          }
        } else {
          newValue = this.conf.min;
        }

        this.data.fromValue = String(newValue);
        this.conf.from = Number(newValue);
        this.calcFromPosition();
        this.notify('FromValue', this.data);
        result = newValue;
      } else {
        if (direction === 'ArrowRight' || direction === 'ArrowUp') {
          if (this.conf.to < this.conf.max) {
            newValue = repeat
              ? this.conf.to
              + this.conf.shiftOnKeyHold
              : this.conf.to
              + this.conf.shiftOnKeyDown;
            if (newValue > this.conf.max) {
              newValue = this.conf.max;
            }
          } else newValue = this.conf.max;
        } else if (this.conf.to > this.conf.from) {
          newValue = repeat
            ? this.conf.to
            - this.conf.shiftOnKeyHold
            : this.conf.to
            - this.conf.shiftOnKeyDown;
          if (newValue < this.conf.from) {
            newValue = this.conf.from;
          }
        } else newValue = this.conf.from;

        this.data.toValue = String(newValue);
        this.conf.to = newValue;
        this.calcToPosition();
        this.notify('ToValue', this.data);
        result = newValue;
      }
      this.needCalcValue = true;
    } else if (moovingControl === 'min') {
      const index = this.data.marksArray
        .findIndex((elem) => elem.value === this.conf.from);
      if (direction === 'ArrowRight' || direction === 'ArrowUp') {
        item = increment(index);
        if (item === undefined) return 'newPosition>100';
        const isValueAscending = item.value > this.conf.from
          && ((this.conf.range && item.value <= this.conf.to)
            || (!this.conf.range && item.value
              <= this.conf.max));
        if (isValueAscending) {
          result = changeFrom(item);
        } else result = 'too big newPosition';
      } else {
        item = decrement(index);
        if (item === undefined) return 'newPosition<0';
        const isValueDescending = (this.conf.range && item.value < this.conf.to)
          || !this.conf.range;
        if (isValueDescending) {
          result = changeFrom(item);
        } else result = 'too small newPosition';
      }
    } else {
      const index = this.data.marksArray
        .findIndex((elem) => elem.value === this.conf.to);
      if (direction === 'ArrowRight' || direction === 'ArrowUp') {
        item = increment(index);
        if (item === undefined) return 'newPosition>100';
        const isValueAscending = item && item.value > this.conf.to
          && this.conf.to < this.conf.max;
        if (isValueAscending) {
          result = changeTo(item);
        } else result = 'too big newPosition';
      } else {
        item = decrement(index);
        if (item === undefined) return 'newPosition<0';
        if (item.value >= this.conf.from
          && this.conf.to > this.conf.from) {
          result = changeTo(item);
        } else result = 'too small newPosition';
      }
    }
    if (typeof this.onChange === 'function') {
      this.onChange(this.conf);
    }
    return result;
  }

  static checkConf(config: IConfFull) {
    let conf = config;
    const validateNumber = (value: any) => (Number.isNaN(+value) ? 0 : +value);
    const validateBoolean = (value: any) => value === true || value === 'true';

    const numbers = ['min', 'max', 'from', 'to', 'step', 'interval', 'shiftOnKeyDown', 'shiftOnKeyHold'];
    const booleans = ['vertical', 'range', 'sticky', 'scale', 'bar', 'tip'];

    const temporaryArray = Object.entries(conf);

    const validatePropertyValue = (
      key: string,
      value: string | number | boolean | Function,
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
        return true;
      }
      if (booleans.includes(key)) {
        validatePropertyValue(key, value, validateBoolean);
        return true;
      }
      return true;
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

  public update(newConf: IConf) {
    let conf = { ...this.conf, ...newConf };

    conf = Model.checkConf(conf);

    this.findChangedConf(this.conf, conf);
    this.conf = conf;
    const keys = Object.keys(this.methods);

    keys.forEach((element) => {
      const key = element as keyof Imethods;
      if (this.methods[key]) {
        this[key]();
      }
    });

    if (typeof this.onUpdate === 'function') {
      this.onUpdate(this.conf);
    }

    keys.forEach((element) => {
      const key = element as keyof Imethods;
      if (this.methods[key]) {
        this.methods[key] = false;
      }
    });
    this.needCalcValue = true;
    return { ...this.conf, ...this.data };
  }

  private findChangedConf(currentConf: IConfFull, newConf: IConf) {
    const keys = Object.keys(newConf);
    keys.forEach((element) => {
      const key = element as keyof IConf;
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
          default: return true;
        }
      }
      return true;
    });
    return this.methods;
  }

  private async switchVertical() {
    await this.notify('IsVertical', this.data, this.conf);
    this.calcFromPosition();
    this.calcToPosition();
    this.calcScaleMarks();
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
    stopType: 'normal' | 'min' | 'max' | 'meetMin' | 'meetMax',
    position: number,
    moovingControl: 'min' | 'max',
  ) {
    const stopTypes = {
      normal: (this.conf.min + ((this.conf.max
        - this.conf.min) * position) / 100).toFixed(0),
      min: String(this.conf.min),
      max: String(this.conf.max),
      meetMax: String(this.conf.to),
      meetMin: String(this.conf.from),
    };
    if (!this.changeMode) {
      const newValue = stopTypes[stopType];

      if (moovingControl === 'min') {
        this.data.fromValue = newValue;
        this.conf.from = parseFloat(newValue);
        this.notify('FromValue', this.data);
      } else {
        this.data.toValue = newValue;
        this.conf.to = parseFloat(newValue);
        this.notify('ToValue', this.data);
      }
    }
  }
}

export default Model;
