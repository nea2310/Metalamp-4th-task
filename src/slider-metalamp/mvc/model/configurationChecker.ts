import { IBusinessDataIndexed } from '../interface';

function checkValue(type: string, value: number | undefined, configuration: IBusinessDataIndexed) {
  if (value === undefined) return undefined;
  if (configuration.max === undefined || configuration.min === undefined) return undefined;
  // if (value <= 0) {
  //   switch (type) {
  //     case 'step':
  //       return Math.abs((configuration.max - configuration.min) / 2);
  //     case 'interval':
  //       return 2;
  //     default:
  //       return 0;
  //   }
  // }
  return value > 0 ? value : 0;
}

function checkMax(configuration: IBusinessDataIndexed) {
  if (configuration.max === undefined) return 0;
  if (configuration.min === undefined) return 0;
  if (configuration.max <= configuration.min) return configuration.min + 10;
  return configuration.max;
}

function checkFrom(configuration: IBusinessDataIndexed) {
  if (configuration.max === undefined) return 0;
  if (configuration.min === undefined) return 0;
  if (configuration.from === undefined) return 0;
  if (configuration.to === undefined) return 0;
  if (configuration.max <= configuration.min) return configuration.min;
  if (configuration.from < configuration.min) return configuration.min;
  if (configuration.from > configuration.max) {
    return configuration.range ? configuration.to - 10 : configuration.max;
  }
  if (configuration.range && configuration.from > configuration.to) return configuration.min;
  return configuration.from;
}

function checkTo(configuration: IBusinessDataIndexed) {
  if (configuration.max === undefined) return 0;
  if (configuration.min === undefined) return 0;
  if (configuration.from === undefined) return 0;
  if (configuration.to === undefined) return 0;
  if (configuration.max <= configuration.min) return configuration.min + 10;
  if (configuration.to < configuration.min) return configuration.max;
  if (configuration.to > configuration.max) {
    return configuration.range ? configuration.max : configuration.from;
  }
  return configuration.to;
}

// function checkScaleBase(configuration: IBusinessDataIndexed) {
//  if (configuration.scaleBase !== 'step' && configuration.scaleBase !== 'interval') return 'step';
//   return configuration.scaleBase;
// }

function checkConfiguration(configuration: IBusinessDataIndexed) {
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
    // step,
    // interval,
  } = checkedConfiguration;

  // checkedConfiguration.scaleBase = checkScaleBase(checkedConfiguration);
  checkedConfiguration.shiftOnKeyDown = checkValue('shiftOnKeyDown', shiftOnKeyDown, checkedConfiguration);
  checkedConfiguration.shiftOnKeyHold = checkValue('shiftOnKeyHold', shiftOnKeyHold, checkedConfiguration);
  checkedConfiguration.max = checkMax(checkedConfiguration);
  checkedConfiguration.to = checkTo(checkedConfiguration);
  checkedConfiguration.from = checkFrom(checkedConfiguration);
  // checkedConfiguration.step = checkValue('step', step, checkedConfiguration);
  // checkedConfiguration.interval = checkValue('interval', interval, checkedConfiguration);
  return checkedConfiguration;
}

export default checkConfiguration;
