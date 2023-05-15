import { mockPointerEvent, mockKeyboardEvent, createInstance } from '../../test-utils';

describe('Controls move correctly when drag or click or keydown event happens', () => {
  test('Controls move correctly when drag event happens (no sticky mode)', () => {
    const {
      controlMin, controlMax, updateModel, testController,
    } = createInstance();
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

    testController.destroy();
  });

  test('Controls move correctly when drag event happens (no sticky mode, vertical)', () => {
    const {
      controlMin, controlMax, updateModel, testController,
    } = createInstance({
      configuration: {
        min: 0,
        max: 100,
        from: 10,
        to: 90,
        vertical: true,
      },
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

    testController.destroy();
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

    testController.destroy();
  });

  test('Controls move correctly when drag event happens and control is on its extreme position (no sticky mode)', () => {
    const {
      controlMin, controlMax, updateModel, testController,
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

    testController.destroy();
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

    testController.destroy();
  });

  test('Controls move correctly when drag event happens (distance to min control < distance to max control)', () => {
    const { track, updateModel, testController } = createInstance({
      configuration: {
        min: 0,
        max: 100,
        from: 30,
        to: 60,
      },
      minControlPosition: 30,
      maxControlPosition: 70,
    });

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

    testController.destroy();
  });

  test('Controls move correctly when drag event happens (distance to min control > distance to max control)', () => {
    const { track, updateModel, testController } = createInstance({
      configuration: {
        min: 0,
        max: 100,
        from: 30,
        to: 60,
      },
      minControlPosition: 30,
      maxControlPosition: 70,
    });

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

    testController.destroy();
  });

  test('Controls move correctly when drag event happens, (distance to min control === distance to max control)', () => {
    const { track, updateModel, testController } = createInstance({
      configuration: {
        min: 0,
        max: 100,
        from: 30,
        to: 60,
      },
      minControlPosition: 30,
      maxControlPosition: 70,
    });

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

    testController.destroy();
  });

  test('Controls move correctly when drag event happens (newPosition > toPosition)', () => {
    const {
      track, updateModel, controlMin, testController,
    } = createInstance({
      configuration: {
        min: 0,
        max: 100,
        from: 5,
        to: 5,
      },
      minControlPosition: 70,
      maxControlPosition: 70,
    });

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

    testController.destroy();
  });

  test('Controls move correctly when drag event happens (pointerStart event clientX minus pointerMove event clientX > 0 and controls are on the same position)', () => {
    const {
      track, updateModel, controlMax, testController,
    } = createInstance({
      configuration: {
        min: 0,
        max: 100,
        from: 50,
        to: 50,
      },
      minControlPosition: 50,
      maxControlPosition: 50,
    });

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

    testController.destroy();
  });

  test('Controls move correctly when drag event happens (pointerMove event clientX minus pointerStart event clientX > 0 and controls are on the same position)', () => {
    const {
      track, updateModel, controlMax, testController,
    } = createInstance({
      configuration: {
        min: 0,
        max: 100,
        from: 50,
        to: 50,
      },
      minControlPosition: 50,
      maxControlPosition: 50,
    });

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

    testController.destroy();
  });

  test('Controls move correctly when click event happens (no sticky mode)', () => {
    const { track, updateModel, testController } = createInstance();

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

    testController.destroy();
  });

  test('Controls move correctly when click event happens (no sticky mode, single mode, newPosition > 100)', () => {
    const { track, updateModel, testController } = createInstance();

    if (!(track instanceof HTMLElement)) return;

    testController.update({ range: false });

    mockPointerEvent(
      track,
      { eventType: 'pointerdown', clientY: 100, clientX: 600 },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 100,
        to: 90,
      }),
    );

    testController.destroy();
  });

  test('Controls move correctly when click event happens (no sticky mode, vertical mode)', () => {
    const { track, updateModel, testController } = createInstance();

    if (!(track instanceof HTMLElement)) return;

    testController.update({ vertical: true });

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

    testController.destroy();
  });

  test('Controls move correctly when keydown event happens (no sticky mode)', () => {
    const {
      controlMin, controlMax, updateModel, testController,
    } = createInstance();

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

    testController.destroy();
  });

  test('Controls move correctly when keydown event happens (no sticky mode, to > max, from < min)', () => {
    const {
      controlMin, controlMax, updateModel, testController,
    } = createInstance();

    if (!(controlMax instanceof HTMLElement) || !(controlMin instanceof HTMLElement)) return;

    testController.update({ from: 1, to: 99, shiftOnKeyHold: 3 });

    mockKeyboardEvent(
      controlMax,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: true },
    );

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowLeft', repeat: true },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 0,
        to: 100,
      }),
    );

    testController.destroy();
  });

  test('Controls move correctly when keydown event happens (no sticky mode, from > to)', () => {
    const {
      controlMin, controlMax, updateModel, testController,
    } = createInstance();

    if (!(controlMax instanceof HTMLElement) || !(controlMin instanceof HTMLElement)) return;

    testController.update({ from: 90, to: 99, shiftOnKeyHold: 10 });

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: true },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 99,
        to: 99,
      }),
    );

    testController.destroy();
  });

  test('Controls move correctly when keydown event happens (no sticky mode, single mode)', () => {
    const { controlMin, updateModel, testController } = createInstance();

    if (!(controlMin instanceof HTMLElement)) return;

    testController.update({ range: false });

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

    testController.destroy();
  });

  test('Controls move correctly when keydown event happens (sticky mode, single mode)', () => {
    const { controlMin, updateModel, testController } = createInstance();

    if (!(controlMin instanceof HTMLElement)) return;

    testController.update({ range: false, sticky: true });

    mockKeyboardEvent(
      controlMin,
      { eventType: 'keydown', direction: 'ArrowRight', repeat: true },
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

    testController.destroy();
  });

  test('Controls move correctly when keydown event happens (no sticky mode, single mode, from >= max)', () => {
    const { controlMin, updateModel, testController } = createInstance({
      configuration: {
        min: 0,
        max: 100,
        from: 100,
        range: false,
      },
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

    testController.destroy();
  });

  test('Controls move correctly when keydown event happens (no sticky mode, double mode, to < from)', () => {
    const { controlMax, updateModel, testController } = createInstance({
      configuration: {
        min: 0,
        max: 100,
        from: 0,
        to: 0,
      },
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

    testController.destroy();
  });

  test('Controls move correctly when keydown event happens (sticky mode)', () => {
    const {
      controlMin, controlMax, updateModel, testController,
    } = createInstance({
      configuration: {
        min: 0,
        max: 100,
        from: 10,
        to: 90,
        step: 2,
        sticky: true,
        shiftOnKeyDown: 2,
        shiftOnKeyHold: 5,
      },
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

    testController.destroy();
  });

  test('Controls move correctly when keydown event happens and control reached another control', () => {
    const {
      testController, controlMin, controlMax, updateModel,
    } = createInstance({
      configuration: {
        min: 0,
        max: 100,
        from: 49,
        to: 50,
        step: 1,
        sticky: true,
        shiftOnKeyDown: 2,
        shiftOnKeyHold: 3,
      },
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

    testController.destroy();
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

    testController.destroy();
  });

  test('Correct from and to values when switch sticky, remainder > 0', () => {
    const {
      testController, updateModel,
    } = createInstance();

    testController.update({
      from: 4,
      to: 17,
      sticky: true,
      step: 5,
    });

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 5,
        to: 15,
      }),
    );

    testController.destroy();
  });

  test('Correct from and to values when switch sticky, remainder < 0', () => {
    const {
      testController, updateModel,
    } = createInstance();

    testController.update({
      min: -30,
      max: 0,
      from: -27,
      to: -4,
      sticky: true,
      step: 5,
    });

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: -25,
        to: -5,
      }),
    );

    testController.destroy();
  });

  test('Controls move correctly when click event on scalemark happens', () => {
    const { track, updateModel, testController } = createInstance();

    if (!(track instanceof HTMLElement)) return;
    const scaleMarks = track.querySelectorAll('.slider-metalamp__mark');
    if (!(scaleMarks[0] instanceof HTMLElement)) return;
    const firstLabel = scaleMarks[0].firstElementChild;
    if (!(firstLabel instanceof HTMLElement)) return;
    mockPointerEvent(
      firstLabel,
      { eventType: 'pointerdown', clientY: 61, clientX: 71 },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 0,
        to: 90,
      }),
    );

    testController.destroy();
  });

  test('Controls move correctly when click event on scalemark happens (from === to)', () => {
    const { track, updateModel, testController } = createInstance({
      configuration: {
        min: 0,
        max: 100,
        from: 0,
        to: 0,
      },
    });

    if (!(track instanceof HTMLElement)) return;
    const scaleMarks = track.querySelectorAll('.slider-metalamp__mark');
    if (!(scaleMarks[0] instanceof HTMLElement)) return;
    const firstLabel = scaleMarks[0].firstElementChild;
    if (!(firstLabel instanceof HTMLElement)) return;
    mockPointerEvent(
      firstLabel,
      { eventType: 'pointerdown', clientY: 61, clientX: 71 },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 0,
        to: 0,
      }),
    );

    testController.destroy();
  });

  test('Controls move correctly when click event on scalemark happens (single mode)', () => {
    const { track, updateModel, testController } = createInstance({
      configuration: {
        min: 0,
        max: 100,
        from: 10,
        to: 90,
        range: false,
      },
    });

    if (!(track instanceof HTMLElement)) return;
    const scaleMarks = track.querySelectorAll('.slider-metalamp__mark');
    if (!(scaleMarks[0] instanceof HTMLElement)) return;
    const firstLabel = scaleMarks[0].firstElementChild;
    if (!(firstLabel instanceof HTMLElement)) return;
    mockPointerEvent(
      firstLabel,
      { eventType: 'pointerdown', clientY: 61, clientX: 71 },
    );

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 0,
        to: 90,
      }),
    );
    testController.destroy();
  });

  test('Should update model correctly after range mode was swithed', () => {
    const { updateModel, testController } = createInstance({
      configuration: {
        min: 0,
        max: 100,
        from: 10,
        range: false,
      },
    });

    testController.update({ range: true });

    expect(updateModel).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: 10,
        to: 10,
      }),
    );

    testController.destroy();
  });
});
