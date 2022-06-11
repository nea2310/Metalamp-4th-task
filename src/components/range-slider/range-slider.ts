/* eslint-disable max-len */
import $ from 'jquery';

import { IConf } from '../../slider-metalamp/mvc/interface';

class RangeSlider {
  slider: HTMLElement | undefined

  wrapper: HTMLElement

  panel: HTMLElement | undefined

  // panelWrapper: HTMLElement

  sliderWrapper: HTMLElement | undefined

  rangeSlider: any;

  optionMin: HTMLInputElement | undefined;

  optionMax: HTMLInputElement | undefined

  optionFrom: HTMLInputElement | undefined;

  optionTo: HTMLInputElement | undefined;

  optionInterval: HTMLInputElement | undefined;

  optionStep: HTMLInputElement | undefined;

  optionShiftOnKeyDown: HTMLInputElement | undefined;

  optionShiftOnKeyHold: HTMLInputElement | undefined;

  optionVertical: HTMLInputElement | undefined;

  optionRange: HTMLInputElement | undefined;

  optionScale: HTMLInputElement | undefined;

  optionBar: HTMLInputElement | undefined;

  optionTip: HTMLInputElement | undefined;

  optionSticky: HTMLInputElement | undefined;

  scaleBaseSteps: HTMLInputElement | undefined;

  scaleBaseIntervals: HTMLInputElement | undefined;

  inputsAll: HTMLInputElement[] = []

  selector: string

  isDestroyed: boolean | undefined;

  isDisabled: boolean | undefined;

  optionSubscribe: HTMLInputElement | undefined;

  optionDestroy: HTMLInputElement | undefined;

  optionDisable: HTMLInputElement | undefined;

  constructor(selector: string, elem: Element) {
    this.selector = selector;
    this.wrapper = elem as HTMLElement;
    this.renderPanel();
    this.renderSlider();
    this.updateSlider();
    this.disableSlider();
    this.destroySlider();
    this.subscribeSlider();
  }

  static getElement(object: HTMLElement, selector: string) {
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
    if (this.panel && this.sliderWrapper) {
      this.panel.classList.toggle('panel_orientation_vertical');// .panel
      this.sliderWrapper.classList.toggle('range-slider__slider-metalamp_orientation_vertical'); // .range-slider__slider-metalamp
    }
    this.wrapper.classList.toggle('range-slider_orientation_vertical'); // .range-slider
  }

  private displayData(data: IConf) {
    if (this.optionMin) this.optionMin.value = String(data.min);
    if (this.optionMax) this.optionMax.value = String(data.max);
    if (this.optionFrom) this.optionFrom.value = String(data.from);
    if (this.optionTo) this.optionTo.value = String(data.to);
    if (this.optionInterval) this.optionInterval.value = String(data.interval);
    if (this.optionStep) this.optionStep.value = String(data.step);
    if (this.optionShiftOnKeyDown) this.optionShiftOnKeyDown.value = String(data.shiftOnKeyDown);
    if (this.optionShiftOnKeyHold) this.optionShiftOnKeyHold.value = String(data.shiftOnKeyHold);
    if (this.optionVertical) this.optionVertical.checked = !!data.vertical;
    if (this.optionRange) this.optionRange.checked = !!data.range;
    if (this.optionScale) this.optionScale.checked = !!data.scale;
    if (this.optionBar) this.optionBar.checked = !!data.bar;
    if (this.optionTip) this.optionTip.checked = !!data.tip;
    if (this.optionSticky) this.optionSticky.checked = !!data.sticky;
    if (this.optionSubscribe) this.optionSubscribe.checked = true;

    if (data.scaleBase === 'interval' && this.scaleBaseIntervals) {
      this.scaleBaseIntervals.checked = true;
      if (this.optionStep) this.optionStep.disabled = true;
    }

    if (data.scaleBase === 'step' && this.scaleBaseSteps) {
      this.scaleBaseSteps.checked = true;
      if (this.optionInterval) this.optionInterval.disabled = true;
    }
    if (this.optionTo) this.optionTo.disabled = !data.range;
  }

  private updateData = (data: IConf) => {
    if (data.vertical
      !== this.wrapper.classList.contains('range-slider_orientation_vertical')) {
      this.switchVertical();
    }
    if (this.optionFrom) RangeSlider.valid(this.optionFrom, Number(data.from));
    if (this.optionTo) RangeSlider.valid(this.optionTo, Number(data.to));
    if (this.optionMin) RangeSlider.valid(this.optionMin, Number(data.min));
    if (this.optionMax) RangeSlider.valid(this.optionMax, Number(data.max));
    if (this.optionShiftOnKeyDown) {
      RangeSlider.valid(
        this.optionShiftOnKeyDown,
        Number(data.shiftOnKeyDown),
      );
    }
    if (this.optionShiftOnKeyHold) {
      RangeSlider.valid(
        this.optionShiftOnKeyHold,
        Number(data.shiftOnKeyHold),
      );
    }
    if (this.optionInterval) RangeSlider.valid(this.optionInterval, Number(data.interval));
    if (this.optionStep) RangeSlider.valid(this.optionStep, Number(data.step));
  };

  private changeData(data: IConf) {
    if (this.optionFrom && this.optionTo) {
      RangeSlider.valid(this.optionFrom, Number(data.from));
      RangeSlider.valid(this.optionTo, Number(data.to));
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
    this.panel = RangeSlider.getElement(this.wrapper, '.js-panel');
    const getElement = (name: string, addToInputsAll: boolean = true): HTMLInputElement => {
      const elem = this.wrapper.querySelector<HTMLInputElement>(`.js-${name}`);
      if (addToInputsAll) {
        if (elem) {
          this.inputsAll.push(elem);
        }
      }
      return elem as HTMLInputElement;
    };

    this.optionMin = getElement('input_usage_min');
    this.optionMax = getElement('input_usage_max');
    this.optionFrom = getElement('input_usage_from');
    this.optionTo = getElement('input_usage_to');
    this.optionInterval = getElement('input_usage_interval');
    this.optionStep = getElement('input_usage_step');
    this.optionShiftOnKeyDown = getElement('input_usage_shiftOnKeyDown');
    this.optionShiftOnKeyHold = getElement('input_usage_shiftOnKeyHold');

    this.optionVertical = getElement('toggle_usage_vertical');
    this.optionRange = getElement('toggle_usage_range');
    this.optionScale = getElement('toggle_usage_scale');
    this.optionBar = getElement('toggle_usage_bar');
    this.optionTip = getElement('toggle_usage_tip');
    this.optionSticky = getElement('toggle_usage_sticky');
    this.optionSubscribe = getElement('toggle_usage_subscribe');
    this.optionDestroy = getElement('toggle_usage_destroy', false);
    this.optionDisable = getElement('toggle_usage_disable', false);

    this.scaleBaseSteps = getElement('radiobuttons_usage_step');
    this.scaleBaseIntervals = getElement('radiobuttons_usage_interval');
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

  private renderSlider() {
    this.slider = RangeSlider.getElement(this.wrapper, '.js-slider-metalamp');
    this.sliderWrapper = RangeSlider.getElement(this.wrapper, `${this.selector}__slider-metalamp`);
    this.rangeSlider = this.createSlider(this.slider);
  }

  private updateSlider() {
    const properties = [
      'min',
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
          if (target.closest(`.js-panel__${elem}`)) {
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
                if (this.optionInterval) this.optionInterval.disabled = false;
                if (this.optionStep) this.optionStep.disabled = true;
              }
              if (value === 'step') {
                if (this.optionInterval) this.optionInterval.disabled = true;
                if (this.optionStep) this.optionStep.disabled = false;
              }
            }
            if (elem === 'range' && this.optionTo) {
              this.optionTo.disabled = !target.checked;
            }
          }
        });
      }
    };
    if (this.panel) {
      this.panel.addEventListener('change', handleChange);
    }
  }

  private disableSlider() {
    const handleClick = () => {
      if (!this.isDestroyed && this.optionDisable) {
        if (this.optionDisable.checked) {
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
    if (this.optionDisable) {
      this.optionDisable.addEventListener('click', handleClick);
    }
  }

  private subscribeSlider() {
    const handleClick = () => {
      if (!this.isDestroyed && this.optionSubscribe) {
        if (this.optionSubscribe.checked) {
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
    if (this.optionSubscribe) {
      this.optionSubscribe.addEventListener('click', handleClick);
    }
  }

  private destroySlider(slider = this.slider) {
    const handleClick = () => {
      if (this.optionDestroy && this.optionDisable) {
        if (this.optionDestroy.checked) {
          this.rangeSlider.destroy();
          this.inputsAll.forEach((elem) => {
            const input = elem as HTMLInputElement;
            input.disabled = true;
          });

          this.optionDisable.checked = true;
          this.optionDisable.disabled = true;
          this.isDestroyed = true;
          this.optionDestroy.disabled = true;
          if (slider) {
            $.data(slider, 'SliderMetaLamp', null);
          }
        }
      }
    };
    if (this.optionDestroy) {
      this.optionDestroy.addEventListener('click', handleClick);
    }
  }
}

function renderRangeSliders(selector: string) {
  const rangeSliders = document.querySelectorAll(selector);
  rangeSliders.forEach((rangeSlider) => new RangeSlider(selector, rangeSlider));
}

renderRangeSliders('.js-range-slider');
