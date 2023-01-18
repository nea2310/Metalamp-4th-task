import Model from '../../model/Model';
import View from '../View';
import Controller from '../../controller/Controller';


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

const getElement = (selector: string, wrapper: HTMLElement) => wrapper.getElementsByClassName(selector)[0] as HTMLElement;



describe('ViewControl event listeners', () => {
  test('notifies observer about control moving made by mouse', () => {
    const wrapper = document.createElement('div');
    const parent = document.createElement('input');
    document.body.appendChild(wrapper);
    wrapper.appendChild(parent);
    const testModel = new Model();
    const testView = new View(parent);
    new Controller(testModel, testView, {});
    
    
    testModel.update({
      min: 0,
      max: 100,
      from: 10,
      to: 90,
    })
    
    
    const controlMax = getElement('slider-metalamp__control-max', wrapper);
    const controlMin = getElement('slider-metalamp__control-min', wrapper);
    const tipMin = getElement('slider-metalamp__tip-min', wrapper);
    const tipMax = getElement('slider-metalamp__tip-max', wrapper);
    const track = getElement('slider-metalamp__track', wrapper);
    track.getBoundingClientRect = jest.fn(() => {
      return {
          width: 500,
          height: 50,
          top: 30,
          left: 30,
          bottom: 50,
          right: 50,
          x: 0,
          y: 0,
          toJSON: () => undefined,
      }});
    const scale = controlMax.parentElement;
    if (scale){
      scale.getBoundingClientRect = jest.fn(() => {
        return {
            width: 500,
            height: 50,
            top: 30,
            left: 30,
            bottom: 50,
            right: 50,
            x: 0,
            y: 0,
            toJSON: () => undefined,
        }})
    }
    const updateModel = jest.spyOn(testModel, 'update');

    mockPointerEvent(
      controlMax,
      { eventType: 'pointerdown', clientY: 100, clientX: 100 },
    );
    mockPointerEvent(
      controlMax,
      { eventType: 'pointermove', clientY: 100, clientX: 350 },
    );

    mockPointerEvent(
      controlMin,
      { eventType: 'pointerdown', clientY: 100, clientX: 100 },
    );
    mockPointerEvent(
      controlMin,
      { eventType: 'pointermove', clientY: 100, clientX: 250 },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 24,
        to: 44,
      })
    );
  });

  test('notifies observer about clicking on the track', () => {
    const wrapper = document.createElement('div');
    const parent = document.createElement('input');
    document.body.appendChild(wrapper);
    wrapper.appendChild(parent);
    const testModel = new Model();
    const testView = new View(parent);
    new Controller(testModel, testView, {});
    
    
    testModel.update({
      min: 0,
      max: 100,
      from: 10,
      to: 90,
    })
    
    
    const controlMax = getElement('slider-metalamp__control-max', wrapper);
    const controlMin = getElement('slider-metalamp__control-min', wrapper);
    const tipMin = getElement('slider-metalamp__tip-min', wrapper);
    const tipMax = getElement('slider-metalamp__tip-max', wrapper);
    const track = getElement('slider-metalamp__track', wrapper);
    track.getBoundingClientRect = jest.fn(() => {
      return {
          width: 500,
          height: 50,
          top: 30,
          left: 30,
          bottom: 50,
          right: 50,
          x: 0,
          y: 0,
          toJSON: () => undefined,
      }});
    const scale = controlMax.parentElement;
    if (scale){
      scale.getBoundingClientRect = jest.fn(() => {
        return {
            width: 500,
            height: 50,
            top: 30,
            left: 30,
            bottom: 50,
            right: 50,
            x: 0,
            y: 0,
            toJSON: () => undefined,
        }})
    }
    const updateModel = jest.spyOn(testModel, 'update');

    
    mockPointerEvent(
      track,
      { eventType: 'pointerdown', clientY: 100, clientX: 300 },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 54,
        to: 90,
      })
    );
  });

  // test('notifies observer about pressing on a focused control', () => {
  //   mockKeyboardEvent(
  //     controlMax,
  //     { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
  //   );
  //   expect(calcPositionSetByKeySpy).toBeCalledTimes(1);
  //   expect(calcPositionSetByKeySpy).toBeCalledWith({
  //     clientX: 100,
  //     clientY: 100,
  //     height: 0,
  //     left: 0,
  //     shiftBase: 100,
  //     top: 0,
  //     type: 'pointerdown',
  //     width: 0,
  //     direction: 'ArrowLeft',
  //     repeat: false,
  //     moovingControl: 'max',
  //   });
  // });
});
