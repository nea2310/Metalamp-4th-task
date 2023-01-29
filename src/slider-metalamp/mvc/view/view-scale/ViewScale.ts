import Observer from '../../Observer';
import {
  IPluginConfigurationFull,
  IScaleMark,
  TPluginConfiguration,
} from '../../interface';

class ViewScale extends Observer {
  private slider: HTMLElement;

  private startWidth: number = 0;

  private track: HTMLElement;

  private markList: Element[] = [];

  private configuration: IPluginConfigurationFull;

  private lastLabelRemoved: boolean = false;

  private scaleMarks: IScaleMark[] = [];

  constructor(
    slider: HTMLElement,
    track: HTMLElement,
    configuration: IPluginConfigurationFull,
  ) {
    super();
    this.configuration = configuration;
    this.slider = slider;
    this.track = track;
    this.calcScaleMarks();
  }

  get marks() {
    return this.scaleMarks;
  }

  public update(data: TPluginConfiguration) {
    this.configuration = { ...this.configuration, ...data };
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

      const modifier = !this.configuration.scale ? 'slider-metalamp__mark_visually-hidden' : 'slider-metalamp__mark';
      element.classList.add(modifier);

      this.track.appendChild(element);
      const elementProperty = this.configuration.vertical ? 'bottom' : 'left';
      const labelProperty = this.configuration.vertical ? 'top' : 'left';
      const value = this.configuration.vertical ? label.offsetHeight : label.offsetWidth;
      element.style[elementProperty] = `${String(node.position)}%`;
      label.style[labelProperty] = `${(value / 2) * (-1)}px`;
    });

    this.markList = [...this.track.querySelectorAll('.js-slider-metalamp__mark')];

    this.resize();
    return this.checkScaleLength(this.markList);
  }

  private hideLabels(markListNew: Element[]) {
    for (let i = 1; i < markListNew.length; i += 2) {
      const child = markListNew[i].firstElementChild;
      if (child) child.classList.add('slider-metalamp__label_hidden');
      markListNew[i].classList.add('slider-metalamp__mark_no-label');
      markListNew[i].classList.add('js-slider-metalamp__mark_no-label');
    }
    this.markList = [...this.track.querySelectorAll('.js-slider-metalamp__mark:not(.js-slider-metalamp__mark_no-label)')];

    this.lastLabelRemoved = true;
    this.checkScaleLength(this.markList);
  }

  private checkScaleLength(markList: Element[]) {
    const size = this.configuration.vertical ? 'height' : 'width';
    const offsetSize = this.configuration.vertical ? 'offsetHeight' : 'offsetWidth';

    let totalSize = 0;
    markList.forEach((node) => {
      const child = node.firstElementChild;
      if (child) totalSize += child.getBoundingClientRect()[size];
    });
    if (totalSize > this.track[offsetSize]) {
      this.hideLabels(markList);
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
    const { scaleBase, min, max } = this.configuration;
    let { step, interval } = this.configuration;
    step = step ? Number(step) : Math.abs((max - min) / 2);
    interval = interval ? Number(interval) : 2;
    const isStep = scaleBase === 'step';

    let stepValue = isStep ? step : (max - min) / interval;
    if (!stepValue) stepValue = 1;
    let intervalValue = isStep ? (max - min) / step : interval;
    if (!intervalValue) intervalValue = 1;

    this.configuration.step = stepValue % 1 === 0 ? stepValue : Math.trunc(stepValue);
    this.configuration.interval = intervalValue % 1 === 0 ? intervalValue
      : Math.trunc(intervalValue + 1);
    const marksArray = [{ value: min, position: 0 }];

    let value = min;
    for (let i = 0; i < intervalValue; i += 1) {
      const object: IScaleMark = { value: 0, position: 0 };
      value += stepValue;
      if (value <= max) {
        const position = ((value - min) * 100) / (max - min);
        object.value = parseFloat(value.toFixed(2));
        object.position = position;
        marksArray.push(object);
      }
    }
    if (marksArray[marksArray.length - 1].value
      < max) marksArray.push({ value: max, position: 100 });
    this.scaleMarks = marksArray;
    this.notify('viewScaleUpdate', {
      scaleMarks: this.scaleMarks,
      step: this.configuration.step,
      interval: this.configuration.interval,
    });
    this.createScale();
  }
}

export default ViewScale;
