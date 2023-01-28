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
        from: 20,
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

    expect(updateModel).toHaveBeenCalledTimes(0);
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
        from: 4,
        to: 90,
      }),
    );
  });

  test('Controls move correctly when drag event happens (sticky mode)', () => {
    const { testController, track, updateModel } = createInstance();

    testController.update({ sticky: true, step: 10 });
    if (!(track instanceof HTMLElement)) return;
    mockPointerEvent(
      track,
      { eventType: 'pointerdown', clientY: 100, clientX: 50 },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 0,
        to: 90,
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
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 89,
      }),
    );

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: false },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 90,
      }),
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

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 90,
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
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 86,
      }),
    );

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: false },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 90,
      }),
    );

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: false },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 14,
        to: 90,
      }),
    );

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 90,
      }),
    );

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: true },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 80,
      }),
    );

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: true },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 90,
      }),
    );

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: true },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 20,
        to: 90,
      }),
    );

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: true },
    );
    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 90,
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

    expect(updateModel).toHaveBeenCalledTimes(0);

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 47,
        to: 50,
      }),
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

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 49,
        to: 49,
      }),
    );
    expect(updateModel).toHaveBeenCalledTimes(4);
    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: false },
    );

    expect(updateModel).toHaveBeenCalledTimes(4);

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 49,
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

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: false },
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
