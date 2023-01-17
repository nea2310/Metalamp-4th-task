import $ from 'jquery';

import Controller from '../../slider-metalamp/mvc/controller/Controller';
import { TPluginConfiguration, IViewData } from '../../slider-metalamp/mvc/interface';
import Panel from '../panel/Panel';

class RangeSlider {
  private wrapper: HTMLElement;

  private panel: Panel | null = null;

  private panelWrapper: HTMLElement | null = null;

  private slider: Element | null = null;

  private sliderWrapper: Element | null = null;

  private rangeSlider: Controller | undefined;

  private sliderSelector = 'slider-metalamp';

  private rootSelector = 'range-slider';;

  private isVerticalModifier = 'orientation_vertical';

  constructor(element: HTMLElement) {
    this.wrapper = element;
    this.render();
  }

  static getElement(object: HTMLElement, selector: string) {
    return object.querySelector(selector);
  }

  private render() {
    this.slider = RangeSlider.getElement(this.wrapper, `.js-${this.sliderSelector}`);
    this.sliderWrapper = RangeSlider.getElement(this.wrapper, `.js-${this.rootSelector}__${this.sliderSelector}`);
    this.panelWrapper = this.wrapper.querySelector(`.js-${this.rootSelector}__panel`);
    if (!this.panelWrapper || !this.slider) return;
    this.panel = new Panel(this.panelWrapper);
    this.panel.subscribe('panelUpdate', this.handlePanelChange);
    this.rangeSlider = this.createSlider(this.slider);
  }

  private createSlider(element: Element) {
    const rangeSlider = $(element).SliderMetaLamp({
      onUpdate: (data: TPluginConfiguration) => {
        this.updateData(data);
      },
      onChange: (data: IViewData) => {
        this.changeData(data);
      },
    }).data('SliderMetaLamp');
    return rangeSlider;
  }

  private updateData(data: TPluginConfiguration) {
    if (this.panel) this.panel.update(data);
  }

  private changeData(data: IViewData) {
    if (this.panel) this.panel.change(data);
  }

  private handlePanelChange = (parameters: { key: string, value: string | boolean }) => {
    const { key, value } = parameters;
    switch (key) {
      case 'subscribe':
        if (typeof value !== 'boolean') return;
        this.subscribeSlider(value);
        break;
      case 'disable':
        if (typeof value !== 'boolean') return;
        this.disableSlider(value);
        if (this.panel) this.panel.disable(value);
        break;
      case 'destroy':
        if (typeof value !== 'boolean') return;
        this.destroySlider(value);
        break;
      case 'vertical':
        if (typeof value !== 'boolean') return;
        if (this.rangeSlider) {
          this.switchOrientation(value);
          this.rangeSlider.update({ [key]: value });
        }
        break;
      default:
        if (this.rangeSlider) {
          this.rangeSlider.update({ [key]: value });
        }
    }
  };

  private switchOrientation = (isVertical: boolean) => {
    if (isVertical !== this.wrapper.classList.contains(`${this.rootSelector}_${this.isVerticalModifier}`)) {
      this.switchVertical();
    }
  };

  private subscribeSlider(isSubscribed = true) {
    if (!this.rangeSlider) return;
    if (isSubscribed) {
      this.rangeSlider.update({
        onChange: (data: TPluginConfiguration) => {
          this.changeData(data);
        },
      });
    } else this.rangeSlider.update({ onChange: undefined });
  }

  private disableSlider(isDisabled = false) {
    if (!this.rangeSlider) return;
    if (isDisabled) {
      this.rangeSlider.disable();
      return;
    }
    this.rangeSlider.enable();
  }

  private destroySlider(isDestroyed = false, slider = this.slider) {
    if (!isDestroyed) return;
    if (this.rangeSlider) this.rangeSlider.destroy();
    if (this.panel) this.panel.destroy();
    if (slider) $.data(slider, 'SliderMetaLamp', null);
    if (this.sliderWrapper) {
      this.sliderWrapper.classList.remove(`${this.rootSelector}__${this.sliderSelector}_${this.isVerticalModifier}`);
    }
    this.wrapper.classList.remove(`${this.rootSelector}_${this.isVerticalModifier}`);
  }

  private switchVertical() {
    if (this.sliderWrapper) {
      this.sliderWrapper.classList.toggle(`${this.rootSelector}__${this.sliderSelector}_${this.isVerticalModifier}`);
    }
    this.wrapper.classList.toggle(`${this.rootSelector}_${this.isVerticalModifier}`);
  }
}

export default RangeSlider;
