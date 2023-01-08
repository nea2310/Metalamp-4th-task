import $ from 'jquery';

import Controller from '../../slider-metalamp/mvc/controller/Controller';
import { TPluginConfiguration, IRange } from '../../slider-metalamp/mvc/interface';
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
    this.panel.subscribe(this.handlePanelChange);
    this.rangeSlider = this.createSlider(this.slider);
  }

  private createSlider(element: Element) {
    const rangeSlider = $(element).SliderMetaLamp({
      onUpdate: (data: TPluginConfiguration) => {
        this.updateData(data);
      },
      onChange: (data: IRange) => {
        this.changeData(data);
      },
    }).data('SliderMetaLamp');
    return rangeSlider;
  }

  private updateData(data: TPluginConfiguration) {
    if (this.panel) this.panel.update(data);
  }

  private changeData(data: IRange) {
    if (this.panel) this.panel.change(data);
  }

  private handlePanelChange = (parameters: { key: string, data: string | boolean }) => {
    const { key, data } = parameters;
    switch (key) {
      case 'subscribe':
        if (typeof data !== 'boolean') return;
        this.subscribeSlider(data);
        break;
      case 'disable':
        if (typeof data !== 'boolean') return;
        this.disableSlider(data);
        if (this.panel) this.panel.disable(data);
        break;
      case 'destroy':
        if (typeof data !== 'boolean') return;
        this.destroySlider(data);
        break;
      case 'vertical':
        if (typeof data !== 'boolean') return;
        if (this.rangeSlider) {
          this.switchOrientation(data);
          this.rangeSlider.update({ [key]: data });
        }
        break;
      default:
        if (this.rangeSlider) {
          this.rangeSlider.update({ [key]: data });
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
        onUpdate: (data: TPluginConfiguration) => {
          this.updateData(data);
        },
      });
    } else this.rangeSlider.update({ onUpdate: undefined });
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
