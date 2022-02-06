import { IConf } from './../interface';
import { Model } from './../model/model';
import { View } from './../view/view';
import { Controller } from './controller';


function prepareInstance(conf: IConf) {
  const parent = document.createElement('input');
  document.body.appendChild(parent);
  const testModel = new Model(conf);
  const testView = new View(parent);
  return new Controller(testModel, testView);
}


/***********************************/

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
};

const TestController = prepareInstance(conf);

describe('controller', () => {

  test('gets data from model on calling API method "getData"',
    async () => {
      const getDataSpy = jest.spyOn(TestController.model, 'getData');
      await expect(TestController.getData()).toEqual({
        bar: true,
        from: 20,
        interval: 9,
        max: 100,
        min: 10,
        onChange: null,
        onStart: null,
        onUpdate: null,
        range: true,
        scale: true,
        scaleBase: "step",
        shiftOnKeyDown: 1,
        shiftOnKeyHold: 1,
        step: 10,
        sticky: false,
        tip: true,
        to: 70,
        vertical: false,
      });
      expect(getDataSpy).toBeCalledTimes(1);
    });


  test('calls update method in model on calling API method "update"', () => {
    const updateSpy = jest.spyOn(TestController.model, 'update');
    TestController.update(conf);
    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).toBeCalledWith(conf);
  });

  test('removes Observer listeners on calling API method "disable"',
    async () => {
      expect(TestController.model.observers).toHaveLength(11);
      expect(TestController.view.observers).toHaveLength(2);
      await TestController.disable();
      expect(TestController.model.observers).toHaveLength(0);
      expect(TestController.view.observers).toHaveLength(0);
    });

  test('reverts Observer listeners back on calling API method "enable"',
    async () => {
      expect(TestController.model.observers).toHaveLength(0);
      expect(TestController.view.observers).toHaveLength(0);
      await TestController.enable();
      expect(TestController.model.observers).toHaveLength(11);
      expect(TestController.view.observers).toHaveLength(2);
    });

  test('destroys slider instance on calling API method "destroy"',
    async () => {
      expect(TestController.model).toBeDefined();
      expect(TestController.view).toBeDefined();
      await TestController.destroy();
      expect(TestController.model).toBeNull();
      expect(TestController.view).toBeNull();
    });
});
