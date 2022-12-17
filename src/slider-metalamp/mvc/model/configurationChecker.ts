import { IPluginConfigurationFull } from '../interface';

function checkValue(type: string, value: number, configuration: IPluginConfigurationFull) {
  if (value <= 0) {
    switch (type) {
      case 'step':
        return (configuration.max - configuration.min) / 2;
      case 'interval':
        return 2;
      default:
        return 1;
    }
  }
  return value;
}

function checkMax(configuration: IPluginConfigurationFull) {
  if (configuration.max <= configuration.min) return configuration.min + 10;
  return configuration.max;
}

function checkFrom(configuration: IPluginConfigurationFull) {
  if (configuration.max <= configuration.min) return configuration.min;
  if (configuration.from < configuration.min) return configuration.min;
  if (configuration.from > configuration.max) {
    return configuration.range ? configuration.to - 10 : configuration.max;
  }
  if (configuration.range && configuration.from > configuration.to) return configuration.min;
  return configuration.from;
}

function checkTo(configuration: IPluginConfigurationFull) {
  if (configuration.max <= configuration.min) return configuration.min + 10;
  if (configuration.to < configuration.min) return configuration.from;
  if (configuration.to > configuration.max) {
    return configuration.range ? configuration.max : configuration.from;
  }
  return configuration.to;
}

function checkScaleBase(configuration: IPluginConfigurationFull) {
  if (configuration.scaleBase !== 'step' && configuration.scaleBase !== 'interval') return 'step';
  return configuration.scaleBase;
}

function checkConfiguration(configuration: IPluginConfigurationFull) {
  let checkedConfiguration = configuration;

  const numbers = ['min', 'max', 'from', 'to', 'step', 'interval', 'shiftOnKeyDown', 'shiftOnKeyHold'];

  const validatePropertyValue = (key: string, value: unknown) => {
    const checkedValue = Number.isNaN(Number(value)) ? 0 : Number(value);
    const obj = { [key]: checkedValue };
    checkedConfiguration = {
      ...checkedConfiguration, ...obj,
    };
  };

  Object.entries(checkedConfiguration).forEach((element) => {
    const [key, value] = element;
    if (numbers.includes(key)) validatePropertyValue(key, value);
  });

  const {
    shiftOnKeyDown,
    shiftOnKeyHold,
    step,
    interval,
  } = checkedConfiguration;

  checkedConfiguration.scaleBase = checkScaleBase(checkedConfiguration);
  checkedConfiguration.shiftOnKeyDown = checkValue('shiftOnKeyDown', shiftOnKeyDown, checkedConfiguration);
  checkedConfiguration.shiftOnKeyHold = checkValue('shiftOnKeyHold', shiftOnKeyHold, checkedConfiguration);
  checkedConfiguration.max = checkMax(checkedConfiguration);
  checkedConfiguration.to = checkTo(checkedConfiguration);
  checkedConfiguration.from = checkFrom(checkedConfiguration);
  checkedConfiguration.step = checkValue('step', step, checkedConfiguration);
  checkedConfiguration.interval = checkValue('interval', interval, checkedConfiguration);
  return checkedConfiguration;
}

export default checkConfiguration;
