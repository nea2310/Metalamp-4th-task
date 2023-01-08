import { IBusinessDataIndexed } from '../interface';

function checkConfiguration(configuration: IBusinessDataIndexed) {
  const checkedConfiguration = configuration;
  const DEFAULT_VALUE = 0;
  const DEFAULT_SHIFT = 1;

  let {
    min,
    max,
    from,
    to,
  } = checkedConfiguration;

  const {
    range,
    shiftOnKeyDown,
    shiftOnKeyHold,
  } = checkedConfiguration;

  if (!min) min = DEFAULT_VALUE;
  if (!max) max = DEFAULT_VALUE;
  if (!from) from = DEFAULT_VALUE;
  if (!to) to = DEFAULT_VALUE;
  if (!shiftOnKeyDown) checkedConfiguration.shiftOnKeyDown = DEFAULT_SHIFT;
  if (!shiftOnKeyHold) checkedConfiguration.shiftOnKeyHold = DEFAULT_SHIFT;

  if (min > max) {
    const temporaryValue = max;
    checkedConfiguration.max = min;
    checkedConfiguration.min = temporaryValue;
  }

  if (from < min) checkedConfiguration.from = min;

  if (from > max) checkedConfiguration.from = range ? to : max;

  if (to <= min) checkedConfiguration.to = from;

  if (to > max) checkedConfiguration.to = max;

  if (range && to < from) {
    const temporaryValue = to;
    checkedConfiguration.to = from;
    checkedConfiguration.from = temporaryValue;
  }

  return checkedConfiguration;
}

export default checkConfiguration;
