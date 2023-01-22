import { IBusinessDataIndexed } from '../interface';

function checkConfiguration(configuration: IBusinessDataIndexed) {
  const checkedConfiguration = configuration;
  const DEFAULT_VALUE = 0;
  const DEFAULT_SHIFT = 1;

  if (!checkedConfiguration.min && checkedConfiguration.min !== 0) {
    checkedConfiguration.min = DEFAULT_VALUE;
  }
  if (!checkedConfiguration.max && checkedConfiguration.max !== 0) {
    checkedConfiguration.max = DEFAULT_SHIFT;
  }
  if (!checkedConfiguration.from && checkedConfiguration.from !== 0) {
    checkedConfiguration.from = DEFAULT_VALUE;
  }
  if (!checkedConfiguration.to && checkedConfiguration.to !== 0) {
    checkedConfiguration.to = DEFAULT_SHIFT;
  }
  if (!checkedConfiguration.shiftOnKeyDown) checkedConfiguration.shiftOnKeyDown = DEFAULT_SHIFT;
  if (!checkedConfiguration.shiftOnKeyHold) checkedConfiguration.shiftOnKeyHold = DEFAULT_SHIFT;

  if (checkedConfiguration.min === checkedConfiguration.max) {
    checkedConfiguration.max = checkedConfiguration.min + DEFAULT_SHIFT;
  }

  if (checkedConfiguration.from === checkedConfiguration.to) {
    checkedConfiguration.from = checkedConfiguration.min;
    checkedConfiguration.to = checkedConfiguration.max;
  }

  if (checkedConfiguration.min > checkedConfiguration.max) {
    const temporaryValue = checkedConfiguration.max;
    checkedConfiguration.max = checkedConfiguration.min;
    checkedConfiguration.min = temporaryValue;
  }

  if (checkedConfiguration.from < checkedConfiguration.min) {
    checkedConfiguration.from = checkedConfiguration.min;
  }

  if (checkedConfiguration.from > checkedConfiguration.max) {
    checkedConfiguration.from = checkedConfiguration.range
      ? checkedConfiguration.to : checkedConfiguration.max;
  }

  if (checkedConfiguration.to <= checkedConfiguration.min) {
    checkedConfiguration.to = checkedConfiguration.from;
  }

  if (checkedConfiguration.to > checkedConfiguration.max) {
    checkedConfiguration.to = checkedConfiguration.max;
  }

  if (checkedConfiguration.from > checkedConfiguration.to && checkedConfiguration.range) {
    const temporaryValue = checkedConfiguration.to;
    checkedConfiguration.to = checkedConfiguration.from;
    checkedConfiguration.from = temporaryValue;
  }

  return checkedConfiguration;
}

export default checkConfiguration;
