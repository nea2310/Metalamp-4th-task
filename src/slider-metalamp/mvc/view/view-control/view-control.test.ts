import Model from '../../model/Model';
import { Controller } from '../../controller/Controller';
import { IConfFull } from '../../interface';
import View from '../View';
import ViewControl from './ViewControl';

function mockPointerEvent(element: HTMLElement, {
  eventType, clientX = 0, clientY = 0,
}: {
  eventType: string, clientX?: number, clientY?: number,
}): void {
  const pointerEvent = new MouseEvent(eventType, {
    bubbles: true,
    clientX,
    clientY,
  });

  const targetElement = element;

  targetElement.setPointerCapture = jest.fn(targetElement.setPointerCapture);
  targetElement.releasePointerCapture = jest.fn(targetElement.releasePointerCapture);
  targetElement.dispatchEvent(pointerEvent);
}

function mockKeyboardEvent(
  element: HTMLElement,
  { eventType, direction = 'ArrowLeft', repeat = false }:
  { eventType: string, direction: string, repeat: boolean },
): void {
  const keyboardEvent = new KeyboardEvent(
    eventType,
    {
      code: direction,
      repeat,
      bubbles: true,
    },
  );

  const targetElement = element;

  targetElement.setPointerCapture = jest.fn(targetElement.setPointerCapture);
  targetElement.releasePointerCapture = jest.fn(targetElement.releasePointerCapture);
  targetElement.dispatchEvent(keyboardEvent);
}

const parent = document.createElement('input');
document.body.appendChild(parent);
const conf: IConfFull = {
  min: 10,
  max: 100,
  from: 20,
  to: 70,
  vertical: false,
  range: true,
  bar: true,
  tip: true,
  scale: true,
  scaleBase: 'step',
  step: 10,
  interval: 0,
  sticky: false,
  shiftOnKeyDown: 1,
  shiftOnKeyHold: 1,
  onStart: () => true,
  onChange: () => true,
  onUpdate: () => true,
};
const getElem = (selector: string) => document.getElementsByClassName(selector)[0];

const testModel = new Model(conf);
const testView = new View(parent);

/* не присваиваем объект переменной, т.к. она нигде в коде не будет
использоваться и будет другая ошибка линтера
("'controller' is assigned a value but never used.eslint@typescript-eslint/no-unused-vars") */

// eslint-disable-next-line no-new
new Controller(testModel, testView);

const calcPositionSpy = jest.spyOn(testModel, 'calcPositionSetByPointer');
const calcPositionSetByKeySpy = jest.spyOn(testModel, 'calcPositionSetByKey');

const controlMax = getElem('slider-metalamp__control-max');
const tipMin = getElem('slider-metalamp__tip-min');
const tipMax = getElem('slider-metalamp__tip-max');
const track = getElem('slider-metalamp__track');

describe('apply styles on calling ViewControl method', () => {
  const { viewControl } = testView;
  if (!(viewControl instanceof ViewControl)) {
    return;
  }

  test('updatePos', () => {
    expect(controlMax)
      .toHaveProperty('style.left', '66.66666666666667%');
    expect(controlMax)
      .toHaveProperty('style.bottom', '');
    if (controlMax instanceof HTMLElement) {
      viewControl.updatePos(controlMax, 50);
    }

    expect(controlMax).toHaveProperty('style.left', '50%');
    expect(controlMax).toHaveProperty('style.bottom', '');
  });

  test('change tip inner text on calling updateVal method', () => {
    if (tipMin instanceof HTMLElement && tipMax instanceof HTMLElement) {
      expect(tipMin.innerText).toBe('20');
      expect(tipMax.innerText).toBe('70');
      viewControl.updateVal('25', true);
      viewControl.updateVal('30', false);
      expect(tipMin.innerText).toBe('25');
      expect(tipMax.innerText).toBe('30');
    }
  
  });

  test('update input value on calling updateInput method', () => {
    expect(parent.value).toBe('20, 70');
    viewControl.updateInput({
      min: 10,
      max: 100,
      from: 25,
      to: 30,
      vertical: false,
      range: true,
      bar: true,
      tip: true,
      scale: true,
      scaleBase: 'step',
      step: 10,
      interval: 0,
      sticky: false,
      shiftOnKeyDown: 1,
      shiftOnKeyHold: 1,
      onStart: () => true,
      onChange: () => true,
      onUpdate: () => true,
    });
    expect(parent.value).toBe('25, 30');
  });
});

describe('ViewControl event listeners', () => {
  afterEach(() => {
    calcPositionSpy.mockClear();
  });

  test('notifies observer about control mooving made by mouse', () => {
    if (controlMax instanceof HTMLElement) {
      mockPointerEvent(
        controlMax,
        { eventType: 'pointerdown', clientY: 100, clientX: 100 },
      );
      mockPointerEvent(
        controlMax,
        { eventType: 'pointermove', clientY: 100, clientX: 1000 },
      );
    }
    expect(calcPositionSpy).toBeCalledTimes(1);
    expect(calcPositionSpy).toBeCalledWith(
      {
        type: 'pointermove',
        clientY: 100,
        clientX: 1000,
        direction: 'ArrowLeft',
        repeat: false,
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        shiftBase: 100,
        moovingControl: 'max',
      },
    );
  });

  test('notifies observer about clicking on the track', () => {
    if (track instanceof HTMLElement) {
      mockPointerEvent(
        track,
        { eventType: 'pointerdown', clientY: 100, clientX: 100 },
      );
    }
    expect(calcPositionSpy).toBeCalledTimes(1);
    expect(calcPositionSpy).toBeCalledWith(
      {
        type: 'pointerdown',
        clientY: 100,
        clientX: 100,
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        shiftBase: 100,
        moovingControl: 'min',
        direction: 'ArrowLeft',
        repeat: false,
      },
    );
  });

  test('notifies observer about pressing on a focused control', () => {
    if (controlMax instanceof HTMLElement) {
      mockKeyboardEvent(
        controlMax,
        { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
      );
    }

    expect(calcPositionSetByKeySpy).toBeCalledTimes(1);
    expect(calcPositionSetByKeySpy).toBeCalledWith({
      clientX: 100,
      clientY: 100,
      height: 0,
      left: 0,
      shiftBase: 100,
      top: 0,
      type: 'pointerdown',
      width: 0,
      direction: 'ArrowLeft',
      repeat: false,
      moovingControl: 'max',
    });
  });
});
