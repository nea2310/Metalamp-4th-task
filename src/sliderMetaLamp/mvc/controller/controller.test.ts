import { IConf } from '../interface';
import Model from '../model/model';
import View from '../view/view';
import { Controller } from './controller';

function prepareInstance(conf: IConf) {
  const parent = document.createElement('input');
  document.body.appendChild(parent);
  const testModel = new Model(conf);
  const testView = new View(parent);
  return new Controller(testModel, testView);
}

/** ******************************** */
const onChangeCB = () => true;
const onStartCB = () => true;
const onUpdateCB = () => true;

const conf: IConf = {
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
    async () => {
      const getDataSpy = jest.spyOn(TestController.model as Model, 'getData');
      await expect(TestController.getData()).toEqual({
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
    const updateSpy = jest.spyOn(TestController.model as Model, 'update');
    TestController.update(conf);
    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).toBeCalledWith(conf);
  });

  test(
    'removes Observer listeners on calling API method "disable"',
    async () => {
      const model = TestController.model as Model;
      const view = TestController.view as View;
      expect(model.observers).toHaveLength(11);
      expect(view.observers).toHaveLength(2);
      await TestController.disable();
      expect(model.observers).toHaveLength(0);
      expect(view.observers).toHaveLength(0);
    },
  );

  test(
    'reverts Observer listeners back on calling API method "enable"',
    async () => {
      const model = TestController.model as Model;
      const view = TestController.view as View;
      expect(model.observers).toHaveLength(0);
      expect(view.observers).toHaveLength(0);
      await TestController.enable();
      expect(model.observers).toHaveLength(11);
      expect(view.observers).toHaveLength(2);
    },
  );

  test(
    'destroys slider instance on calling API method "destroy"',
    async () => {
      expect(TestController.model).toBeDefined();
      expect(TestController.view).toBeDefined();
      await TestController.destroy();
      expect(TestController.model).toBeNull();
      expect(TestController.view).toBeNull();
    },
  );
});
