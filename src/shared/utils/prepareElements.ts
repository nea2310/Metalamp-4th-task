import { TAllowedTypes } from '../../slider-metalamp/mvc/interface';
import getElement from './getElement';

const prepareElements = (options: Array<[string, TAllowedTypes]>, wrapper: HTMLElement) => {
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
