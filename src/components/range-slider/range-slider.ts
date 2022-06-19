/* eslint-disable max-len */
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
    this.renderSlider();
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
    return true;
  }

  handlePanelChange = (parameters: { key: string, data: string | boolean }) => {
    this.rangeSlider.update({ [parameters.key]: parameters.data });

    /* после ввода данных в панель конфигурирования и обновления слайдера нужно получить данные из модели и обновить панель,
      т.к. в панель могли быть введены недопустимые данные, которые были затем изменены в модели при валидации. Их надо скорректировать и в панели */
    const data = this.rangeSlider.getData();
    if (this.panelTest) this.panelTest.update(data);
  }

  static getElement(object: HTMLElement, selector: string) {
    return object.querySelector(selector) as HTMLElement;
  }

  // static valid(
  //   item: HTMLInputElement,
  //   value: number | string | boolean,
  // ) {
  //   const input = item;
  //   if (input.value !== value) { input.value = value as string; }
  // }

  private switchVertical() {
    if (this.sliderWrapper) {
      this.sliderWrapper.classList.toggle('range-slider__slider-metalamp_orientation_vertical'); // .range-slider__slider-metalamp
    }
    this.wrapper.classList.toggle('range-slider_orientation_vertical'); // .range-slider
  }

  private displayData(data: IConf) {
    if (this.panelTest) this.panelTest.update(data);
  }

  private updateData = (data: IConf) => {
    if (data.vertical
      !== this.wrapper.classList.contains('range-slider_orientation_vertical')) {
      this.switchVertical();
    }
  };

  private changeData(data: IConf) {
    if (this.panelTest) this.panelTest.update(data);
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

  private renderSlider() {
    this.slider = RangeSlider.getElement(this.wrapper, '.js-slider-metalamp');
    this.sliderWrapper = RangeSlider.getElement(this.wrapper, `${this.selector}__slider-metalamp`);
    this.rangeSlider = this.createSlider(this.slider);
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
