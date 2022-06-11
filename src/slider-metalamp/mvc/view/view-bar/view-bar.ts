import { IConfFull } from '../../interface';
import { defaultConf } from '../../utils';

class ViewBar {
  private slider: HTMLElement;

  private track: HTMLElement;

  private progressBar: HTMLElement;

  private conf: IConfFull = defaultConf;

  constructor(root: HTMLElement, conf: IConfFull) {
    this.slider = root;
    this.conf = conf;
    this.track = ViewBar.getElement(this.slider, '.slider-metalamp__track') as HTMLElement;
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'slider-metalamp__progressBar';
    this.track.append(this.progressBar);
    this.switchBar(conf);
  }

  static getElement(object: HTMLElement, selector: string) {
    return object.querySelector(selector);
  }

  // переключение в вертикальный режим
  public switchVertical(conf: IConfFull) {
    const { classList } = this.progressBar;
    if (conf.vertical) {
      classList.add('slider-metalamp__progressBar__orientation_vertical');
    } else { classList.remove('slider-metalamp__progressBar__orientation_vertical'); }
  }

  // отключение / включение бара
  public switchBar(conf: IConfFull) {
    this.conf = conf;
    const { classList } = this.progressBar;
    if (this.conf.bar) { classList.remove('slider-metalamp__progressBar_hidden'); } else {
      classList.add('slider-metalamp__progressBar_hidden');
    }
  }

  // обновление бара при изменении позиций ползунков
  public updateBar(position: number, length: number, isVertical: boolean) {
    const { style } = this.progressBar;
    if (!isVertical) {
      style.left = `${position}%`;
      style.width = `${length}%`;
      style.bottom = '';
      style.height = '';
    } else {
      style.bottom = `${position}%`;
      style.height = `${length}%`;
      style.left = '';
      style.width = '';
    }
  }
}

export default ViewBar;
