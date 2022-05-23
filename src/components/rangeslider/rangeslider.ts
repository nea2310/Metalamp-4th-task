import $ from 'jquery';

import { IConf } from '../../sliderMetaLamp/mvc/interface';
import './rangeslider.scss';

class RangeSlider {
  slider: HTMLElement

  wrapper: HTMLElement

  panel: HTMLElement

  panelWrapper: HTMLElement

  sliderWrapper: HTMLElement

  rangeSlider: any;

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
    this.panel = RangeSlider.getElem(this.wrapper, '.js-panel');
    this.slider = RangeSlider.getElem(this.wrapper, '.js-rs-metalamp');
    this.panelWrapper = RangeSlider.getElem(this.wrapper, `${this.selector}__panel`);
    this.sliderWrapper = RangeSlider.getElem(this.wrapper, `${this.selector}__rs`);
    this.renderPanel();
    this.renderSlider(this.slider);
    this.updateSlider();
    this.disableSlider();
    this.destroySlider(this.slider);
    this.subscribeSlider();
  }

  static getElem(object: HTMLElement, selector: string) {
    return object.querySelector(selector) as HTMLElement;
  }

  static valid(
    item: HTMLInputElement,
    value: number | string | boolean,
  ) {
    const input = item;
    if (input.value !== value) { input.value = value as string; }
  }

  private switchVertical() {
    this.panel.classList.toggle('panel_orientation_vertical');// .panel
    this.wrapper.classList.toggle('rangeslider_orientation_vertical'); // .rangeslider
    this.sliderWrapper.classList.toggle('rangeslider__rs_orientation_vertical'); // .rangeslider__rs
  }

  private displayData(data: IConf) {
    if (this.min) this.min.value = String(data.min);
    if (this.max) this.max.value = String(data.max);
    if (this.from) this.from.value = String(data.from);
    if (this.to) this.to.value = String(data.to);
    if (this.interval) this.interval.value = String(data.interval);
    if (this.step) this.step.value = String(data.step);
    if (this.shiftOnKeyDown) this.shiftOnKeyDown.value = String(data.shiftOnKeyDown);
    if (this.shiftOnKeyHold) this.shiftOnKeyHold.value = String(data.shiftOnKeyHold);
    if (this.vertical) this.vertical.checked = !!data.vertical;
    if (this.range) this.range.checked = !!data.range;
    if (this.scale) this.scale.checked = !!data.scale;
    if (this.bar) this.bar.checked = !!data.bar;
    if (this.tip) this.tip.checked = !!data.tip;
    if (this.sticky) this.sticky.checked = !!data.sticky;
    if (this.subscribe) this.subscribe.checked = true;

    if (data.scaleBase === 'interval' && this.scaleBaseIntervals) {
      this.scaleBaseIntervals.checked = true;
      if (this.step) this.step.disabled = true;
    }

    if (data.scaleBase === 'step' && this.scaleBaseSteps) {
      this.scaleBaseSteps.checked = true;
      if (this.interval) this.interval.disabled = true;
    }
    if (this.to) this.to.disabled = !data.range;
  }

  private updateData = (data: IConf) => {
    if (data.vertical
      !== this.wrapper.classList.contains('rangeslider_orientation_vertical')) {
      this.switchVertical();
    }
    if (this.from) RangeSlider.valid(this.from, Number(data.from));
    if (this.to) RangeSlider.valid(this.to, Number(data.to));
    if (this.min) RangeSlider.valid(this.min, Number(data.min));
    if (this.max) RangeSlider.valid(this.max, Number(data.max));
    if (this.shiftOnKeyDown) RangeSlider.valid(this.shiftOnKeyDown, Number(data.shiftOnKeyDown));
    if (this.shiftOnKeyHold) RangeSlider.valid(this.shiftOnKeyHold, Number(data.shiftOnKeyHold));
    if (this.interval) RangeSlider.valid(this.interval, Number(data.interval));
    if (this.step) RangeSlider.valid(this.step, Number(data.step));
  };

  private changeData(data: IConf) {
    if (this.from && this.to) {
      RangeSlider.valid(this.from, Number(data.from));
      RangeSlider.valid(this.to, Number(data.to));
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

    this.min = getElem('input_usage_min');
    this.max = getElem('input_usage_max');
    this.from = getElem('input_usage_from');
    this.to = getElem('input_usage_to');
    this.interval = getElem('input_usage_interval');
    this.step = getElem('input_usage_step');
    this.shiftOnKeyDown = getElem('input_usage_shiftOnKeyDown');
    this.shiftOnKeyHold = getElem('input_usage_shiftOnKeyHold');

    this.vertical = getElem('toggle_usage_vertical');
    this.range = getElem('toggle_usage_range');
    this.scale = getElem('toggle_usage_scale');
    this.bar = getElem('toggle_usage_bar');
    this.tip = getElem('toggle_usage_tip');
    this.sticky = getElem('toggle_usage_sticky');
    this.subscribe = getElem('toggle_usage_subscribe');
    this.destroy = getElem('toggle_usage_destroy', false);
    this.disable = getElem('toggle_usage_disable', false);

    this.scaleBaseSteps = getElem('radiobuttons_usage_step');
    this.scaleBaseIntervals = getElem('radiobuttons_usage_interval');
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

  private updateSlider() {
    const properties = ['min',
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
        properties.forEach((elem) => {
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
          }
        });
      }
    };
    this.panel.addEventListener('change', handleChange);
  }

  private disableSlider() {
    const handleClick = () => {
      if (!this.isDestroyed && this.disable) {
        if (this.disable.checked) {
          this.rangeSlider.disable();
          this.inputsAll.forEach((elem) => {
            const input = elem as HTMLInputElement;
            input.disabled = true;
          });
          this.isDisabled = true;
        } else {
          this.rangeSlider.enable();
          this.inputsAll.forEach((elem) => {
            const input = elem as HTMLInputElement;
            input.disabled = false;
          });
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
