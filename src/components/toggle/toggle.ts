class Toggle {
  private elementName: string;

  private wrapper: HTMLElement;

  private checkboxHidden: HTMLInputElement | null = null;

  private checkMark: HTMLElement | null = null;

  constructor(elementName: string, element: Element) {
    this.elementName = elementName;
    this.wrapper = element as HTMLElement;
    this.render();
    this.bindEventListeners();
  }

  private render() {
    this.checkboxHidden = this.wrapper.querySelector(`${this.elementName}__checkbox`);
    this.checkMark = this.wrapper.querySelector(`${this.elementName}__checkmark`);
  }

  private bindEventListeners() {
    if (!this.checkMark) return false;
    this.checkMark.addEventListener('keydown', this.handleCheckMarkKeydown);
    return true;
  }

  private handleCheckMarkKeydown = (event: KeyboardEvent) => {
    if (event.code !== 'Tab') {
      event.preventDefault();
      if (event.code === 'Space' && this.checkboxHidden) {
        this.checkboxHidden.click();
      }
    }
  }
}

function renderToggles(selector: string) {
  const inputFields = document.querySelectorAll(selector);
  inputFields.forEach((inputMask) => new Toggle(selector, inputMask));
}
renderToggles('.js-toggle');
