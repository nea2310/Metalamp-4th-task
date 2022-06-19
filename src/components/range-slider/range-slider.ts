/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import $ from 'jquery';

import { IConf } from '../../slider-metalamp/mvc/interface';

import Panel from '../panel/panel';

class RangeSlider {
  panel: Panel | null = null;

  panelWrapper: HTMLElement | null = null;

  slider: HTMLElement | undefined

  wrapper: HTMLElement

  sliderWrapper: HTMLElement | undefined

  rangeSlider: any;

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
    this.render();
    this.subscribeSlider();
  }

  // static valid(
  //   item: HTMLInputElement,
  //   value: number | string | boolean,
  // ) {
  //   const input = item;
  //   if (input.value !== value) { input.value = value as string; }
  // }

  private render() {
    this.slider = RangeSlider.getElement(this.wrapper, '.js-slider-metalamp');
    this.sliderWrapper = RangeSlider.getElement(this.wrapper, `${this.selector}__slider-metalamp`);
    this.panelWrapper = this.wrapper.querySelector(`${this.selector}__panel`);
    if (!this.panelWrapper) return false;
    this.panel = new Panel(this.panelWrapper);
    this.panel.subscribe(this.handlePanelChange);
    this.rangeSlider = this.createSlider(this.slider);
    return true;
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

  private displayData(data: IConf) {
    if (this.panel) this.panel.update(data);
  }

  private updateData = (data: IConf) => {
    if (data.vertical
      !== this.wrapper.classList.contains('range-slider_orientation_vertical')) {
      this.switchVertical();
    }
  };

  private changeData(data: IConf) {
    if (this.panel) this.panel.update(data);
  }

  private handlePanelChange = (parameters: { key: string, data: string | boolean }) => {
    switch (parameters.key) {
      case 'subscribe': {
        if (typeof parameters.data === 'boolean') {
          this.subscribeSlider(parameters.data);
        }
        break;
      }
      case 'disable': {
        if (typeof parameters.data === 'boolean') {
          this.disableSlider(parameters.data);
          if (this.panel) {
            this.panel.disable(parameters.data);
          }
        }
        break;
      }
      case 'destroy': {
        if (typeof parameters.data === 'boolean') {
          this.destroySlider(parameters.data);
        }
        break;
      }
      default: {
        this.rangeSlider.update({ [parameters.key]: parameters.data });
        /* после ввода данных в панель конфигурирования и обновления слайдера нужно получить данные из модели и обновить панель,
     т.к. в панель могли быть введены недопустимые данные, которые были затем изменены в модели при валидации. Их надо скорректировать и в панели */
        const data = this.rangeSlider.getData();
        if (this.panel) this.panel.update(data);
      }
    }
  }

  private subscribeSlider(isSubscribed = true) {
    if (isSubscribed) {
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

  private async disableSlider(isDisabled = false) {
    if (isDisabled) {
      this.rangeSlider.disable();
    } else {
      this.rangeSlider.enable();
      /* дожидаемся, когда вернется объект data из модели, иначе update вызывается с некорректными данными */
      const data = await this.rangeSlider.getData();
      if (this.panel) this.panel.update(data);
    }
  }

  private destroySlider(isDestroyed = false, slider = this.slider) {
    if (isDestroyed) {
      this.rangeSlider.destroy();
      if (this.panel) {
        this.panel.destroy();
      }
      if (slider) {
        $.data(slider, 'SliderMetaLamp', null);
      }
      if (this.sliderWrapper) {
        this.sliderWrapper.classList.remove('range-slider__slider-metalamp_orientation_vertical');
      }
      this.wrapper.classList.remove('range-slider_orientation_vertical');
    }
  }

  private switchVertical() {
    if (this.sliderWrapper) {
      this.sliderWrapper.classList.toggle('range-slider__slider-metalamp_orientation_vertical'); // .range-slider__slider-metalamp
    }
    this.wrapper.classList.toggle('range-slider_orientation_vertical'); // .range-slider
  }

  private static getElement(object: HTMLElement, selector: string) {
    return object.querySelector(selector) as HTMLElement;
  }
}

function renderRangeSliders(selector: string) {
  const rangeSliders = document.querySelectorAll(selector);
  rangeSliders.forEach((rangeSlider) => new RangeSlider(selector, rangeSlider));
}

renderRangeSliders('.js-range-slider');
