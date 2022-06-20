import $ from 'jquery';

import { IConf } from '../../slider-metalamp/mvc/interface';

import Panel from '../panel/panel';

class RangeSlider {
  private wrapper: HTMLElement;

  private panel: Panel | null = null;

  private panelWrapper: HTMLElement | null = null;

  private slider: HTMLElement | undefined;

  private sliderWrapper: HTMLElement | undefined;

  private rangeSlider: any;

  private selector: string;

  constructor(selector: string, element: Element) {
    this.selector = selector;
    this.wrapper = element as HTMLElement;
    this.render();
    this.subscribeSlider();
  }

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

  private createSlider(element: HTMLElement) {
    const rangeSlider = $(element).SliderMetaLamp({
      onStart: (data: IConf) => {
        this.displayData(data);
      },
      onUpdate: (data: IConf) => {
        this.updateData(data);
      },
      onChange: (data: IConf) => {
        this.changeData(data);
      },
    }).data('SliderMetaLamp');
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
    const { key, data } = parameters;
    switch (key) {
      case 'subscribe': {
        if (typeof data === 'boolean') {
          this.subscribeSlider(data);
        }
        break;
      }
      case 'disable': {
        if (typeof data === 'boolean') {
          this.disableSlider(data);
          if (this.panel) {
            this.panel.disable(data);
          }
        }
        break;
      }
      case 'destroy': {
        if (typeof data === 'boolean') {
          this.destroySlider(data);
        }
        break;
      }
      default: {
        this.rangeSlider.update({ [key]: data });
        /* после ввода данных в панель конфигурирования и обновления слайдера нужно получить данные
        из модели и обновить панель, т.к. в панель могли быть введены недопустимые данные, которые
         были затем изменены в модели при валидации. Их надо скорректировать и в панели */
        const dataObject = this.rangeSlider.getData();
        if (this.panel) this.panel.update(dataObject);
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
      /* дожидаемся, когда вернется объект data из модели, иначе update вызывается
      с некорректными данными */
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
      this.sliderWrapper.classList.toggle('range-slider__slider-metalamp_orientation_vertical');
    }
    this.wrapper.classList.toggle('range-slider_orientation_vertical');
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
