/* eslint-disable indent */
import { IConf } from '../interface';
import Model from '../model/model';

describe('model, calcPositionSetByPointer and calcPositionSetByKey methods', () => {
  test('calcPositionSetByPointer, no Sticky', async () => {
    const conf: IConf = {
      min: 10,
      max: 100,
      from: 20,
      to: 70,
      step: 9,
      sticky: false,
      shiftOnKeyDown: 1,
      shiftOnKeyHold: 2,
    };
    const testModel = new Model(conf);
    testModel.getConf(conf);
    testModel.start();
    expect(testModel.calcPositionSetByPointer(
      {
        type: 'pointerevent',
        clientY: 50,
        clientX: 50,
        top: 100,
        left: 100,
        width: 10,
        height: 10,
        shiftBase: 0.5,
        moovingControl: 'min',
      },
    ))
      .toBe('newPosition < 0');

    expect(testModel.calcPositionSetByPointer(
      {
        type: 'pointerevent',
        clientY: 50,
        clientX: 500,
        top: 100,
        left: 100,
        width: 10,
        height: 10,
        shiftBase: 0.5,
        moovingControl: 'max',
      },
    ))
      .toBe('newPosition > 100');

    expect(testModel.calcPositionSetByPointer(
      {
        type: 'pointerevent',
        clientY: 0,
        clientX: 100,
        top: 0,
        left: 50,
        width: 200,
        height: 0,
        shiftBase: 0.5,
        moovingControl: 'min',
      },
    ))
      .toBe(25);

    expect(testModel.calcPositionSetByPointer(
      {
        type: 'pointerevent',
        clientY: 0,
        clientX: 150,
        top: 0,
        left: 50,
        width: 200,
        height: 0,
        shiftBase: 0.5,
        moovingControl: 'max',
      },
    ))
      .toBe(50);

    expect(testModel.calcPositionSetByPointer(
      {
        type: 'pointerevent',
        clientY: 0,
        clientX: 50,
        top: 0,
        left: 50,
        width: 200,
        height: 0,
        shiftBase: 0.5,
        moovingControl: 'max',
      },
    ))
      .toBe('newPosition < fromPosition');

    expect(testModel.calcPositionSetByPointer(
      {
        type: 'pointerevent',
        clientY: 0,
        clientX: 200,
        top: 0,
        left: 50,
        width: 200,
        height: 0,
        shiftBase: 0.5,
        moovingControl: 'min',
      },
    ))
      .toBe('newPosition > toPosition');
  });

  test('calcpos, sticky', async () => {
    const conf: IConf = {
      min: 10,
      max: 100,
      from: 20,
      to: 70,
      step: 9,
      sticky: true,
      shiftOnKeyDown: 1,
      shiftOnKeyHold: 2,
    };
    const testModel = new Model(conf);
    testModel.getConf(conf);
    testModel.start();

    expect(testModel.calcPositionSetByPointer(
      {
        type: 'pointerevent',
        clientY: 50,
        clientX: 50,
        top: 100,
        left: 100,
        width: 10,
        height: 10,
        shiftBase: 0.5,
        moovingControl: 'min',
      },
    ))
      .toBe(0);

    expect(testModel.calcPositionSetByPointer(
      {
        type: 'pointerevent',
        clientY: 50,
        clientX: 500,
        top: 100,
        left: 100,
        width: 10,
        height: 10,
        shiftBase: 0.5,
        moovingControl: 'max',
      },
    ))
      .toBe(100);

    expect(testModel.calcPositionSetByPointer(
      {
        type: 'pointerevent',
        clientY: 0,
        clientX: 100,
        top: 0,
        left: 50,
        width: 200,
        height: 0,
        shiftBase: 0.5,
        moovingControl: 'min',
      },
    ))
      .toBe(30);

    expect(testModel.calcPositionSetByPointer(
      {
        type: 'pointerevent',
        clientY: 0,
        clientX: 150,
        top: 0,
        left: 50,
        width: 200,
        height: 0,
        shiftBase: 0.5,
        moovingControl: 'max',
      },
    ))
      .toBe(50);

    expect(testModel.calcPositionSetByPointer(
      {
        type: 'pointerevent',
        clientY: 0,
        clientX: 50,
        top: 0,
        left: 50,
        width: 200,
        height: 0,
        shiftBase: 0.5,
        moovingControl: 'max',
      },
    ))
      .toBe('newPosition < fromPosition');

    expect(testModel.calcPositionSetByPointer(
      {
        type: 'pointerevent',
        clientY: 0,
        clientX: 200,
        top: 0,
        left: 50,
        width: 200,
        height: 0,
        shiftBase: 0.5,
        moovingControl: 'min',
      },
    ))
      .toBe('newPosition > toPosition');
  });

  test(
    'calcPositionSetByKey, no Sticky',

    async () => {
      const conf: IConf = {
        min: 10,
        max: 100,
        from: 10,
        to: 100,
        step: 9,
        sticky: false,
        shiftOnKeyDown: 1,
        shiftOnKeyHold: 2,
      };
      const testModel = new Model(conf);
      await testModel.getConf(conf);
      await testModel.start();

      expect(testModel.calcPositionSetByKey(
        {
          key: 'ArrowLeft',
          repeat: false,
          moovingControl: 'min',
        },
      ))
        .toBe(10); // from < min

      expect(testModel.calcPositionSetByKey(
        {
          key: 'ArrowLeft',
          repeat: true,
          moovingControl: 'min',
        },
      ))
        .toBe(10); // from < min

      expect(testModel.calcPositionSetByKey(
        {
          key: 'ArrowRight',
          repeat: false,
          moovingControl: 'max',
        },
      ))
        .toBe(100);// to > max

      expect(testModel.calcPositionSetByKey(
        {
          key: 'ArrowRight',
          repeat: true,
          moovingControl: 'max',
        },
      ))
        .toBe(100);// to > max

      await testModel.update({ from: 70, to: 70 });

      expect(testModel.calcPositionSetByKey(
        {
          key: 'ArrowLeft',
          repeat: false,
          moovingControl: 'max',
        },
      ))
        .toBe(70); // from<to

      expect(testModel.calcPositionSetByKey({
        key: 'ArrowRight',
        repeat: false,
        moovingControl: 'min',
      }))
        .toBe(70); // to>from

      expect(testModel.calcPositionSetByKey(
        {
          key: 'ArrowLeft',
          repeat: false,
          moovingControl: 'min',
        },
      ))
        .toBe(69);

      expect(testModel.calcPositionSetByKey(
        {
          key: 'ArrowLeft',
          repeat: true,
          moovingControl: 'min',
        },
      ))
        .toBe(67);

      expect(testModel.calcPositionSetByKey(
        {
          key: 'ArrowRight',
          repeat: false,
          moovingControl: 'max',
        },
      ))
        .toBe(71);

      expect(testModel.calcPositionSetByKey(
        {
          key: 'ArrowRight',
          repeat: true,
          moovingControl: 'max',
        },
      ))
        .toBe(73);
    },
  );

  test(
    'calcPositionSetByKey, Sticky',
    async () => {
      const conf: IConf = {
        min: 10,
        max: 100,
        from: 10,
        to: 100,
        step: 9,
        sticky: true,
        shiftOnKeyDown: 1,
        shiftOnKeyHold: 2,
      };
      const testModel = new Model(conf);
      testModel.getConf(conf);
      testModel.start();

      expect(testModel.calcPositionSetByKey(
        {
          key: 'ArrowLeft',
          repeat: false,
          moovingControl: 'min',
        },
      ))
        .toBe('newPosition<0'); // from < min

      expect(testModel.calcPositionSetByKey(
        {
          key: 'ArrowLeft',
          repeat: true,
          moovingControl: 'min',
        },
      ))
        .toBe('newPosition<0'); // from < min

      expect(testModel.calcPositionSetByKey(
        {
          key: 'ArrowRight',
          repeat: false,
          moovingControl: 'max',
        },
      ))
        .toBe('newPosition>100');// to > max

      expect(testModel.calcPositionSetByKey(
        {
          key: 'ArrowRight',
          repeat: true,
          moovingControl: 'max',
        },
      ))
        .toBe('newPosition>100');// to > max

      await testModel.update({ from: 70, to: 70 });

      expect(testModel.calcPositionSetByKey(
        {
          key: 'ArrowLeft',
          repeat: false,
          moovingControl: 'max',
        },
      ))
        .toBe('too small newPosition'); // from<to

      expect(testModel.calcPositionSetByKey(
        {
          key: 'ArrowRight',
          repeat: false,
          moovingControl: 'min',
        },
      ))
        .toBe('too big newPosition'); // to>from

      expect(testModel.calcPositionSetByKey(
        {
          key: 'ArrowLeft',
          repeat: false,
          moovingControl: 'min',
        },
      ))
        .toEqual({ newPosition: 60, newValue: '64' });

      expect(testModel.calcPositionSetByKey(
        {
          key: 'ArrowLeft',
          repeat: true,
          moovingControl: 'min',
        },
      ))
        .toEqual({ newPosition: 40, newValue: '46' });

      expect(testModel.calcPositionSetByKey(
        {
          key: 'ArrowRight',
          repeat: false,
          moovingControl: 'max',
        },
      ))
        .toEqual({ newPosition: 80, newValue: '82' });

      expect(testModel.calcPositionSetByKey(
        {
          key: 'ArrowRight',
          repeat: true,
          moovingControl: 'max',
        },
      ))
        .toEqual({ newPosition: 100, newValue: '100' });
    },
  );
});

describe('model, values correction on API method "update" processing', () => {
  const conf = {
    min: 0,
    max: 100,
    from: 10,
    to: 90,
    vertical: false,
    range: true,
    bar: true,
    tip: true,
    scale: true,
    scaleBase: 'step',
    step: 1,
    interval: 0,
    sticky: false,
    shiftOnKeyDown: 1,
    shiftOnKeyHold: 2,
  };
  const testModel = new Model(conf);
  testModel.getConf(conf);
  testModel.start();
  test('shiftOnKeyDown <= 0', async () => {
    expect(testModel.update({ shiftOnKeyDown: 0 }).shiftOnKeyDown)
      .toBe(1);
    expect(testModel.update({ shiftOnKeyDown: -10 }).shiftOnKeyDown)
      .toBe(1);
  });

  test('shiftOnKeyHold <= 0', async () => {
    expect(testModel.update({ shiftOnKeyHold: 0 }).shiftOnKeyHold)
      .toBe(1);
    expect(testModel.update({ shiftOnKeyHold: -10 }).shiftOnKeyHold)
      .toBe(1);
  });

  test('conf.max <= conf.min', async () => {
    expect(testModel.update({ min: 10, max: 0 }).from)
      .toBe(10);
    expect(testModel.update({ min: 10, max: 0 }).to)
      .toBe(20);
    expect(testModel.update({ min: 10, max: 0 }).max)
      .toBe(20);
  });

  test('conf.from < conf.min', async () => {
    expect(testModel.update({ from: 10, min: 20 }).from)
      .toBe(20);
    expect(testModel.update({ from: 10, min: 20 }).min)
      .toBe(20);
  });

  test('conf.to < conf.min', async () => {
    expect(testModel.update({ to: 10, min: 20 }).from)
      .toBe(20);
    expect(testModel.update({ to: 10, min: 20 }).to)
      .toBe(20);
    expect(testModel.update({ to: 10, min: 20 }).min)
      .toBe(20);
  });

  test('!conf.range && conf.to > conf.max', async () => {
    expect(testModel.update({ to: 20, max: 10, range: false }).from)
      .toBe(20);
    expect(testModel.update({ to: 20, max: 10, range: false }).to)
      .toBe(30);
    expect(testModel.update({ to: 20, max: 10, range: false }).max)
      .toBe(30);
  });

  test('conf.range && conf.to > conf.max', async () => {
    expect(testModel.update({ to: 20, max: 10, range: true }).from)
      .toBe(20);
    expect(testModel.update({ to: 20, max: 10, range: true }).to)
      .toBe(30);
    expect(testModel.update({ to: 20, max: 10, range: true }).max)
      .toBe(30);
  });

  test('conf.range && conf.from > conf.max', async () => {
    expect(testModel.update({ from: 20, max: 10, range: true }).from)
      .toBe(20);
    expect(testModel.update({ from: 20, max: 10, range: true }).to)
      .toBe(30);
    expect(testModel.update({ from: 20, max: 10, range: true }).max)
      .toBe(30);
  });

  test('!conf.range && conf.from > conf.max', async () => {
    expect(testModel.update({ from: 20, max: 10, range: false }).from)
      .toBe(20);
    expect(testModel.update({ from: 20, max: 10, range: false }).to)
      .toBe(30);
    expect(testModel.update({ from: 20, max: 10, range: false }).max)
      .toBe(30);
  });

  test('conf.range && conf.from > conf.to', async () => {
    expect(testModel.update({ from: 20, to: 10, range: true }).from)
      .toBe(20);
    expect(testModel.update({ from: 20, to: 10, range: true }).to)
      .toBe(20);
    expect(testModel.update({ from: 20, to: 10, range: true }).min)
      .toBe(20);
  });

  test('conf.step <= 0', async () => {
    expect(testModel.update({ step: 0 }).step)
      .toBe(5);
    expect(testModel.update({ step: -10 }).step)
      .toBe(5);
  });

  test('conf.interval <= 0', async () => {
    expect(testModel.update({ interval: 0 }).interval)
      .toBe(2);
    expect(testModel.update({ interval: -10 }).interval)
      .toBe(2);
  });
});

describe('model, API method "update" processing', () => {
  const onStart = () => true;
  const onChange = () => true;
  const onUpdate = () => true;
  const conf = {
    min: 0,
    max: 100,
    from: 10,
    to: 90,
    vertical: false,
    range: true,
    bar: true,
    tip: true,
    scale: true,
    scaleBase: 'step',
    step: 25,
    interval: 0,
    sticky: false,
    shiftOnKeyDown: 1,
    shiftOnKeyHold: 2,
    onStart,
    onChange,
    onUpdate,
  };

  test('update min, max, from, to, step', async () => {
    const dataEnd = {
      bar: true,
      barPos: 16.666666666666668,
      barWidth: 33.33333333333333,
      from: -50,
      fromPosition: 16.666666666666668,
      fromValue: '-50',
      interval: 6,
      intervalValue: '6',
      marksArray: [
        { value: -100, position: 0 },
        { value: -50, position: 16.666666666666668 },
        { value: 0, position: 33.333333333333336 },
        { value: 50, position: 50 },
        { value: 100, position: 66.66666666666667 },
        { value: 150, position: 83.33333333333333 },
        { value: 200, position: 100 }],
      max: 200,
      min: -100,
      onStart,
      onChange,
      onUpdate,
      range: true,
      scale: true,
      scaleBase: 'step',
      shiftOnKeyDown: 1,
      shiftOnKeyHold: 2,
      step: 50,
      stepValue: '50',
      sticky: false,
      tip: true,
      to: 50,
      toPosition: 50,
      toValue: '50',
      vertical: false,
      thumb: {
        clientX: 0,
        clientY: 0,
        height: 0,
        key: '',
        left: 0,
        moovingControl: '',
        repeat: false,
        shiftBase: 0,
        top: 0,
        type: '',
        width: 0,
      },
    };
    const testModel = await new Model(conf);
    await testModel.getConf(conf);
    await testModel.start();
    expect(testModel.update({
      min: -100,
      max: 200,
      from: -50,
      to: 50,
      step: 50,
    })).toEqual(dataEnd);
  });

  test('switch vertical', async () => {
    const testModel = await new Model(conf);
    await testModel.getConf(conf);
    await testModel.start();
    expect(testModel.update({ vertical: true }).vertical)
      .toBe(true);
  });

  test('switch range', async () => {
    const testModel = await new Model(conf);
    await testModel.getConf(conf);
    await testModel.start();
    expect(testModel.update({ range: false }).range)
      .toBe(false);
  });

  test('switch bar', async () => {
    const testModel = await new Model(conf);
    await testModel.getConf(conf);
    await testModel.start();
    expect(testModel.update({ bar: false }).bar)
      .toBe(false);
  });

  test('switch tip', async () => {
    const testModel = await new Model(conf);
    await testModel.getConf(conf);
    await testModel.start();
    expect(testModel.update({ tip: false }).tip)
      .toBe(false);
  });

  test('switch scale', async () => {
    const testModel = await new Model(conf);
    await testModel.getConf(conf);
    await testModel.start();
    expect(testModel.update({ scale: false }).scale)
      .toBe(false);
  });

  test('update scaleBase and interval', async () => {
    const testModel = await new Model(conf);
    await testModel.getConf(conf);
    await testModel.start();
    expect(testModel.update({ scaleBase: 'interval' })
      .scaleBase).toBe('interval');
    expect(testModel.update({ interval: 2 })
      .marksArray).toEqual([
        { value: 0, position: 0 },
        { value: 50, position: 50 },
        { value: 100, position: 100 }]);
  });

  test('update isSticky', async () => {
    const testModel = await new Model(conf);
    await testModel.getConf(conf);
    await testModel.start();
    expect(testModel.update({ sticky: true })
      .sticky).toBe(true);
  });

  test('round interval value', async () => {
    const testModel = await new Model(conf);
    await testModel.getConf(conf);
    await testModel.start();
    expect(testModel.update({ step: 30 })
      .intervalValue).toBe('4');
  });

  test('round step value', async () => {
    const testModel = await new Model(conf);
    await testModel.getConf(conf);
    await testModel.start();
    expect(testModel.update({ scaleBase: 'interval', interval: 6 })
      .stepValue).toBe('16.67');
  });
});
