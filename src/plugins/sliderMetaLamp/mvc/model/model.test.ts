
import { sliderModel } from './../model/model';
import { IConf } from './../interface';



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
const testModel = new sliderModel(conf);

describe('model', () => {
	test('calls update method in model on calling API method "update"', () => {
		// const updateSpy = jest.spyOn(testModel, 'update');
		// TestController.update(conf);
		// expect(updateSpy).toBeCalledTimes(1);
		// expect(updateSpy).toBeCalledWith(conf);
	});

	test('removes Observer listeners on calling API method "disable"',
		async () => {
			// expect(TestController.model.observers).toHaveLength(11);
			// expect(TestController.view.observers).toHaveLength(2);
			// await TestController.disable();
			// expect(TestController.model.observers).toHaveLength(0);
			// expect(TestController.view.observers).toHaveLength(0);
		});

	test('reverts Observer listeners back on calling API method "enable"',
		async () => {
			// expect(TestController.model.observers).toHaveLength(0);
			// expect(TestController.view.observers).toHaveLength(0);
			// await TestController.enable();
			// expect(TestController.model.observers).toHaveLength(11);
			// expect(TestController.view.observers).toHaveLength(2);
		});

	test('destroys slider instance on calling API method "destroy"',
		async () => {
			// expect(TestController.model).toBeDefined();
			// expect(TestController.view).toBeDefined();
			// await TestController.destroy();
			// expect(TestController.model).toBeNull();
			// expect(TestController.view).toBeNull();
		});
});
