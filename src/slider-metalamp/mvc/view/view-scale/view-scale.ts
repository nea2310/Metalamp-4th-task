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

  // создаем деления
  public createScale(
    scaleMarks: { 'position'?: number, 'value'?: number }[],
    conf: IConfFull,
  ) {
    this.conf = conf;
    this.scaleMarks = scaleMarks;
    const steps = this.slider.querySelectorAll('.js-slider-metalamp__mark');
    if (this.calcMarkList) { // Если это переотрисовка шкалы - удалить существующие деления
      if (steps.length) {
        steps.forEach((element) => element.remove());
      }
      scaleMarks.forEach((node) => {
        const element = document.createElement('div');
        element.classList.add('slider-metalamp__mark');
        element.classList.add('js-slider-metalamp__mark');
        const label = document.createElement('div');
        label.innerText = String(node.value);
        label.classList.add('slider-metalamp__label');
        element.appendChild(label);

        if (conf.vertical) {
          element.style.bottom = `${String(node.position)}%`;
        } else {
          element.style.left = `${String(node.position)}%`;
        }
        if (!conf.scale) {
          element.classList.add('slider-metalamp__mark_visually-hidden');
        }
        this.track.appendChild(element);
        if (conf.vertical) {
          label.style.top = `${(label.offsetHeight / 2) * (-1)}px`;
        } else {
          label.style.left = `${(label.offsetWidth / 2) * (-1)}px`;
        }
      });

      this.markList = [...this.track.querySelectorAll('.js-slider-metalamp__mark')];
    }

    this.resize();
    return this.checkScaleLength(this.markList);
  }

  // проверяем, не налезают ли подписи друг на друга и если да - то удаляем каждую вторую
  private checkScaleLength(markList: Element[]) {
    // деактивируем правило ESLint, т.к. это рекурсивная функция
    // eslint-disable-next-line no-shadow
    const hideLabels = (markList: Element[]) => {
      // скрываем подпись каждого второго эл-та шага, а самому эл-ту добавляем класс "no-label"
      for (let i = 1; i < markList.length; i += 2) {
        const child = markList[i].firstElementChild as Element;
        child.classList.add('slider-metalamp__label_hidden');
        markList[i]
          .classList.add('slider-metalamp__mark_no-label');
        markList[i]
          .classList.add('js-slider-metalamp__mark_no-label');
      }
      // создаем новый markList из элементов, не имеющих класса "no-label" (с видимыми подписями)
      this.markList = [...this.track.querySelectorAll('.js-slider-metalamp__mark:not(.js-slider-metalamp__mark_no-label)')];

      // запускаем функцию проверки заново
      this.lastLabelRemoved = true;
      this.checkScaleLength(this.markList);
    };

    if (!this.conf.vertical) { // Горизонтальный слайдер
      let totalWidth = 0;
      // вычисляем общую ширину подписей к шагам
      markList.forEach((node) => {
        const child = node.firstElementChild as Element;
        totalWidth += child.getBoundingClientRect().width;
      });
      // если общая ширина подписей к шагам больше ширины шкалы
      if (totalWidth > this.track.offsetWidth) {
        // Скрываем подписи
        hideLabels(markList);
      } else {
        if (this.lastLabelRemoved) {
          // возвращаем подпись последнему шагу и выходим из рекурсии
          this.addLastLabel(this.lastLabelRemoved);
        }
        return this.markList;
      }
    } else { // Вертикальный слайдер
      let totalHeight = 0;
      markList.forEach((node) => {
        const child = node.firstElementChild as Element;
        totalHeight += child.getBoundingClientRect().height;
      });
      // если общая высота подписей к шагам больше высоты шкалы
      if (totalHeight > this.track.offsetHeight) {
        // Скрываем подписи
        hideLabels(markList);
      } else {
        if (this.lastLabelRemoved) {
          // возвращаем подпись последнему шагу и выходим из рекурсии
          this.addLastLabel(this.lastLabelRemoved);
        }
        return this.markList;
      }
    }
    return this.markList;
  }

  // возвращаем подпись у последненего шага и удаляем у предпоследнего подписанного
  private addLastLabel(isRemoved: boolean) {
    const markLabeledList = this.track.querySelectorAll('.js-slider-metalamp__mark:not(.js-slider-metalamp__mark_no-label)');
    const lastMarkLabeled = markLabeledList[markLabeledList.length - 1];
    const lastMark = this.track.querySelector('.js-slider-metalamp__mark:last-child') as Element;
    if (isRemoved) {
      lastMarkLabeled.classList.add('slider-metalamp__mark_no-label');
      lastMarkLabeled.classList.add('js-slider-metalamp__mark_no-label');
      const lastMarkLabeledChild = lastMarkLabeled.firstElementChild as Element;
      lastMarkLabeledChild.classList.add('slider-metalamp__label_hidden');
      lastMark.classList.remove('slider-metalamp__mark_no-label');
      lastMark.classList.remove('js-slider-metalamp__mark_no-label');
      const lastMarkChild = lastMark.firstElementChild as Element;
      lastMarkChild.classList.remove('slider-metalamp__label_hidden');
    }
  }

  private resize() {
    // запомним ширину враппера до ресайза
    this.startWidth = this.slider.offsetWidth;
    const handleResize = () => {
      const totalWidth = this.slider.offsetWidth;
      // если до и после отличается
      if (totalWidth !== this.startWidth) {
        if (totalWidth < this.startWidth) {
          this.checkScaleLength(this.markList);
        }
        if (totalWidth > this.startWidth) {
          this.createScale(this.scaleMarks, this.conf);
        }
        // запоминаем новую ширину до ресайза
        this.startWidth = totalWidth;
      }
    };
    window.addEventListener('resize', handleResize);
  }
}

export default ViewScale;
