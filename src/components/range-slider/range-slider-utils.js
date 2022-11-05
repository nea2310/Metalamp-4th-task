import getValidValue from '../../shared/helpers/getValidValue';

export default function prepareOptions(options) {
  const {
    min,
    max,
    from,
    to,
    vertical,
    range,
    bar,
    tip,
    scale,
    scaleBase,
    step,
    interval,
    sticky,
    shiftOnKeyDown,
    shiftOnKeyHold,
  } = options;

  const validStates = ['true', 'false'];
  const validScaleBases = ['step', 'interval'];

  return {
    elementName: 'range-slider',

    minChecked: Number.isFinite(Number(min)) ? min : '0',
    maxChecked: Number.isFinite(Number(max)) ? max : '0',
    fromChecked: Number.isFinite(Number(from)) ? from : '0',
    toChecked: Number.isFinite(Number(to)) ? to : '0',
    stepChecked: Number.isFinite(Number(step)) ? step : '0',
    intervalChecked: Number.isFinite(Number(interval)) ? interval : '0',
    shiftOnKeyDownChecked: Number.isFinite(Number(shiftOnKeyDown)) ? shiftOnKeyDown : '0',
    shiftOnKeyHoldChecked: Number.isFinite(Number(shiftOnKeyHold)) ? shiftOnKeyHold : '0',

    verticalChecked: getValidValue(validStates, vertical, 'false'),
    rangeChecked: getValidValue(validStates, range, 'true'),
    barChecked: getValidValue(validStates, bar, 'true'),
    tipChecked: getValidValue(validStates, tip, 'true'),
    scaleChecked: getValidValue(validStates, scale, 'true'),
    stickyChecked: getValidValue(validStates, sticky, 'false'),
    scaleBaseChecked: getValidValue(validScaleBases, scaleBase, 'step'),

    modifier: vertical === 'true' ? '_orientation_vertical' : '',
  };
}
