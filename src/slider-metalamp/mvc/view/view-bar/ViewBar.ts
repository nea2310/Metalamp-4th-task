import { IPluginConfigurationFull } from '../../interface';

class ViewBar {
  private slider: HTMLElement;

  private track: Element | null = null;

  private fromPosition = 0;

  private toPosition = 0;

  private isRange = false;

  private isVertical = false;

  private progressBar?: HTMLElement;

  constructor(
    root: HTMLElement,
    initialConfiguration: IPluginConfigurationFull,
    fromPosition: number,
    toPosition: number,
  ) {
    this.slider = root;
    this.fromPosition = fromPosition;
    this.toPosition = toPosition;
    this.isRange = initialConfiguration.range;
    this.isVertical = initialConfiguration.vertical;
    this.render();
  }

  static getElement(object: HTMLElement, selector: string) {
    return object.querySelector(selector);
  }

  public updateBar(data: {
    fromPosition: number,
    toPosition: number,
    isRange: boolean,
    isVertical: boolean,
  }) {
    const {
      fromPosition,
      toPosition,
      isRange,
      isVertical,
    } = data;

    let position = 0;
    let length = fromPosition;

    if (isRange) {
      position = fromPosition;
      length = toPosition - fromPosition;
    }

    if (!this.progressBar) return;

    const { style } = this.progressBar;
    style.left = isVertical ? '' : `${position}%`;
    style.width = isVertical ? '' : `${length}%`;
    style.bottom = isVertical ? `${position}%` : '';
    style.height = isVertical ? `${length}%` : '';
  }

  private render() {
    this.track = ViewBar.getElement(this.slider, '.slider-metalamp__track');
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'slider-metalamp__progress-bar';
    if (!this.track) return;
    this.track.append(this.progressBar);
    this.updateBar({
      fromPosition: this.fromPosition,
      toPosition: this.toPosition,
      isRange: this.isRange,
      isVertical: this.isVertical,
    });
  }
}

export default ViewBar;
