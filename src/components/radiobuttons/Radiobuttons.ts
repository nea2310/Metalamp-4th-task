class Radiobuttons {
  private wrapper: HTMLElement;

  private elementName: string;

  private radioMarks: NodeListOf<HTMLInputElement> | null = null;

  constructor(element: Element, elementName = 'radiobuttons') {
    this.wrapper = element as HTMLElement;
    this.elementName = elementName;
    this.render();
    this.addEventListeners();
  }

  private render() {
    this.radioMarks = this.wrapper.querySelectorAll(`.js-${this.elementName}__category-radiomark`) as NodeListOf<HTMLInputElement>;
  }

  private addEventListeners() {
    if (!this.radioMarks) return false;
    this.radioMarks.forEach((radioMark) => radioMark.addEventListener('keydown', this.handleCheckMarkKeydown));
    return true;
  }

  private handleCheckMarkKeydown = (event: KeyboardEvent) => {
    const target = event.target as HTMLInputElement;
    const parent = target.closest(`.js-${this.elementName}__category`);
    if (!parent || event.code === 'Tab') return false;
    const radiobuttonHidden = parent.querySelector(`.js-${this.elementName}__category-checkbox`) as HTMLInputElement;
    event.preventDefault();
    if (event.code === 'Space' && target.previousElementSibling) {
      radiobuttonHidden.click();
    }
    return true;
  };
}

export default Radiobuttons;
