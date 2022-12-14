type AllowedTypes = 'input' | 'toggle' | 'radiobuttons';

function getElement(wrapper: HTMLElement, selector: string, type: AllowedTypes = 'input') {
  let element: HTMLInputElement | null = null;
  switch (type) {
    case 'input':
      element = wrapper.querySelector(`.js-${type}-field__${type}_usage_${selector}`);
      break;
    case 'radiobuttons':
      element = wrapper.querySelector(`.js-${type}__category-checkbox_usage_${selector}`);
      break;
    default:
      element = wrapper.querySelector(`.js-${type}__checkbox_usage_${selector}`);
  }
  return element;
}

export default getElement;
