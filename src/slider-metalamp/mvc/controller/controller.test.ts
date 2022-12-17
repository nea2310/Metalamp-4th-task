import View from '../view/View';
import Model from '../model/Model';
import { TPluginConfiguration } from '../interface';
import Controller from './Controller';

function prepareInstance(conf: TPluginConfiguration) {
  const parent = document.createElement('input');
  document.body.appendChild(parent);
  const testModel = new Model(conf);
  const testView = new View(parent);
  return new Controller(testModel, testView);
}

const onChangeCB = () => true;
const onStartCB = () => true;
const onUpdateCB = () => true;

const conf: TPluginConfiguration = {
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
  onChange: onChangeCB,
  onStart: onStartCB,
  onUpdate: onUpdateCB,
};

const TestController = prepareInstance(conf);

describe('controller', () => {
  test(
    'gets data from model on calling API method "getData"',
    () => {
      const { model } = TestController;
      if (!(model instanceof Model)) return;
      const getDataSpy = jest.spyOn(model, 'getData');
      expect(TestController.getData()).toEqual({
        bar: true,
        from: 20,
        interval: 9,
        max: 100,
        min: 10,
        range: true,
        scale: true,
        scaleBase: 'step',
        shiftOnKeyDown: 1,
        shiftOnKeyHold: 1,
        step: 10,
        sticky: false,
        tip: true,
        to: 70,
        vertical: false,
        onChange: onChangeCB,
        onStart: onStartCB,
        onUpdate: onUpdateCB,
      });

      expect(getDataSpy).toBeCalledTimes(1);
    },
  );

  test('calls update method in model on calling API method "update"', () => {
    const { model } = TestController;
    if (!(model instanceof Model)) return;
    const updateSpy = jest.spyOn(model, 'update');
    TestController.update(conf);
    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).toBeCalledWith(conf);
  });

  test(
    'removes Observer listeners on calling API method "disable"',
    () => {
      const { model, view } = TestController;
      if (!(model instanceof Model) || !(view instanceof View)) return;
      expect(model.observers).toHaveLength(10);
      expect(view.observers).toHaveLength(2);
      TestController.disable();
      expect(model.observers).toHaveLength(0);
      expect(view.observers).toHaveLength(0);
    },
  );

  test(
    're_orientation_verticals Observer listeners back on calling API method "enable"',
    () => {
      const { model, view } = TestController;
      if (!(model instanceof Model) || !(view instanceof View)) return;
      expect(model.observers).toHaveLength(0);
      expect(view.observers).toHaveLength(0);
      TestController.enable();
      expect(model.observers).toHaveLength(10);
      expect(view.observers).toHaveLength(2);
    },
  );

  test(
    'destroys slider instance on calling API method "destroy"',
    () => {
      expect(TestController.model).toBeDefined();
      expect(TestController.view).toBeDefined();
      TestController.destroy();
      expect(TestController.model).toBeNull();
      expect(TestController.view).toBeNull();
    },
  );
});
