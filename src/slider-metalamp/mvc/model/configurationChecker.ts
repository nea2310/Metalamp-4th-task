import { TPluginConfiguration } from '../interface';

function checkConfiguration(configuration: TPluginConfiguration) {
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
  if (!checkedConfiguration.shiftOnKeyDown
    || checkedConfiguration.shiftOnKeyDown < 0) {
    checkedConfiguration.shiftOnKeyDown = DEFAULT_SHIFT;
  }
  if (!checkedConfiguration.shiftOnKeyHold
    || checkedConfiguration.shiftOnKeyHold < 0) {
    checkedConfiguration.shiftOnKeyHold = DEFAULT_SHIFT;
  }

  if (checkedConfiguration.min === checkedConfiguration.max) {
    checkedConfiguration.max = checkedConfiguration.min + DEFAULT_SHIFT;
  }

  if (checkedConfiguration.from > checkedConfiguration.to && checkedConfiguration.range) {
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

  const minStep = (checkedConfiguration.max - checkedConfiguration.min) / 2;
  const stepCondition = Number(checkedConfiguration.step) < minStep
    && !Number.isNaN(checkedConfiguration.step)
    && Number(checkedConfiguration.step) > 0;

  if (!stepCondition) {
    checkedConfiguration.step = minStep;
  }

  const intervalCondition = Number(checkedConfiguration.interval) > DEFAULT_SHIFT
  && !Number.isNaN(checkedConfiguration.interval)
  && Number(checkedConfiguration.interval) > 0;

  if (!intervalCondition) {
    checkedConfiguration.interval = DEFAULT_SHIFT * 2;
  }

  return checkedConfiguration;
}

export default checkConfiguration;
