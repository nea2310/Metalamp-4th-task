import './rangeslider.scss';
import $ from 'jquery';
import {
  IConf,
} from '../../sliderMetaLamp/mvc/interface';

class RangeSlider {
  slider: HTMLElement

  wrapper: HTMLElement

  panel: HTMLElement

  panelWrapper: HTMLElement

  sliderWrapper: HTMLElement

  rangeSlider: any // какой здесь должен быть тип?

  min: HTMLInputElement | undefined;

  max: HTMLInputElement | undefined

  from: HTMLInputElement | undefined;

  to: HTMLInputElement | undefined;

  interval: HTMLInputElement | undefined;

  step: HTMLInputElement | undefined;

  shiftOnKeyDown: HTMLInputElement | undefined;

  shiftOnKeyHold: HTMLInputElement | undefined;

  vertical: HTMLInputElement | undefined;

  range: HTMLInputElement | undefined;

  scale: HTMLInputElement | undefined;

  bar: HTMLInputElement | undefined;

  tip: HTMLInputElement | undefined;

  sticky: HTMLInputElement | undefined;

  scaleBaseSteps: HTMLInputElement | undefined;

  scaleBaseIntervals: HTMLInputElement | undefined;

  inputsAll: HTMLInputElement[] = []

  selector: string

  isDestroyed: boolean | undefined;

  isDisabled: boolean | undefined;

  subscribe: HTMLInputElement | undefined;

  destroy: HTMLInputElement | undefined;

  disable: HTMLInputElement | undefined;

  constructor(selector: string, elem: Element) {
    this.selector = selector;
    this.wrapper = elem as HTMLElement;
    this.panel = RangeSlider.getElem(this.wrapper, '.js-panel') as HTMLElement;
    this.slider = RangeSlider.getElem(this.wrapper, '.js-rs-metalamp') as HTMLElement;
    this.panelWrapper = RangeSlider.getElem(this.wrapper, `${this.selector}__panel`) as HTMLElement;
    this.sliderWrapper = RangeSlider.getElem(this.wrapper, `${this.selector}__rs`) as HTMLElement;
    this.renderPanel();
    this.renderSlider(this.slider);
    this.updateSlider();
    this.disableSlider();
    this.destroySlider(this.slider);
    this.subscribeSlider();
  }

  static getElem(obj: HTMLElement, selector: string) {
    return obj.querySelector(selector);
  }

  static valid(
    item: HTMLInputElement,
    val: number | string | boolean,
  ) {
    if (item.value !== val) { item.value = val as string; }
  }

  private switchVertical() {
    this.panel.classList.toggle('panel_vert');// .panel
    this.wrapper.classList.toggle('rangeslider_vert'); // .rangeslider
    this.sliderWrapper.classList.toggle('rangeslider__rs_vert'); // .rangeslider__rs
  }

  private displayData(data: IConf) {
    const D = data;
    if (this.min) this.min.value = String(D.min);
    if (this.max) this.max.value = String(D.max);
    if (this.from) this.from.value = String(D.from);
    if (this.to) this.to.value = String(D.to);
    if (this.interval) this.interval.value = String(D.interval);
    if (this.step) this.step.value = String(D.step);
    if (this.shiftOnKeyDown) this.shiftOnKeyDown.value = String(D.shiftOnKeyDown);
    if (this.shiftOnKeyHold) this.shiftOnKeyHold.value = String(D.shiftOnKeyHold);
    if (this.vertical) this.vertical.checked = !!D.vertical;
    if (this.range) this.range.checked = !!D.range;
    if (this.scale) this.scale.checked = !!D.scale;
    if (this.bar) this.bar.checked = !!D.bar;
    if (this.tip) this.tip.checked = !!D.tip;
    if (this.sticky) this.sticky.checked = !!D.sticky;
    if (this.subscribe) this.subscribe.checked = true;

    if (data.scaleBase === 'interval' && this.scaleBaseIntervals) {
      this.scaleBaseIntervals.checked = true;
      if (this.step) this.step.disabled = true;
    }

    if (data.scaleBase === 'step' && this.scaleBaseSteps) {
      this.scaleBaseSteps.checked = true;
      if (this.interval) this.interval.disabled = true;
    }
    if (this.to) this.to.disabled = !D.range;
  }

  private updateData = (data: IConf) => {
    if (data.vertical
      !== this.wrapper.classList.contains('rangeslider_vert')) {
      this.switchVertical();
    }
    const D = data;
    if (this.from) RangeSlider.valid(this.from, Number(D.from));
    if (this.to) RangeSlider.valid(this.to, Number(D.to));
    if (this.min) RangeSlider.valid(this.min, Number(D.min));
    if (this.max) RangeSlider.valid(this.max, Number(D.max));
    if (this.shiftOnKeyDown) RangeSlider.valid(this.shiftOnKeyDown, Number(D.shiftOnKeyDown));
    if (this.shiftOnKeyHold) RangeSlider.valid(this.shiftOnKeyHold, Number(D.shiftOnKeyHold));
    if (this.interval) RangeSlider.valid(this.interval, Number(D.interval));
    if (this.step) RangeSlider.valid(this.step, Number(D.step));
  };

  private changeData(data: IConf) {
    const D = data;
    if (this.from && this.to) {
      RangeSlider.valid(this.from, Number(D.from));
      RangeSlider.valid(this.to, Number(D.to));
    }
  }

  private createSlider(elem: HTMLElement) {
    const rangeSlider = $(elem).SliderMetaLamp({
      onStart: (data: IConf) => {
        this.displayData(data);
      },
      onUpdate: (data: IConf) => {
        this.updateData(data);
      },
      onChange: (data: IConf) => {
        this.changeData(data);
      },
    }).data('SliderMetaLamp'); // вернёт объект для одного элемента
    return rangeSlider;
  }

  private renderPanel() {
    const getElem = (name: string, addToInputsAll: boolean = true): HTMLInputElement => {
      const elem = this.panel.querySelector<HTMLInputElement>(`.js-${name}`);
      if (addToInputsAll) {
        if (elem) {
          this.inputsAll.push(elem);
        }
      }
      return elem as HTMLInputElement;
    };

    this.min = getElem('input-min');
    this.max = getElem('input-max');
    this.from = getElem('input-from');
    this.to = getElem('input-to');
    this.interval = getElem('input-interval');
    this.step = getElem('input-step');
    this.shiftOnKeyDown = getElem('input-shiftOnKeyDown');
    this.shiftOnKeyHold = getElem('input-shiftOnKeyHold');

    this.vertical = getElem('toggle-vertical');
    this.range = getElem('toggle-range');
    this.scale = getElem('toggle-scale');
    this.bar = getElem('toggle-bar');
    this.tip = getElem('toggle-tip');
    this.sticky = getElem('toggle-sticky');
    this.subscribe = getElem('toggle-subscribe');
    this.destroy = getElem('toggle-destroy', false);
    this.disable = getElem('toggle-disable', false);

    this.scaleBaseSteps = getElem('radio-step');
    this.scaleBaseIntervals = getElem('radio-interval');
    const changeHandler = (e: Event) => {
      const input = e.currentTarget as HTMLInputElement;
      if (!input.value) {
        input.value = '0';
      }
    };
    this.inputsAll.forEach((elem) => {
      elem.addEventListener('change', changeHandler);
    });
  }

  private renderSlider(slider: HTMLElement) {
    this.rangeSlider = this.createSlider(slider);
  }

  // API update
  private updateSlider() {
    const arr = ['min',
      'max',
      'from',
      'to',
      'step',
      'interval',
      'shiftOnKeyDown',
      'shiftOnKeyHold',
      'scaleBaseSteps',
      'scaleBaseIntervals',
      'vertical',
      'range',
      'sticky',
      'scale',
      'bar',
      'tip',
      'scaleBase',
    ];
    const handleChange = (e: Event) => {
      if (!this.isDestroyed) {
        const target = e.target as HTMLInputElement;
        arr.forEach((elem) => {
          if (target.closest(`.panel__${elem}`)) {
            let value;
            if (target.type === 'checkbox') {
              value = target.checked;
            } else if (target.type === 'radio') {
              value = target.value;
            } else if (!Number.isNaN(+target.value)) {
              value = parseFloat(target.value);
            } else value = 0;
            this.rangeSlider.update({ [elem]: value });
            if (elem === 'scaleBase') {
              if (value === 'interval') {
                if (this.interval) this.interval.disabled = false;
                if (this.step) this.step.disabled = true;
              }
              if (value === 'step') {
                if (this.interval) this.interval.disabled = true;
                if (this.step) this.step.disabled = false;
              }
            }
            if (elem === 'range' && this.to) {
              this.to.disabled = !target.checked;
            }
            //   break;
          }
        });
      }
    };
    this.panel.addEventListener('change', handleChange);
  }

  // API disable
  private disableSlider() {
    const handleClick = () => {
      if (!this.isDestroyed && this.disable) {
        if (this.disable.checked) {
          this.rangeSlider.disable();
          this.inputsAll.forEach((elem) => { elem.disabled = true; });
          this.isDisabled = true;
        } else {
          this.rangeSlider.enable();
          this.inputsAll.forEach((elem) => { elem.disabled = false; });
          const data = this.rangeSlider.getData();
          this.displayData(data);
          this.isDisabled = false;
        }
      }
    };
    if (this.disable) {
      this.disable.addEventListener('click', handleClick);
    }
  }

  private subscribeSlider() {
    const handleClick = () => {
      if (!this.isDestroyed && this.subscribe) {
        if (this.subscribe.checked) {
          this.rangeSlider.update({
            onChange: (data: IConf) => {
              this.changeData(data);
            },
          });
        } else {
          this.rangeSlider.update({
            onChange: null,
          });
        }
      }
    };
    if (this.subscribe) {
      this.subscribe.addEventListener('click', handleClick);
    }
  }

  // API destroy
  private destroySlider(slider: HTMLElement) {
    const handleClick = () => {
      if (this.destroy && this.disable) {
        if (this.destroy.checked) {
          this.rangeSlider.destroy();
          this.inputsAll.forEach((elem) => {
            const input = elem as HTMLInputElement;
            input.disabled = true;
          });

          this.disable.checked = true;
          this.disable.disabled = true;
          this.isDestroyed = true;
          this.destroy.disabled = true;
          // отвязать объект слайдера от DOM-элемента
          $.data(slider, 'SliderMetaLamp', null);
        }
      }
    };
    if (this.destroy) {
      this.destroy.addEventListener('click', handleClick);
    }
  }
}

function renderRangeSliders(selector: string) {
  const rangeSliders = document.querySelectorAll(selector);
  rangeSliders.forEach((rangeSlider) => new RangeSlider(selector, rangeSlider));
}

renderRangeSliders('.js-rangeslider');
