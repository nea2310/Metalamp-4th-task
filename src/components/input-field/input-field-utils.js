import getValidValue from '../../shared/helpers/getValidValue';

export default function prepareOptions(options) {
  const {
    usage,
  } = options;

  const validUsages = ['min', 'max', 'from', 'to', 'step', 'interval', 'shiftOnKeyDown', 'shiftOnKeyHold'];

  return {
    elementName: 'input-field',
    usageChecked: getValidValue(validUsages, usage, ''),
  };
}
