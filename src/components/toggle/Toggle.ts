class Toggle {
  private elementName: string;

  private wrapper: HTMLElement;

  private checkboxHidden: HTMLInputElement | null = null;

  private checkMark: HTMLElement | null = null;

  constructor(element: Element, elementName = 'toggle') {
    this.elementName = elementName;
    this.wrapper = element as HTMLElement;
    this.render();
    this.addEventListeners();
  }

  private render() {
    this.checkboxHidden = this.wrapper.querySelector(`.js-${this.elementName}__checkbox`);
    this.checkMark = this.wrapper.querySelector(`.js-${this.elementName}__checkmark`);
  }

  private addEventListeners() {
    if (!this.checkMark) {
      return;
    }
    this.checkMark.addEventListener('keydown', this.handleCheckMarkKeydown);
  }

  private handleCheckMarkKeydown = (event: KeyboardEvent) => {
    if (event.code === 'Space' && this.checkboxHidden) {
      event.preventDefault();
      this.checkboxHidden.click();
    }
  };
}

export default Toggle;
