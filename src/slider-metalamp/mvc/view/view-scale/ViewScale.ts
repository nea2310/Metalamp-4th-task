import {
  IPluginConfigurationFull,
  IPluginConfigurationItem,
} from '../../interface';

class ViewScale {
  private slider: HTMLElement;

  private startWidth: number = 0;

  private track: HTMLElement;

  private markList: Element[] = [];

  private conf: IPluginConfigurationFull;

  private lastLabelRemoved: boolean = false;

  public scaleMarks: IPluginConfigurationItem[] = [];

  private onScaleReady: Function = () => {};

  constructor(
    slider: HTMLElement,
    track: HTMLElement,
    conf: IPluginConfigurationFull,
    handleScaleReady: Function = () => {},
  ) {
    this.conf = conf;
    this.slider = slider;
    this.track = track;
    this.onScaleReady = handleScaleReady;
    this.calcScaleMarks();
  }

  public updateStep(value: number, scaleBase: 'step' | 'interval') {
    this.conf = { ...this.conf, step: value, scaleBase };
    this.calcScaleMarks();
  }

  public updateInterval(value: number, scaleBase: 'step' | 'interval') {
    this.conf = { ...this.conf, interval: value, scaleBase };
    this.calcScaleMarks();
  }

  public switchScale(value: boolean) {
    this.conf = { ...this.conf, vertical: value };
    this.calcScaleMarks();
  }

  public updateMin(value: number) {
    this.conf = { ...this.conf, min: value };
    this.calcScaleMarks();
  }

  public updateMax(value: number) {
    this.conf = { ...this.conf, max: value };
    this.calcScaleMarks();
  }

  private createScale() {
    const steps = this.slider.querySelectorAll('.js-slider-metalamp__mark');
    steps.forEach((element) => element.remove());
    this.scaleMarks.forEach((node) => {
      const element = document.createElement('div');
      element.classList.add('slider-metalamp__mark');
      element.classList.add('js-slider-metalamp__mark');
      const label = document.createElement('div');
      label.innerText = String(node.value);
      label.classList.add('slider-metalamp__label');
      element.appendChild(label);

      const modifier = !this.conf.scale ? 'slider-metalamp__mark_visually-hidden' : 'slider-metalamp__mark';
      element.classList.add(modifier);

      this.track.appendChild(element);
      const elementProperty = this.conf.vertical ? 'bottom' : 'left';
      const labelProperty = this.conf.vertical ? 'top' : 'left';
      const value = this.conf.vertical ? label.offsetHeight : label.offsetWidth;
      element.style[elementProperty] = `${String(node.position)}%`;
      label.style[labelProperty] = `${(value / 2) * (-1)}px`;
    });

    this.markList = [...this.track.querySelectorAll('.js-slider-metalamp__mark')];

    this.resize();
    return this.checkScaleLength(this.markList);
  }

  private checkScaleLength(markList: Element[]) {
    const hideLabels = (markListNew: Element[]) => {
      for (let i = 1; i < markListNew.length; i += 2) {
        const child = markListNew[i].firstElementChild;
        if (child) child.classList.add('slider-metalamp__label_hidden');
        markListNew[i].classList.add('slider-metalamp__mark_no-label');
        markListNew[i].classList.add('js-slider-metalamp__mark_no-label');
      }
      this.markList = [...this.track.querySelectorAll('.js-slider-metalamp__mark:not(.js-slider-metalamp__mark_no-label)')];

      this.lastLabelRemoved = true;
      this.checkScaleLength(this.markList);
    };

    const size = this.conf.vertical ? 'height' : 'width';
    const offsetSize = this.conf.vertical ? 'offsetHeight' : 'offsetWidth';

    let totalSize = 0;
    markList.forEach((node) => {
      const child = node.firstElementChild;
      if (child) totalSize += child.getBoundingClientRect()[size];
    });
    if (totalSize > this.track[offsetSize]) {
      hideLabels(markList);
      return this.markList;
    }
    if (this.lastLabelRemoved) this.addLastLabel(this.lastLabelRemoved);
    return this.markList;
  }

  private addLastLabel(isRemoved: boolean) {
    const markLabeledList = this.track.querySelectorAll('.js-slider-metalamp__mark:not(.js-slider-metalamp__mark_no-label)');
    const lastMarkLabeled = markLabeledList[markLabeledList.length - 1];
    const lastMark = this.track.querySelector('.js-slider-metalamp__mark:last-child');
    if (!isRemoved || !lastMark) return;
    lastMarkLabeled.classList.add('slider-metalamp__mark_no-label');
    lastMarkLabeled.classList.add('js-slider-metalamp__mark_no-label');
    const lastMarkLabeledChild = lastMarkLabeled.firstElementChild;
    if (!lastMarkLabeledChild) return;
    lastMarkLabeledChild.classList.add('slider-metalamp__label_hidden');
    lastMark.classList.remove('slider-metalamp__mark_no-label');
    lastMark.classList.remove('js-slider-metalamp__mark_no-label');
    const lastMarkChild = lastMark.firstElementChild;
    if (!lastMarkChild) return;
    lastMarkChild.classList.remove('slider-metalamp__label_hidden');
  }

  private resize() {
    this.startWidth = this.slider.offsetWidth;
    const handleResize = () => {
      const totalWidth = this.slider.offsetWidth;
      if (totalWidth < this.startWidth) {
        this.checkScaleLength(this.markList);
        this.startWidth = totalWidth;
      }
      if (totalWidth > this.startWidth) {
        this.createScale();
        this.startWidth = totalWidth;
      }
    };
    window.addEventListener('resize', handleResize);
  }

  private calcScaleMarks() {
    const { scaleBase } = this.conf;
    console.log(scaleBase);

    // if (!this.conf.step) this.conf.step = Math.abs((this.conf.max - this.conf.min) / 2);
    this.conf.step = this.conf.step ? Number(this.conf.step)
      : Math.abs((this.conf.max - this.conf.min) / 2);
    // if (!this.conf.interval) this.conf.interval = 2;
    this.conf.interval = this.conf.interval ? Number(this.conf.interval) : 2;
    const isStep = scaleBase === 'step';
    // const oppositeType = isStep ? 'interval' : 'step';
    const step = isStep ? this.conf.step : (this.conf.max - this.conf.min) / this.conf.interval;
    const interval = isStep ? (this.conf.max - this.conf.min) / this.conf.step : this.conf.interval;
    // console.log('step>>>', step);
    // console.log('interval>>>', interval);
    // const stepArgument = interval % 1 === 0 ? interval : Math.trunc(interval + 1);
    // const intervalArgument = step % 1 === 0 ? step : step.toFixed(2);
    // const argument = isStep ? stepArgument : intervalArgument;
    // this.conf[oppositeType] = parseFloat(argument);
    this.conf.step = step % 1 === 0 ? step : Math.trunc(step);
    this.conf.interval = interval % 1 === 0 ? interval : Math.trunc(interval + 1);
    const marksArray = [{ value: this.conf.min, position: 0 }];
    let value = this.conf.min;
    for (let i = 0; i < interval; i += 1) {
      const object: IPluginConfigurationItem = { value: 0, position: 0 };
      value += step;
      if (value <= this.conf.max) {
        const position = ((value - this.conf.min) * 100)
          / (this.conf.max - this.conf.min);
        // console.log('value>>>', value);

        object.value = parseFloat(value.toFixed(2));
        object.position = position;
        marksArray.push(object);
      }
    }
    if (marksArray[marksArray.length - 1].value
      < this.conf.max) marksArray.push({ value: this.conf.max, position: 100 });
    this.scaleMarks = marksArray;
    this.onScaleReady({
      scaleMarks: this.scaleMarks,
      step: this.conf.step,
      interval: this.conf.interval,
    });
    this.createScale();
  }
}

export default ViewScale;
