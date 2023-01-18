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

  if (!min && min !== 0) min = DEFAULT_VALUE;
  if (!max && max !== 0) max = DEFAULT_SHIFT;
  if (!from && from !== 0) from = DEFAULT_VALUE;
  if (!to && to !== 0) to = DEFAULT_SHIFT;
  if (!shiftOnKeyDown) checkedConfiguration.shiftOnKeyDown = DEFAULT_SHIFT;
  if (!shiftOnKeyHold) checkedConfiguration.shiftOnKeyHold = DEFAULT_SHIFT;

  if (min === max) {
    checkedConfiguration.max = min + DEFAULT_SHIFT;
  }

  if (from === to) {
    checkedConfiguration.from = checkedConfiguration.min;
    checkedConfiguration.to = checkedConfiguration.max;
  }

  if (min > max) {
    const temporaryValue = max;
    checkedConfiguration.max = min;
    checkedConfiguration.min = temporaryValue;
  }

  if (from < min) checkedConfiguration.from = min;

  if (from > max) checkedConfiguration.from = range ? to : max;

  if (to <= min) checkedConfiguration.to = from;

  if (to > max) checkedConfiguration.to = max;

  if (to < from) {
    const temporaryValue = to;
    checkedConfiguration.to = from;
    checkedConfiguration.from = temporaryValue >= Number(checkedConfiguration.min)
      ? temporaryValue : checkedConfiguration.min;
  }

  return checkedConfiguration;
}

export default checkConfiguration;
