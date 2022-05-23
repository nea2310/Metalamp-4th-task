import {
  IConfFull,
  IConf,
  IObject,
  Imethods,
  IdataFull,
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

  private backEndConf: IConf = {};

  private methods: Imethods;

  private data: IdataFull;

  private onStart?: Function | null;

  private onUpdate?: Function | null;

  private onChange?: Function | null;

  private needCalcValue: boolean;

  constructor(conf: IConf) {
    super();
    // дефолтный конфиг
    this.conf = defaultConf;
    this.data = {
      ...defaultData, thumb: { ...defaultThumb },
    };

    this.methods = {
      calcFromPosition: false,
      calcToPosition: false,
      calcScaleMarks: false,
      calcBarLength: false,
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
    this.backEndConf = conf;
    const joinedConf = { ...this.conf, ...this.startConf, ...this.backEndConf };
    // проверим корректность полученных параметров конфигурации и при необходимости - исправим
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
    this.calcBarLength();
    if (typeof this.onStart === 'function') {
      this.onStart(this.conf);
    }
  }

  public getData() {
    return this.conf;
  }

  /* Рассчитываем положение ползунка при возникновении события перетягивания ползунка или
  щелчка по шкале */
  public calcPos(
    data: {
      type: string,
      clientY: number,
      clientX: number,
      top: number,
      left: number,
      width: number,
      height: number,
      shiftBase: number,
      moovingControl: string,
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

    /* если ползунок должен вставать на позицию ближайшего к нему деления шкалы - скорректировать
     значение newPosition (переместить ползунок
    к ближайшему делению шкалы) */
    if (this.conf.sticky) {
      newPosition = this.setSticky(newPosition);
    }

    let isStop = false;
    // запрещаем ползункам выходить за границы слайдера
    if (newPosition < 0) {
      isStop = true;
      this.calcVal('min', 0, moovingControl);
      return 'newPosition < 0';
    }
    if (newPosition > 100) {
      isStop = true;
      this.calcVal('max', 0, moovingControl);
      return 'newPosition > 100';
    }

    /* запрещаем ползункам перепрыгивать друг через друга, если это не single режим */
    if (this.conf.range) {
      if (moovingControl === 'min') { // двигается min ползунок
        if (newPosition > this.data.toPosition) {
          isStop = true;
          this.calcVal('meetMax', 0, moovingControl);
          return 'newPosition > toPosition';
        }
      }
      if (moovingControl === 'max') { // двигается max ползунок
        if (newPosition < this.data.fromPosition) {
          isStop = true;
          this.calcVal('meetMin', 0, moovingControl);
          return 'newPosition < fromPosition';
        }
      }
    }

    if (moovingControl === 'min') {
      this.data.fromPosition = newPosition;
      this.fire('FromPosition', this.data, this.conf);
    } else {
      this.data.toPosition = newPosition;
      this.fire('ToPosition', this.data, this.conf);
    }
    if (!isStop) { this.calcVal('normal', newPosition, moovingControl); }

    this.calcBarLength();
    if (typeof this.onChange === 'function') {
      this.onChange(this.conf);
    }
    return newPosition;
  }

  // Рассчитывает значение ползунка при нажатии кнопки стрелки на сфокусированном ползунке
  public calcPosKey(data:
    {
      key: string,
      repeat: boolean,
      moovingControl: string
    }) {
    const { key, repeat, moovingControl } = data;
    // поменять позицию и значение FROM
    const changeFrom = (item: IObject) => {
      this.conf.from = item.value;
      this.data.fromPosition = item.position;
      this.data.fromValue = String(item.value);
      this.fire('FromPosition', this.data);
      this.fire('FromValue', this.data);

      return { newValue: String(item.value), newPosition: item.position };
    };
    // поменять позицию и значение TO
    const changeTo = (item: IObject) => {
      this.conf.to = item.value;
      this.data.toPosition = item.position;
      this.data.toValue = String(item.value);
      this.fire('ToPosition', this.data);
      this.fire('ToValue', this.data);
      return { newValue: String(item.value), newPosition: item.position };
    };
    // движение в большую сторону
    const incr = (index: number) => {
      if (repeat) {
        return this.data.marksArr[index
          + this.conf.shiftOnKeyHold];
      }
      return this.data.marksArr[index
        + this.conf.shiftOnKeyDown];
    };
    // движение в меньшую сторону
    const decr = (index: number) => {
      if (repeat) {
        return this.data.marksArr[index
          - this.conf.shiftOnKeyHold];
      }
      return this.data.marksArr[index
        - this.conf.shiftOnKeyDown];
    };

    let newValue;
    let item;
    let result;
    // если ползунок НЕ должен вставать на позицию ближайшего к нему деления шкалы
    if (!this.conf.sticky) {
      this.needCalcValue = false;
      if (moovingControl === 'min') { // Ползунок min
        if (key === 'ArrowRight' || key === 'ArrowUp') { // Увеличение значения
          /* проверяем, что FROM не стал больше TO или MAX */
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
          // Уменьшение значения
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
        this.fire('FromValue', this.data);
        result = newValue;
      } else { // Ползунок max
        if (key === 'ArrowRight' || key === 'ArrowUp') { // Увеличение значения
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
          // Уменьшение значения
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
        this.fire('ToValue', this.data);
        result = newValue;
      }
      this.needCalcValue = true;
      // если ползунок должен вставать на позицию ближайшего к нему деления шкалы
    } else if (moovingControl === 'min') { // ползунок min
      const index = this.data.marksArr
        .findIndex((elem) => elem.value === this.conf.from);
      if (key === 'ArrowRight' || key === 'ArrowUp') { // Увеличение значения
        item = incr(index);
        if (item === undefined) return 'newPosition>100';
        const cond = item.value > this.conf.from
          && ((this.conf.range && item.value <= this.conf.to)
            || (!this.conf.range && item.value
              <= this.conf.max));
        if (cond) {
          result = changeFrom(item);
        } else result = 'too big newPosition';
      } else { // Уменьшение значения
        item = decr(index);
        if (item === undefined) return 'newPosition<0';
        const cond = (this.conf.range && item.value < this.conf.to)
          || !this.conf.range;
        if (cond) {
          result = changeFrom(item);
        } else result = 'too small newPosition';
      }
    } else { // ползунок max
      const index = this.data.marksArr
        .findIndex((elem) => elem.value === this.conf.to);
      if (key === 'ArrowRight' || key === 'ArrowUp') { // Увеличение значения
        item = incr(index);
        if (item === undefined) return 'newPosition>100';
        const cond = item && item.value > this.conf.to
          && this.conf.to < this.conf.max;
        if (cond) {
          result = changeTo(item);
        } else result = 'too big newPosition';
      } else { // Уменьшение значения
        item = decr(index);
        if (item === undefined) return 'newPosition<0';
        if (item.value >= this.conf.from
          && this.conf.to > this.conf.from) {
          result = changeTo(item);
        } else result = 'too small newPosition';
      }
    }
    this.calcBarLength();
    if (typeof this.onChange === 'function') {
      this.onChange(this.conf);
    }
    return result;
  }

  static checkConf(config: IConfFull) {
    // надо проверять на число те параметры, которые вводятся в инпут (т.к. можно ввести строку)
    const conf = config;
    const validNumber = (value: any) => {
      let result = 0;
      if (!Number.isNaN(+value)) {
        result = +value;
      }
      return result;
    };

    const validBoolean = (value: any) => {
      let result = false;
      if (value === true || value === 'true') {
        result = true;
      }
      return result;
    };

    conf.min = validNumber(conf.min);
    conf.max = validNumber(conf.max);
    conf.from = validNumber(conf.from);
    conf.to = validNumber(conf.to);
    conf.step = validNumber(conf.step);
    conf.interval = validNumber(conf.interval);
    conf.shiftOnKeyDown = validNumber(conf.shiftOnKeyDown);
    conf.shiftOnKeyHold = validNumber(conf.shiftOnKeyHold);

    conf.vertical = validBoolean(conf.vertical);
    conf.range = validBoolean(conf.range);
    conf.sticky = validBoolean(conf.sticky);
    conf.scale = validBoolean(conf.scale);
    conf.bar = validBoolean(conf.bar);
    conf.tip = validBoolean(conf.tip);

    if (conf.scaleBase !== 'step' && conf.scaleBase !== 'interval') {
      conf.scaleBase = 'step';
    }

    if (conf.shiftOnKeyDown <= 0) {
      conf.shiftOnKeyDown = 1;
    }
    if (conf.shiftOnKeyHold <= 0) {
      conf.shiftOnKeyHold = 1;
    }

    if (conf.max <= conf.min) {
      conf.max = conf.min + 10;
      conf.from = conf.min;
      conf.to = conf.max;
    }
    if (conf.from < conf.min) {
      conf.from = conf.min;
    }

    if (conf.to < conf.min) {
      conf.to = conf.from;
    }
    if (!conf.range && conf.to > conf.max) {
      conf.to = conf.from;
    }

    if (conf.range && conf.to > conf.max) {
      conf.to = conf.max;
    }
    if (conf.range && conf.from > conf.max) {
      conf.from = conf.to;
    }

    if (!conf.range && conf.from > conf.max) {
      conf.from = conf.max;
    }
    if (conf.range && conf.from > conf.to) {
      conf.from = conf.min;
    }

    if (conf.step <= 0) {
      conf.step = (conf.max - conf.min) / 2;
    }
    if (conf.interval <= 0) {
      conf.interval = 2;
    }
    return conf;
  }

  public update(newConf: IConf) {
    let conf = { ...this.conf, ...newConf };
    // проверим корректность полученных параметров конфигурации и при необходимости - исправим
    conf = Model.checkConf(conf);
    /* определим, какие параметры изменились, и какие методы в модели надо вызвать для
    пересчета значений */
    // для этого сравним this.conf (текущая конфигурация) и conf (новая конфигурация)
    this.findChangedConf(this.conf, conf);
    this.conf = conf;
    // запустим методы, для которых есть изменившиеся параметры
    const keys = Object.keys(this.methods);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i] as keyof Imethods;
      if (this.methods[key]) {
        this[key]();
      }
    }

    if (typeof this.onUpdate === 'function') {
      this.onUpdate(this.conf);
    }

    // вернем исходные значения (false)
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i] as keyof Imethods;
      if (this.methods[key]) {
        this.methods[key] = false;
      }
    }
    this.needCalcValue = true;

    return Object.assign(this.conf, this.data);
  }

  /* находим изменившийся параметр и меняем соотв-щее св-во объекта this.methods;
  это нужно, чтобы не выполнять одни и те же
  действия несколько раз, если получаем несколько параметров, требующих запуска
  одного и того же метода в модели */
  private findChangedConf(currentConf: IConfFull, newConf: IConf) {
    const keys = Object.keys(newConf);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i] as keyof IConf;
      if (newConf[key] !== currentConf[key]) {
        switch (key) {
          case 'min':
            this.needCalcValue = true;
            this.methods.calcScaleMarks = true;
            this.methods.calcFromPosition = true;
            this.methods.calcToPosition = true;
            this.methods.calcBarLength = true;
            break;
          case 'max':
            this.needCalcValue = true;
            this.methods.calcScaleMarks = true;
            this.methods.calcFromPosition = true;
            this.methods.calcToPosition = true;
            this.methods.calcBarLength = true;
            break;
          case 'from':
            this.methods.calcFromPosition = true;
            this.methods.calcBarLength = true;
            break;
          case 'to':
            this.methods.calcToPosition = true;
            this.methods.calcBarLength = true;
            break;
          case 'step':
            this.methods.calcScaleMarks = true;
            this.methods.updateControlPos = true;
            break;
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
            if (newConf.onChange) {
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
    }
    return this.methods;
  }

  private async switchVertical() {
    await this.fire('IsVertical', this.data, this.conf);
    await this.calcFromPosition();
    await this.calcToPosition();
    await this.calcBarLength();
    await this.calcScaleMarks();
  }

  private async switchRange() {
    await this.fire('IsRange', this.data, this.conf);
    await this.calcBarLength();
    if (typeof this.onChange === 'function') {
      await this.onChange(this.conf);
    }
    /* onChange нужен т.к. после проверки перед возвратом в double режим могут поменяться
    значения from / to, их нужно отдать наружу */
  }

  private async updateControlPos() {
    await this.calcFromPosition();
    await this.calcToPosition();
    await this.calcBarLength();
    if (typeof this.onChange === 'function') {
      await this.onChange(this.conf);
    }
    /* onChange нужен т.к. после проверки  могут поменяться значения from / to / min
     / max, их нужно отдать наружу */
    await this.fire('IsSticky', this.data, this.conf);
  }

  private switchScale() {
    this.fire('IsScale', this.data, this.conf);
  }

  private switchBar() {
    this.fire('IsBar', this.data, this.conf);
  }

  private switchTip() {
    this.fire('IsTip', this.data, this.conf);
  }

  // корректирует позицию ползунка, устанавливает его на ближайшее деление шкалы при sticky режиме
  private setSticky(controlPos: number) {
    /* Перебираем массив с позициями и значениями делений шкалы и вычитаем позицию деления из
    значения newPosition до тех пор, пока результат текущей итерации не станет больше результата
    предыдущей (это значит, что мы нашли деление,
  ближайшее к позиции ползунка и ползунок надо переместить на позицию этого деления */
    let position = 0;
    for (let i = 0; i < this.data.marksArr.length; i += 1) {
      let a = 0;
      if (i < this.data.marksArr.length - 1) {
        a = this.data.marksArr[i + 1].position;
      }
      if (Math.abs(controlPos - this.data.marksArr[i].position)
        < Math.abs(controlPos - a)) {
        position = this.data.marksArr[i].position;
        break;
      }
    }
    return position;
  }

  // рассчитать позицию From (%) на основании значений from, min и max
  private calcFromPosition() {
    this.data.fromPosition = ((this.conf.from
      - this.conf.min) * 100)
      / (this.conf.max - this.conf.min);

    /* если ползунок должен вставать на позицию ближайшего к нему деления шкалы -
    скорректировать значение newPosition (переместить ползунок
    к ближайшему делению шкалы) */
    if (this.conf.sticky) {
      this.data.fromPosition = this.setSticky(this.data.fromPosition);
    }
    if (this.needCalcValue) {
      this.calcVal('normal', this.data.fromPosition, 'min');
    }
    this.fire('FromPosition', this.data, this.conf);
  }

  // рассчитать позицию To (%) на основании значений to, min и max
  private calcToPosition() {
    this.data.toPosition = ((this.conf.to - this.conf.min) * 100)
      / (this.conf.max - this.conf.min);
    if (this.conf.sticky) {
      this.data.toPosition = this.setSticky(this.data.toPosition);
    }
    if (this.needCalcValue) {
      this.calcVal('normal', this.data.toPosition, 'max');
    }
    this.fire('ToPosition', this.data, this.conf);
  }

  /* Рассчитываем ширину и позицию left (top) прогресс-бара */
  private calcBarLength() {
    if (this.conf.range) { // режим Double
      this.data.barPos = this.data.fromPosition;
      this.data.barWidth = this.data.toPosition
        - this.data.fromPosition;
    } else { // режим Single
      this.data.barPos = 0;
      this.data.barWidth = this.data.fromPosition;
    }
    this.fire('Bar', this.data, this.conf);
  }

  // рассчитываем деления шкалы (создаем массив объектов {значение:, позиция:})
  private calcScaleMarks() {
    let interval = 1;
    let step = 1;
    if (this.conf.scaleBase === 'step') { // если рассчитываем шкалу на основе кол-ва шагов
      step = this.conf.step; // находим длину шага
      interval = (this.conf.max - this.conf.min) / step; // находим кол-во интервалов
      const arg = interval % 1 === 0 ? String(interval)
        : String(Math.trunc(interval + 1));
      this.data.scaleBase = 'step';
      this.data.intervalValue = arg;
      this.data.stepValue = String(this.conf.step);
      this.conf.interval = parseFloat(arg);
    }

    if (this.conf.scaleBase === 'interval') { // если рассчитываем шкалу на основе интервалов
      interval = this.conf.interval; // находим кол-во интервалов
      step = (this.conf.max - this.conf.min) / interval;// находим ширину (кол-во единиц) в шаге
      const arg = step % 1 === 0 ? String(step)
        : String(step.toFixed(2));
      this.data.scaleBase = 'interval';
      this.data.intervalValue = String(interval);
      this.data.stepValue = arg;
      this.conf.step = parseFloat(arg);
    }

    // первое деление всегда стоит на позиции left = 0% и его значение равно this.conf.min
    this.data.marksArr = [{ value: this.conf.min, position: 0 }];
    let value = this.conf.min;

    for (let i = 0; i < interval; i += 1) {
      const obj: IObject = { value: 0, position: 0 };
      value += step;
      if (value <= this.conf.max) {
        const position = ((value - this.conf.min) * 100)
          / (this.conf.max - this.conf.min);

        obj.value = parseFloat(value.toFixed(2));
        obj.position = position;
        this.data.marksArr.push(obj);
      }
    }
    if (this.data.marksArr[this.data.marksArr.length - 1].value
      < this.conf.max) { // если длина шкалы не кратна длине шага
      // последнее деление ставим на позицию left = 100% и его значение равно this.conf.max
      this.data.marksArr.push({ value: this.conf.max, position: 100 });
    }
    this.fire('Scale', this.data, this.conf);
  }

  private calcVal(
    stopType: string,
    position: number,
    moovingControl: string,
  ) {
    if (!this.changeMode) {
      let newValue = '';
      if (stopType === 'normal') {
        newValue = (this.conf.min + ((this.conf.max
          - this.conf.min) * position) / 100).toFixed(0);
      } else if (stopType === 'min') {
        newValue = String(this.conf.min);
      } else if (stopType === 'max') {
        newValue = String(this.conf.max);
      } else if (stopType === 'meetMax') {
        newValue = String(this.conf.to);
      } else if (stopType === 'meetMin') {
        newValue = String(this.conf.from);
      }
      if (moovingControl === 'min') {
        this.data.fromValue = newValue;
        this.conf.from = parseFloat(newValue);
        this.fire('FromValue', this.data);
      } else {
        this.data.toValue = newValue;
        this.conf.to = parseFloat(newValue);
        this.fire('ToValue', this.data);
      }
    }
  }
}

export default Model;
