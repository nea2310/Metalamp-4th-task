/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import { mockPointerEvent, mockKeyboardEvent, createInstance } from '../../test-utils';

describe('Controls move correctly when drag or click or keydown event happens', () => {
  test('Controls move correctly when drag event happens (no sticky mode)', () => {
    const { controlMin, controlMax, updateModel } = createInstance();
    if (!(controlMax instanceof HTMLElement) || !(controlMin instanceof HTMLElement)) return;
    mockPointerEvent(
      controlMax,
      { eventType: 'pointerdown', clientY: 100, clientX: 100 },
    );
    mockPointerEvent(
      controlMax,
      { eventType: 'pointermove', clientY: 100, clientX: 350 },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 44,
      }),
    );
  });

  test('Controls move correctly when drag event happens (no sticky mode, vertical)', () => {
    const { controlMin, controlMax, updateModel } = createInstance({
      min: 0,
      max: 100,
      from: 10,
      to: 90,
      vertical: true,
    });
    if (!(controlMax instanceof HTMLElement) || !(controlMin instanceof HTMLElement)) return;
    mockPointerEvent(
      controlMax,
      { eventType: 'pointerdown', clientY: 100, clientX: 100 },
    );
    mockPointerEvent(
      controlMax,
      { eventType: 'pointermove', clientY: 100, clientX: 350 },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 10,
      }),
    );
  });

  test('Controls move correctly when drag event happens (sticky mode)', () => {
    const {
      testController, controlMin, controlMax, updateModel,
    } = createInstance();

    testController.update({ sticky: true, step: 10 });
    if (!(controlMax instanceof HTMLElement) || !(controlMin instanceof HTMLElement)) return;

    mockPointerEvent(
      controlMax,
      { eventType: 'pointerdown', clientY: 100, clientX: 100 },
    );
    mockPointerEvent(
      controlMax,
      { eventType: 'pointermove', clientY: 100, clientX: 350 },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 40,
      }),
    );
  });

  test('Controls move correctly when drag event happens and control is on its extreme position (no sticky mode)', () => {
    const {
      controlMin, controlMax, updateModel,
    } = createInstance();

    if (!(controlMax instanceof HTMLElement) || !(controlMin instanceof HTMLElement)) return;

    mockPointerEvent(
      controlMax,
      { eventType: 'pointerdown', clientY: 100, clientX: 100 },
    );
    mockPointerEvent(
      controlMax,
      { eventType: 'pointermove', clientY: 100, clientX: 1000 },
    );

    mockPointerEvent(
      controlMin,
      { eventType: 'pointerdown', clientY: 100, clientX: 100 },
    );
    mockPointerEvent(
      controlMin,
      { eventType: 'pointermove', clientY: 100, clientX: 0 },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 0,
        to: 100,
      }),
    );
  });

  test('Controls move correctly when drag event happens and control is on its extreme position (sticky mode)', () => {
    const {
      testController, controlMin, controlMax, updateModel,
    } = createInstance();

    testController.update({ sticky: true, step: 10 });

    if (!(controlMax instanceof HTMLElement) || !(controlMin instanceof HTMLElement)) return;
    mockPointerEvent(
      controlMax,
      { eventType: 'pointerdown', clientY: 100, clientX: 100 },
    );
    mockPointerEvent(
      controlMax,
      { eventType: 'pointermove', clientY: 100, clientX: 1000 },
    );

    mockPointerEvent(
      controlMin,
      { eventType: 'pointerdown', clientY: 100, clientX: 100 },
    );
    mockPointerEvent(
      controlMin,
      { eventType: 'pointermove', clientY: 100, clientX: 0 },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 0,
        to: 100,
      }),
    );
  });

  test('Controls move correctly when click event happens (no sticky mode)', () => {
    const { track, updateModel } = createInstance();

    if (!(track instanceof HTMLElement)) return;

    mockPointerEvent(
      track,
      { eventType: 'pointerdown', clientY: 100, clientX: 50 },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 10,
      }),
    );
  });

  test('Controls move correctly when drag event happens (controlMinDist < controlMaxDist)', () => {
    const { testController, track, updateModel } = createInstance({
      min: 0,
      max: 100,
      from: 30,
      to: 60,
    }, [], 30, 70);

    if (!(track instanceof HTMLElement)) return;
    mockPointerEvent(
      track,
      { eventType: 'pointerdown', clientY: 100, clientX: 20 },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 0,
        to: 60,
      }),
    );
  });

  test('Controls move correctly when drag event happens (controlMinDist > controlMaxDist)', () => {
    const { testController, track, updateModel } = createInstance({
      min: 0,
      max: 100,
      from: 30,
      to: 60,
    }, [], 30, 70);

    if (!(track instanceof HTMLElement)) return;
    mockPointerEvent(
      track,
      { eventType: 'pointerdown', clientY: 100, clientX: 480 },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 30,
        to: 90,
      }),
    );
  });

  test('Controls move correctly when drag event happens (isBeyondToPosition === true)', () => {
    const {
      testController, track, updateModel, controlMin,
    } = createInstance({
      min: 0,
      max: 100,
      from: 5,
      to: 5,
    }, [], 70, 70);

    if (!(track instanceof HTMLElement) || !(controlMin instanceof HTMLElement)) return;

    mockPointerEvent(
      controlMin,
      { eventType: 'pointerdown', clientY: 100, clientX: 70 },
    );
    mockPointerEvent(
      controlMin,
      { eventType: 'pointermove', clientY: 100, clientX: 60 },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 5,
        to: 5,
      }),
    );
  });

  test('Controls move correctly when drag event happens, (controlMinDist === controlMaxDist)', () => {
    const { testController, track, updateModel } = createInstance({
      min: 0,
      max: 100,
      from: 30,
      to: 60,
    }, [], 30, 70);

    if (!(track instanceof HTMLElement)) return;

    mockPointerEvent(
      track,
      { eventType: 'pointerdown', clientY: 100, clientX: 50 },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 30,
        to: 30,
      }),
    );
  });

  test('Controls move correctly when drag event happens (event.clientX - innerEvent.clientX > 0 && this.areControlsMet)', () => {
    const {
      testController, track, updateModel, controlMax,
    } = createInstance({
      min: 0,
      max: 100,
      from: 50,
      to: 50,
    }, [], 50, 50);

    if (!(track instanceof HTMLElement) || !(controlMax instanceof HTMLElement)) return;

    mockPointerEvent(
      controlMax,
      { eventType: 'pointerdown', clientY: 100, clientX: 30 },
    );
    mockPointerEvent(
      controlMax,
      { eventType: 'pointermove', clientY: 100, clientX: 0 },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 0,
        to: 50,
      }),
    );
  });

  test('Controls move correctly when drag event happens (innerEvent.clientX - event.clientX > 0 && this.areControlsMet)', () => {
    const {
      testController, track, updateModel, controlMax,
    } = createInstance({
      min: 0,
      max: 100,
      from: 50,
      to: 50,
    }, [], 50, 50);

    if (!(track instanceof HTMLElement) || !(controlMax instanceof HTMLElement)) return;

    mockPointerEvent(
      controlMax,
      { eventType: 'pointerdown', clientY: 100, clientX: 30 },
    );
    mockPointerEvent(
      controlMax,
      { eventType: 'pointermove', clientY: 100, clientX: 100 },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 50,
        to: 50,
      }),
    );
  });

  test('Controls move correctly when keydown event happens (no sticky mode)', () => {
    const { controlMin, controlMax, updateModel } = createInstance();

    if (!(controlMax instanceof HTMLElement) || !(controlMin instanceof HTMLElement)) return;

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: false },
    );

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: false },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 11,
        to: 90,
      }),
    );
  });

  test('Controls move correctly when keydown event happens (no sticky mode, single mode, isAboveMaxNoRange is true)', () => {
    const { controlMin, controlMax, updateModel } = createInstance({
      min: 0,
      max: 100,
      from: 100,
      range: false,
    });

    if (!(controlMin instanceof HTMLElement)) return;

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: false },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 100,
      }),
    );
  });

  test('Controls move correctly when keydown event happens (no sticky mode, double mode, to < from)', () => {
    const { controlMin, controlMax, updateModel } = createInstance({
      min: 0,
      max: 100,
      from: 0,
      to: 0,
    });

    if (!(controlMax instanceof HTMLElement)) return;

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 0,
        to: 0,
      }),
    );
  });

  test('Controls move correctly when keydown event happens (sticky mode)', () => {
    const { controlMin, controlMax, updateModel } = createInstance({
      min: 0,
      max: 100,
      from: 10,
      to: 90,
      step: 2,
      sticky: true,
      shiftOnKeyDown: 2,
      shiftOnKeyHold: 5,
    });

    if (!(controlMax instanceof HTMLElement) || !(controlMin instanceof HTMLElement)) return;

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: false },
    );

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: true },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 84,
      }),
    );
  });

  test('Controls move correctly when keydown event happens and control reached another control', () => {
    const {
      testController, controlMin, controlMax, updateModel,
    } = createInstance({
      min: 0,
      max: 100,
      from: 49,
      to: 50,
      step: 1,
      sticky: true,
      shiftOnKeyDown: 2,
      shiftOnKeyHold: 3,
    });
    if (!(controlMax instanceof HTMLElement) || !(controlMin instanceof HTMLElement)) return;
    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: false },
    );

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: false },
    );

    testController.update({ sticky: false });

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: false },
    );

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 47,
        to: 49,
      }),
    );
  });

  test('Controls move correctly when keydown event happens and control is on its extreme position', () => {
    const {
      testController, controlMin, controlMax, updateModel,
    } = createInstance();

    testController.update({
      from: 0,
      to: 100,
      step: 1,
      sticky: true,
      shiftOnKeyDown: 2,
      shiftOnKeyHold: 3,
    });

    if (!(controlMax instanceof HTMLElement) || !(controlMin instanceof HTMLElement)) return;

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: false },
    );

    testController.update({ sticky: false });

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: false },
    );

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 0,
        to: 100,
      }),
    );
  });
});
