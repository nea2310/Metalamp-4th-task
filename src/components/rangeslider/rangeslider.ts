import './rangeslider.scss';
import {
  IConf,
} from '../../plugins/sliderMetaLamp/mvc/interface';

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
    this.panel = this.wrapper.querySelector('.js-panel') as HTMLElement;
    this.slider = this.wrapper.querySelector('.js-rs-metalamp') as HTMLElement;
    this.panelWrapper = this.wrapper.querySelector(`${this.selector}__panel`) as HTMLElement;
    this.sliderWrapper = this.wrapper.querySelector(`${this.selector}__rs`) as HTMLElement;
    this.renderPanel();
    this.renderSlider(this.slider);
    this.updateSlider();
    this.disableSlider();
    this.destroySlider(this.slider);
    this.subscribeSlider();
  }

  private valid(
    item: HTMLInputElement,
    val: number | string | boolean,
  ) {
    if (item.value != val) { item.value = val as string; }
  }

  private switchVertical() {
    this.panel.classList.toggle('panel_vert');// .panel
    this.wrapper.classList.toggle('rangeslider_vert'); // .rangeslider
    this.sliderWrapper.classList.toggle('rangeslider__rs_vert'); // .rangeslider__rs
  }

  private displayData(data: IConf) {
    if (this.min
      && this.max
      && this.from
      && this.to
      && this.interval
      && this.step
      && this.shiftOnKeyDown
      && this.shiftOnKeyHold
      && this.vertical
      && this.range
      && this.scale
      && this.bar
      && this.tip
      && this.sticky
      && this.subscribe
    ) {
      const D = data;
      this.min.value = String(D.min);
      this.max.value = String(D.max);
      this.from.value = String(D.from);
      this.to.value = String(D.to);
      this.interval.value = String(D.interval);
      this.step.value = String(D.step);
      this.shiftOnKeyDown.value = String(D.shiftOnKeyDown);
      this.shiftOnKeyHold.value = String(D.shiftOnKeyHold);
      this.vertical.checked = !!D.vertical;
      this.range.checked = !!D.range;
      this.scale.checked = !!D.scale;
      this.bar.checked = !!D.bar;
      this.tip.checked = !!D.tip;
      this.sticky.checked = !!D.sticky;
      this.subscribe.checked = true;

      if (data.scaleBase == 'interval' && this.scaleBaseIntervals) {
        this.scaleBaseIntervals.checked = true;
        this.step.disabled = true;
      }

      if (data.scaleBase == 'step' && this.scaleBaseSteps) {
        this.scaleBaseSteps.checked = true;
        this.interval.disabled = true;
      }
      this.to.disabled = !D.range;
    }
  }

  private updateData = (data: IConf) => {
    if (data.vertical
      != this.wrapper.classList.contains('rangeslider_vert')) {
      this.switchVertical();
    }
    const D = data;
    if (this.from
      && this.to
      && this.min
      && this.max
      && this.shiftOnKeyDown
      && this.shiftOnKeyHold
      && this.interval
      && this.step) {
      this.valid(this.from, Number(D.from));
      this.valid(this.to, Number(D.to));
      this.valid(this.min, Number(D.min));
      this.valid(this.max, Number(D.max));
      this.valid(this.shiftOnKeyDown, Number(D.shiftOnKeyDown));
      this.valid(this.shiftOnKeyHold, Number(D.shiftOnKeyHold));
      this.valid(this.interval, Number(D.interval));
      this.valid(this.step, Number(D.step));
    }
  };

  private changeData(data: IConf) {
    const D = data;
    if (this.from && this.to) {
      this.valid(this.from, Number(D.from));
      this.valid(this.to, Number(D.to));
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

    for (const elem of this.inputsAll) {
      elem.addEventListener('change', () => {
        console.log(elem.value);

        if (!elem.value) {
          elem.value = '0';
        }
      });
    }
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
    this.panel.addEventListener('change', (e) => {
      if (!this.isDestroyed) {
        const target = e.target as HTMLInputElement;
        for (const elem of arr) {
          if (target.closest(`.panel__${elem}`)) {
            let value;
            if (target.type == 'checkbox') {
              value = target.checked;
            } else if (target.type == 'radio') {
              value = target.value;
            } else if (!isNaN(+target.value)) {
              value = parseFloat(target.value);
            } else value = 0;
            this.rangeSlider.update({ [elem]: value });
            if (elem == 'scaleBase') {
              if (value == 'interval' && this.interval && this.step) {
                this.interval.disabled = false;
                this.step.disabled = true;
              }
              if (value == 'step' && this.interval && this.step) {
                this.interval.disabled = true;
                this.step.disabled = false;
              }
            }
            if (elem == 'range' && this.to) {
              this.to.disabled = !target.checked;
            }
            break;
          }
        }
      }
    });
  }

  // API disable
  private disableSlider() {
    if (this.disable) {
      this.disable.addEventListener('click', () => {
        if (!this.isDestroyed && this.disable) {
          if (this.disable.checked) {
            this.rangeSlider.disable();
            for (const elem of this.inputsAll) {
              elem.disabled = true;
            }
            this.isDisabled = true;
          } else {
            this.rangeSlider.enable();
            for (const elem of this.inputsAll) {
              elem.disabled = false;
            }
            const data = this.rangeSlider.getData();
            this.displayData(data);
            this.isDisabled = false;
          }
        }
      });
    }
  }

  private subscribeSlider() {
    if (this.subscribe) {
      this.subscribe.addEventListener('click', () => {
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
      });
    }
  }

  // API destroy
  private destroySlider(slider: HTMLElement) {
    if (this.destroy) {
      this.destroy.addEventListener('click', () => {
        if (this.destroy && this.disable) {
          if (this.destroy.checked) {
            this.rangeSlider.destroy();
            for (const elem of this.inputsAll) {
              elem.disabled = true;
            }
            this.disable.checked = true;
            this.disable.disabled = true;
            this.isDestroyed = true;
            this.destroy.disabled = true;
            // отвязать объект слайдера от DOM-элемента
            $.data(slider, 'SliderMetaLamp', null);
          }
        }
      });
    }
  }
}

function renderRangeSliders(selector: string) {
  const rangeSliders = document.querySelectorAll(selector);
  const mas: RangeSlider[] = [];
  for (const rangeSlider of rangeSliders) {
    mas.push(new RangeSlider(selector, rangeSlider));
  }
  return mas;
}

renderRangeSliders('.js-rangeslider');
