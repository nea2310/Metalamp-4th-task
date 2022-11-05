import getValidValue from '../../shared/helpers/getValidValue';

export default function prepareOptions(options) {
  const {
    usage,
  } = options;

  const validUsages = ['vertical', 'range', 'bar', 'tip', 'scale', 'sticky', 'subscribe', 'disable', 'destroy'];

  return {
    elementName: 'toggle',
    usageChecked: getValidValue(validUsages, usage, ''),
  };
}
