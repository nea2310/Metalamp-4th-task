import { Controller } from './../../controller/controller';
import { IConfFull } from './../../interface';
import { Model } from './../../model/model';
import { View } from './../../view/view';


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
  element.setPointerCapture = jest.fn(element.setPointerCapture);
  element.releasePointerCapture = jest.fn(element.releasePointerCapture);
  element.dispatchEvent(pointerEvent);
}


function mockTouchEvent(element: HTMLElement,
  { eventType }: { eventType: string }): void {
  const touchEvent = new TouchEvent(eventType,
    {/* including in this second parameter of TouchEvent constructor (touchEventInit) any parameter which value is Touch object (touches, targetTouches, changedTouches)
even with its default value (empty array) ends up with error Touch is not defined in Jest.*/
      bubbles: true,
    }
  );
  element.dispatchEvent(touchEvent);
}

function mockKeyboardEvent(element: HTMLElement,
  { eventType, key = 'ArrowLeft', repeat = false }:
    { eventType: string, key: string, repeat: boolean }): void {
  const keyboardEvent = new KeyboardEvent(eventType,
    {
      code: key,
      repeat: repeat,
      bubbles: true,
    }
  );
  element.setPointerCapture = jest.fn(element.setPointerCapture);
  element.releasePointerCapture = jest.fn(element.releasePointerCapture);
  element.dispatchEvent(keyboardEvent);
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
const getElem = (selector: string) =>
  document.getElementsByClassName(selector)[0] as HTMLElement;

const testModel = new Model(conf);
const testView = new View(parent);
new Controller(testModel, testView);
const testViewControl = testView.viewControl;

const calcPosSpy = jest.spyOn(testModel, 'calcPos');
const calcPosKeySpy = jest.spyOn(testModel, 'calcPosKey');

const controlMin = getElem('rs-metalamp__control-min');
const controlMax = getElem('rs-metalamp__control-max');
const tipMin = getElem('rs-metalamp__tip-min');
const tipMax = getElem('rs-metalamp__tip-max');
const track = getElem('rs-metalamp__track');


describe('apply styles on calling ViewControl method', () => {

  test('updatePos', async () => {
    expect(controlMax).
      toHaveProperty('style.left', '66.66666666666667%');
    expect(controlMax).
      toHaveProperty('style.bottom', '');
    /*
    Это не протестируешь, т.к. в расчетах используется offsetWidth
        expect(tipMax).
          toHaveProperty('style.left', '0px');
        expect(tipMax).
          toHaveProperty('style.bottom', '');
    */
    await testViewControl.updatePos(controlMax, 50);

    expect(controlMax).toHaveProperty('style.left', '50%');
    expect(controlMax).toHaveProperty('style.bottom', '');
    /*
    Это не протестируешь, т.к. в расчетах используется offsetWidth
        expect(tipMax).toHaveProperty('style.left', '0px');
        expect(tipMax).toHaveProperty('style.bottom', '');
    */
  });

  test('change tip inner text on calling updateVal method', async () => {
    expect(tipMin.innerText).toBe('20');
    expect(tipMax.innerText).toBe('70');
    await testViewControl.updateVal('25', true);
    await testViewControl.updateVal('30', false);
    expect(tipMin.innerText).toBe('25');
    expect(tipMax.innerText).toBe('30');
  });




  test('update input value on calling updateInput method', async () => {
    expect(parent.value).toBe('20, 70');
    await testViewControl.updateInput({
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
      onUpdate: () => true
    });
    expect(parent.value).toBe('25, 30');
  });


  test('toggle classes on calling switchVertical method', async () => {
    expect(controlMin.classList.contains('rs-metalamp__control_vert')).
      toBe(false);
    expect(controlMax.classList.contains('rs-metalamp__control_vert')).
      toBe(false);
    expect(tipMin.classList.contains('rs-metalamp__tip_vert')).
      toBe(false);
    expect(tipMax.classList.contains('rs-metalamp__tip_vert')).
      toBe(false);
    await testViewControl.switchVertical({
      min: 10,
      max: 100,
      from: 20,
      to: 70,
      vertical: true,
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
      onUpdate: () => true
    });
    expect(controlMin.classList.contains('rs-metalamp__control_vert')).
      toBe(true);
    expect(controlMax.classList.contains('rs-metalamp__control_vert')).
      toBe(true);
    expect(tipMin.classList.contains('rs-metalamp__tip_vert')).
      toBe(true);
    expect(tipMax.classList.contains('rs-metalamp__tip_vert')).
      toBe(true);
    await testViewControl.switchVertical({
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
      onUpdate: () => true
    });
    expect(controlMin.classList.contains('rs-metalamp__control_vert')).
      toBe(false);
    expect(controlMax.classList.contains('rs-metalamp__control_vert')).
      toBe(false);
    expect(tipMin.classList.contains('rs-metalamp__tip_vert')).
      toBe(false);
    expect(tipMax.classList.contains('rs-metalamp__tip_vert')).
      toBe(false);
  });

  test('toggle class hidden on calling switchRange method', async () => {
    expect(controlMin.classList.contains('rs-metalamp__control_hidden')).
      toBe(false);
    expect(controlMax.classList.contains('rs-metalamp__control_hidden')).
      toBe(false);
    expect(tipMin.classList.contains('rs-metalamp__tip_hidden')).
      toBe(false);
    expect(tipMax.classList.contains('rs-metalamp__tip_hidden')).
      toBe(false);
    await testViewControl.switchRange({
      min: 10,
      max: 100,
      from: 20,
      to: 70,
      vertical: false,
      range: false,
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
      onUpdate: () => true
    });
    expect(controlMin.classList.contains('rs-metalamp__control_hidden')).
      toBe(false);
    expect(controlMax.classList.contains('rs-metalamp__control_hidden')).
      toBe(true);
    expect(tipMin.classList.contains('rs-metalamp__tip_hidden')).
      toBe(false);
    expect(tipMax.classList.contains('rs-metalamp__tip_hidden')).
      toBe(true);
    await testViewControl.switchRange({
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
      onUpdate: () => true
    });
    expect(controlMin.classList.contains('hidden')).
      toBe(false);
    expect(controlMax.classList.contains('rs-metalamp__control_hidden')).
      toBe(false);
    expect(tipMin.classList.contains('rs-metalamp__tip_hidden')).
      toBe(false);
    expect(tipMax.classList.contains('rs-metalamp__tip_hidden')).
      toBe(false);
  });

  test('toggle class hidden on calling switchTip method', async () => {
    expect(tipMin.classList.contains('rs-metalamp__tip_hidden')).
      toBe(false);
    expect(tipMax.classList.contains('rs-metalamp__tip_hidden')).
      toBe(false);
    await testViewControl.switchTip({
      min: 10,
      max: 100,
      from: 20,
      to: 70,
      vertical: false,
      range: true,
      bar: true,
      tip: false,
      scale: true,
      scaleBase: 'step',
      step: 10,
      interval: 0,
      sticky: false,
      shiftOnKeyDown: 1,
      shiftOnKeyHold: 1,
      onStart: () => true,
      onChange: () => true,
      onUpdate: () => true
    });
    expect(tipMin.classList.contains('rs-metalamp__tip_hidden')).
      toBe(true);
    expect(tipMax.classList.contains('rs-metalamp__tip_hidden')).
      toBe(true);
    await testViewControl.switchTip({
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
      onUpdate: () => true
    });
    expect(tipMin.classList.contains('rs-metalamp__tip_hidden')).
      toBe(false);
    expect(tipMax.classList.contains('rs-metalamp__tip_hidden')).
      toBe(false);
  });

});


describe('ViewControl event listeners', () => {

  afterEach(() => {
    calcPosSpy.mockClear();
  });


  test('notifies observer about control mooving made by touching', () => {
    mockTouchEvent(controlMax,
      { eventType: 'touchstart' });
    mockTouchEvent(controlMax,
      { eventType: 'touchmove' });
    expect(calcPosSpy).toBeCalledTimes(1);
    expect(calcPosSpy).toBeCalledWith(
      'touchmove', 0, 0, 0, 0, 0, 0, undefined, "max");
  });

  test('notifies observer about control mooving made by mouse', () => {
    mockPointerEvent(controlMax,
      { eventType: 'pointerdown', clientY: 100, clientX: 100 });
    mockPointerEvent(controlMax,
      { eventType: 'pointermove', clientY: 100, clientX: 1000 });
    expect(calcPosSpy).toBeCalledTimes(1);
    expect(calcPosSpy).toBeCalledWith(
      'pointermove', 100, 1000, 0, 0, 0, 0, 100, "max");
  });

  test('notifies observer about clicking on the track', () => {
    mockPointerEvent(track,
      { eventType: 'pointerdown', clientY: 100, clientX: 100 });
    expect(calcPosSpy).toBeCalledTimes(1);
    expect(calcPosSpy).toBeCalledWith(
      "pointerdown", 100, 100, 0, 0, 0, 0, 100, "min");
  });

  test('notifies observer about pressing on a focused control', () => {
    mockKeyboardEvent(controlMax,
      { eventType: 'keydown', key: 'ArrowLeft', repeat: false });
    expect(calcPosKeySpy).toBeCalledTimes(1);
    expect(calcPosKeySpy).toBeCalledWith('ArrowLeft', false, 'max');
  });
});