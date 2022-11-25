class Radiobuttons {
  private elementName: string;

  private wrapper: HTMLElement;

  private radioMarks: NodeListOf<HTMLInputElement> | null = null;

  constructor(elementName: string, element: Element) {
    this.elementName = elementName;
    this.wrapper = element as HTMLElement;
    this.render();
    this.bindEventListeners();
  }

  private render() {
    this.radioMarks = this.wrapper.querySelectorAll(`${this.elementName}__category-radiomark`) as NodeListOf<HTMLInputElement>;
  }

  private bindEventListeners() {
    if (!this.radioMarks) return false;
    this.radioMarks.forEach((radioMark) => radioMark.addEventListener('keydown', this.handleCheckMarkKeydown));
    return true;
  }

  private handleCheckMarkKeydown = (event: KeyboardEvent) => {
    const target = event.target as HTMLInputElement;
    const parent = target.closest(`${this.elementName}__category`);
    if (!parent) return false;
    const radiobuttonHidden = parent.querySelector(`${this.elementName}__category-checkbox`) as HTMLInputElement;
    if (event.code !== 'Tab') {
      event.preventDefault();
      if (event.code === 'Space' && target.previousElementSibling) {
        radiobuttonHidden.click();
      }
    }
    return true;
  };
}

function renderRadiobuttons(selector: string) {
  const radiobuttons = document.querySelectorAll(selector);
  radiobuttons.forEach((radiobutton) => new Radiobuttons(selector, radiobutton));
}
renderRadiobuttons('.js-radiobuttons');
