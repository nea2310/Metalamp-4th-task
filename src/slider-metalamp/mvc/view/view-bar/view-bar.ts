class ViewBar {
  private slider: HTMLElement;

  private track: HTMLElement | undefined;

  private progressBar: HTMLElement | undefined;;

  constructor(root: HTMLElement) {
    this.slider = root;
    this.render();
  }

  private render() {
    this.track = ViewBar.getElement(this.slider, '.slider-metalamp__track') as HTMLElement;
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'slider-metalamp__progress-bar';
    this.track.append(this.progressBar);
  }

  static getElement(object: HTMLElement, selector: string) {
    return object.querySelector(selector);
  }

  // обновление бара при изменении позиций ползунков
  public updateBar(position: number, length: number, isVertical: boolean) {
    if (this.progressBar) {
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
}

export default ViewBar;
