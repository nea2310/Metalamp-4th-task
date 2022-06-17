/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import $ from 'jquery';

import { IConf } from '../../slider-metalamp/mvc/interface';

import Panel from '../panel/panel';

class RangeSlider {
  panelTest: Panel | null = null;

  panelWrapper: HTMLElement | null = null;

  slider: HTMLElement | undefined

  wrapper: HTMLElement

  panel: HTMLElement | undefined

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

  constructor(selector: string, element: Element) {
    this.selector = selector;
    this.wrapper = element as HTMLElement;
    this.createPanel();
    this.renderPanel();
    this.renderSlider();
    this.updateSlider();
    this.disableSlider();
    this.destroySlider();
    this.subscribeSlider();
    this.handlePanelChange = this.handlePanelChange.bind(this);
    this.createPanel = this.createPanel.bind(this);
  }

  private createPanel() {
    this.panelWrapper = this.wrapper.querySelector(`${this.selector}__panel`);
    if (!this.panelWrapper) return false;
    this.panelTest = new Panel(this.panelWrapper);
    this.panelTest.subscribe(this.handlePanelChange);
    console.log('this!>>', this);
    return true;
  }

  handlePanelChange = (parameters: { key: string, data: string | boolean }) => {
    console.log('this>>', this);

    console.log('handlePanelChange>>', parameters);
    this.rangeSlider.update({ [parameters.key]: parameters.data });
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
    const getElement = (name: string, type = 'input-field', addToInputsAll = true): HTMLInputElement => {
      let prefix = '';
      switch (type) {
        case 'input-field':
          prefix = `${type}__input_usage_`;
          break;
        case 'toggle':
          prefix = `${type}__checkbox_usage_`;
          break;
        case 'radiobuttons':
          prefix = `${type}__category-checkbox_usage_`;
          break;
        default: prefix = '';
      }

      const element = this.wrapper.querySelector<HTMLInputElement>(`.js-${prefix}${name}`);
      if (addToInputsAll) {
        if (element) {
          this.inputsAll.push(element);
        }
      }
      return element as HTMLInputElement;
    };

    this.optionMin = getElement('min');
    this.optionMax = getElement('max');
    this.optionFrom = getElement('from');
    this.optionTo = getElement('to');
    this.optionInterval = getElement('interval');
    this.optionStep = getElement('step');
    this.optionShiftOnKeyDown = getElement('shiftOnKeyDown');
    this.optionShiftOnKeyHold = getElement('shiftOnKeyHold');

    this.optionVertical = getElement('vertical', 'toggle');
    this.optionRange = getElement('range', 'toggle');
    this.optionScale = getElement('scale', 'toggle');
    this.optionBar = getElement('bar', 'toggle');
    this.optionTip = getElement('tip', 'toggle');
    this.optionSticky = getElement('sticky', 'toggle');
    this.optionSubscribe = getElement('subscribe', 'toggle');
    this.optionDestroy = getElement('destroy', 'toggle', false);
    this.optionDisable = getElement('disable', 'toggle', false);

    this.scaleBaseSteps = getElement('step', 'radiobuttons');
    this.scaleBaseIntervals = getElement('interval', 'radiobuttons');
    const changeHandler = (e: Event) => {
      const input = e.currentTarget as HTMLInputElement;
      if (!input.value) {
        input.value = '0';
      }
    };
    this.inputsAll.forEach((element) => {
      element.addEventListener('change', changeHandler);
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
    const handleChange = (event: Event) => {
      if (!this.isDestroyed) {
        const target = event.target as HTMLInputElement;
        const block = '.js-panel__';
        const modifier = '-setup-component_type_';
        properties.forEach((element) => {
          const condition = (target.closest(`${block}main${modifier}${element}`)
            || target.closest(`${block}scale${modifier}${element}`)
            || target.closest(`${block}move${modifier}${element}`));
          if (condition) {
            let value;
            if (target.type === 'checkbox') {
              value = target.checked;
            } else if (target.type === 'radio') {
              value = target.value;
            } else if (!Number.isNaN(+target.value)) {
              value = parseFloat(target.value);
            } else value = 0;
            this.rangeSlider.update({ [element]: value });
            if (element === 'scaleBase') {
              if (value === 'interval') {
                if (this.optionInterval) this.optionInterval.disabled = false;
                if (this.optionStep) this.optionStep.disabled = true;
              }
              if (value === 'step') {
                if (this.optionInterval) this.optionInterval.disabled = true;
                if (this.optionStep) this.optionStep.disabled = false;
              }
            }
            if (element === 'range' && this.optionTo) {
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
