import { IConfFull } from '../../interface';

class ViewScale {
  private slider: HTMLElement;

  private startWidth: number = 0;

  private track: HTMLElement;

  private markList: Element[] = [];

  private conf: IConfFull;

  private lastLabelRemoved: boolean = false;

  private scaleMarks: { 'position'?: number, 'value'?: number }[] = [];

  private calcMarkList: boolean = false;

  constructor(
    slider: HTMLElement,
    track: HTMLElement,
    conf: IConfFull,
    markList: HTMLElement[] = [],
  ) {
    this.conf = conf;
    this.slider = slider;
    this.track = track;
    if (markList.length === 0) {
      this.calcMarkList = true;
    } else {
      this.markList = markList;
    }
  }

  public createScale(
    scaleMarks: { 'position'?: number, 'value'?: number }[],
    conf: IConfFull,
  ) {
    this.conf = conf;
    this.scaleMarks = scaleMarks;
    const steps = this.slider.querySelectorAll('.js-slider-metalamp__mark');
    if (this.calcMarkList) {
      steps.forEach((element) => element.remove());
      scaleMarks.forEach((node) => {
        const element = document.createElement('div');
        element.classList.add('slider-metalamp__mark');
        element.classList.add('js-slider-metalamp__mark');
        const label = document.createElement('div');
        label.innerText = String(node.value);
        label.classList.add('slider-metalamp__label');
        element.appendChild(label);

        const modifier = !conf.scale ? 'slider-metalamp__mark_visually-hidden' : 'slider-metalamp__mark';
        element.classList.add(modifier);

        this.track.appendChild(element);
        const elementProperty = conf.vertical ? 'bottom' : 'left';
        const labelProperty = conf.vertical ? 'top' : 'left';
        const value = conf.vertical ? label.offsetHeight : label.offsetWidth;
        element.style[elementProperty] = `${String(node.position)}%`;
        label.style[labelProperty] = `${(value / 2) * (-1)}px`;
      });

      this.markList = [...this.track.querySelectorAll('.js-slider-metalamp__mark')];
    }

    this.resize();
    return this.checkScaleLength(this.markList);
  }

  private checkScaleLength(markList: Element[]) {
    const hideLabels = (markListNew: Element[]) => {
      for (let i = 1; i < markListNew.length; i += 2) {
        const child = markListNew[i].firstElementChild;
        if (child) {
          child.classList.add('slider-metalamp__label_hidden');
        }
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
      if (child) {
        totalSize += child.getBoundingClientRect()[size];
      }
    });
    if (totalSize > this.track[offsetSize]) {
      hideLabels(markList);
      return this.markList;
    }
    if (this.lastLabelRemoved) {
      this.addLastLabel(this.lastLabelRemoved);
    }
    return this.markList;
  }

  private addLastLabel(isRemoved: boolean) {
    const markLabeledList = this.track.querySelectorAll('.js-slider-metalamp__mark:not(.js-slider-metalamp__mark_no-label)');
    const lastMarkLabeled = markLabeledList[markLabeledList.length - 1];
    const lastMark = this.track.querySelector('.js-slider-metalamp__mark:last-child');
    if (!isRemoved || !lastMark) {
      return;
    }
    lastMarkLabeled.classList.add('slider-metalamp__mark_no-label');
    lastMarkLabeled.classList.add('js-slider-metalamp__mark_no-label');
    const lastMarkLabeledChild = lastMarkLabeled.firstElementChild;
    if (!lastMarkLabeledChild) {
      return;
    }
    lastMarkLabeledChild.classList.add('slider-metalamp__label_hidden');
    lastMark.classList.remove('slider-metalamp__mark_no-label');
    lastMark.classList.remove('js-slider-metalamp__mark_no-label');
    const lastMarkChild = lastMark.firstElementChild;
    if (!lastMarkChild) {
      return;
    }
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
        this.createScale(this.scaleMarks, this.conf);
        this.startWidth = totalWidth;
      }
    };
    window.addEventListener('resize', handleResize);
  }
}

export default ViewScale;
