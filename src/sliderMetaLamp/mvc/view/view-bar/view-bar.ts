import { IConfFull } from '../../interface';
import { defaultConf } from '../../utils';

class ViewBar {
  private slider: HTMLElement;

  private track: HTMLElement;

  private progressBar: HTMLElement;

  private controlMinDist: number = 0;

  private controlMaxDist: number = 0;

  private markList: HTMLElement[] = [];

  private conf: IConfFull = defaultConf;

  private checkNext: boolean = false;

  private lastLabelRemoved: boolean = false;

  constructor(root: HTMLElement, conf: IConfFull) {
    this.slider = root;
    this.conf = conf;
    this.track = ViewBar.getElem(this.slider, '.rs-metalamp__track') as HTMLElement;
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'rs-metalamp__progressBar';
    this.track.append(this.progressBar);
    this.switchBar(conf);
  }

  static getElem(obj: HTMLElement, selector: string) {
    return obj.querySelector(selector);
  }

  // переключение в вертикальный режим
  public switchVertical(conf: IConfFull) {
    const { classList } = this.progressBar;
    if (conf.vertical) {
      classList.add('rs-metalamp__progressBar_vert');
    } else { classList.remove('rs-metalamp__progressBar_vert'); }
  }

  // отключение / включение бара
  public switchBar(conf: IConfFull) {
    this.conf = conf;
    const { classList } = this.progressBar;
    if (this.conf.bar) { classList.remove('rs-metalamp__progressBar_hidden'); } else {
      classList.add('rs-metalamp__progressBar_hidden');
    }
  }

  // обновление бара при изменении позиций ползунков
  public updateBar(pos: number, length: number, isVertical: boolean) {
    const { style } = this.progressBar;
    if (!isVertical) {
      style.left = `${pos}%`;
      style.width = `${length}%`;
      style.bottom = '';
      style.height = '';
    } else {
      style.bottom = `${pos}%`;
      style.height = `${length}%`;
      style.left = '';
      style.width = '';
    }
  }
}

export default ViewBar;
