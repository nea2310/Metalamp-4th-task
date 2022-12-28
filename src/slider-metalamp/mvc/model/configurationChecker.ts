import { IBusinessDataIndexed } from '../interface';

function checkConfiguration(configuration: IBusinessDataIndexed) {
  const checkedConfiguration = configuration;

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

  if (!min) min = 0;
  if (!max) max = 0;
  if (!from) from = 0;
  if (!to) to = 0;
  if (!shiftOnKeyDown) checkedConfiguration.shiftOnKeyDown = 1;
  if (!shiftOnKeyHold) checkedConfiguration.shiftOnKeyHold = 1;

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
    checkedConfiguration.from = temporaryValue;
  }

  return checkedConfiguration;
}

export default checkConfiguration;
