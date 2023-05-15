import Controller from '../../controller/Controller';
import { mockPointerEvent, createInstance } from '../../test-utils';

describe('Bar size changes correctly', () => {
  let testController: Controller;
  let bar: Element | null;
  let controlMin: Element | null;
  let controlMax: Element | null;

  beforeEach(() => {
    const instance = createInstance();
    testController = instance.testController;
    bar = instance.bar;
    controlMin = instance.controlMin;
    controlMax = instance.controlMax;
  });

  afterEach(() => {
    testController.destroy();
  });
  test('Bar size changes correctly when control moves', () => {
    if (!(bar instanceof HTMLElement)) return;
    expect(bar.style.left).toBe('10%');
    expect(bar.style.width).toBe('80%');
    expect(bar.style.bottom).toBe('');
    expect(bar.style.height).toBe('');

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

    expect(bar.style.left).toBe('24%');
    expect(bar.style.width).toBe('20%');
    expect(bar.style.bottom).toBe('');
    expect(bar.style.height).toBe('');
  });

  test('Bar size changes correctly when vertical mode changes', () => {
    if (!(bar instanceof HTMLElement)) return;
    expect(bar.style.left).toBe('24%');
    expect(bar.style.width).toBe('20%');
    expect(bar.style.bottom).toBe('');
    expect(bar.style.height).toBe('');

    testController.update({ vertical: true });

    expect(bar.style.left).toBe('');
    expect(bar.style.width).toBe('');
    expect(bar.style.bottom).toBe('24%');
    expect(bar.style.height).toBe('20%');
  });

  test('Bar size changes correctly when range mode changes ', () => {
    if (!(bar instanceof HTMLElement)) return;
    expect(bar.style.left).toBe('');
    expect(bar.style.width).toBe('');
    expect(bar.style.bottom).toBe('24%');
    expect(bar.style.height).toBe('20%');

    testController.update({ range: false });

    expect(bar.style.left).toBe('');
    expect(bar.style.width).toBe('');
    expect(bar.style.bottom).toBe('0%');
    expect(bar.style.height).toBe('24%');
  });
});
