class ViewBar {
  private slider: HTMLElement;

  private track: HTMLElement | undefined;

  private progressBar: HTMLElement | undefined;;

  constructor(root: HTMLElement) {
    this.slider = root;
    this.render();
  }

  static getElement(object: HTMLElement, selector: string) {
    return object.querySelector(selector);
  }

  public updateBar(
    fromPosition: number,
    toPosition: number,
    isRange: boolean,
    isVertical: boolean,
  ) {
    let position = 0;
    let length = fromPosition;

    if (isRange) {
      position = fromPosition;
      length = toPosition - fromPosition;
    }

    if (!this.progressBar) {
      return;
    }

    const { style } = this.progressBar;
    style.left = isVertical ? '' : `${position}%`;
    style.width = isVertical ? '' : `${length}%`;
    style.bottom = isVertical ? `${position}%` : '';
    style.height = isVertical ? `${length}%` : '';
  }

  private render() {
    this.track = ViewBar.getElement(this.slider, '.slider-metalamp__track') as HTMLElement;
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'slider-metalamp__progress-bar';
    this.track.append(this.progressBar);
  }
}

export default ViewBar;
