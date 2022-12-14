import getElement from './getElement';

type AllowedTypes = 'input' | 'toggle' | 'radiobuttons';

const prepareElements = (options: Array<[string, AllowedTypes]>, wrapper: HTMLElement) => {
  const optionObjects: Array<HTMLInputElement> = [];
  options.forEach((option) => {
    const [key, value] = option;
    const object = getElement(wrapper, key, value);
    if (object) {
      optionObjects.push(object);
    }
  });
  return optionObjects;
};

export default prepareElements;
