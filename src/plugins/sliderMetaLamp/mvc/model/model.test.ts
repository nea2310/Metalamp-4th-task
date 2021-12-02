
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
	step: 9,
	interval: 0,
	sticky: false,
	shiftOnKeyDown: 1,
	shiftOnKeyHold: 1,
};
const testModel = new sliderModel(conf);
testModel.getConf(conf);
testModel.start();

describe('model', () => {
	test('calcPos, no Sticky', () => {

		expect(testModel.calcPos(
			undefined, 50, 50, 100, 100, 10, 10, 0.5, 'min')).
			toBe('newPos < 0');

		expect(testModel.calcPos(
			undefined, 50, 500, 100, 100, 10, 10, 0.5, 'max')).
			toBe('newPos > 100');

		expect(testModel.calcPos(
			undefined, 0, 100, 0, 50, 200, 0, 0.5, 'min')).
			toBe(25);

		expect(testModel.calcPos(
			undefined, 0, 150, 0, 50, 200, 0, 0.5, 'max')).
			toBe(50);

		expect(testModel.calcPos(
			undefined, 0, 50, 0, 50, 200, 0, 0.5, 'max')).
			toBe('newPos < fromPos');

		expect(testModel.calcPos(
			undefined, 0, 200, 0, 50, 200, 0, 0.5, 'min')).
			toBe('newPos > toPos');

	});

	test('calcpos, sticky', async () => {
		await testModel.update({ sticky: true });

		expect(testModel.calcPos(
			undefined, 50, 50, 100, 100, 10, 10, 0.5, 'min')).
			toBe(0);

		expect(testModel.calcPos(
			undefined, 50, 500, 100, 100, 10, 10, 0.5, 'max')).
			toBe(100);

		expect(testModel.calcPos(
			undefined, 0, 100, 0, 50, 200, 0, 0.5, 'min')).
			toBe(30);

		expect(testModel.calcPos(
			undefined, 0, 150, 0, 50, 200, 0, 0.5, 'max')).
			toBe(50);

		expect(testModel.calcPos(
			undefined, 0, 50, 0, 50, 200, 0, 0.5, 'max')).
			toBe('newPos < fromPos');

		expect(testModel.calcPos(
			undefined, 0, 200, 0, 50, 200, 0, 0.5, 'min')).
			toBe('newPos > toPos');
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
