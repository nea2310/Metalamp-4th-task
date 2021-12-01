import { sliderController } from './controller';
import { sliderModel } from './../model/model';
//jest.mock('./../model/model');
import { sliderView } from './../view/view';
//jest.mock('./../view/view');
import { IConf } from './../interface';


/*
jest.mock('./../view/view');
const viewMock = sliderView as jest.MockedClass<typeof sliderView>;
jest.mock('./../model/model');
const modelMock = sliderModel as jest.MockedClass<typeof sliderModel>;
*/

/*
const mockSliderViewFile = jest.fn();
const viewMock = jest.mock('./../view/view', () => {
	return jest.fn().mockImplementation(() => {
		return { sliderViewFile: mockSliderViewFile };
	});
});
console.log(viewMock);
*/

/***********************************/
const parent3 = document.createElement('input');
document.body.appendChild(parent3);
const conf3: IConf = {
	min: 10,
	max: 100,
	from: 20,
	to: 70,
	vertical: true,
	range: false,
	bar: false,
	tip: false,
	scale: false,
	scaleBase: 'step',
	step: 10,
	interval: 0,
	sticky: true,
	shiftOnKeyDown: 1,
	shiftOnKeyHold: 1,
};
const testModel3 = new sliderModel(conf3);
const testView3 = new sliderView(parent3, 0);
const TestController3 = new sliderController(testModel3, testView3);


/***********************************/
const parent2 = document.createElement('input');
document.body.appendChild(parent2);
const conf2: IConf = {
	min: 10,
	max: 100,
	from: 20,
	to: 70,
	vertical: true,
	range: false,
	bar: false,
	tip: false,
	scale: false,
	scaleBase: 'interval',
	step: 0,
	interval: 10,
	sticky: true,
	shiftOnKeyDown: 1,
	shiftOnKeyHold: 1,
};
const testModel2 = new sliderModel(conf2);
const testView2 = new sliderView(parent2, 0);
const TestController2 = new sliderController(testModel2, testView2);



/***********************************/

const parent1 = document.createElement('input');
document.body.appendChild(parent1);
const conf1: IConf = {
	min: 10,
	max: 100,
	from: 20,
	to: 70,
	vertical: true,
	range: true,
	bar: true,
	tip: true,
	scale: true,
	scaleBase: 'interval',
	step: 0,
	interval: 10,
	sticky: false,
	shiftOnKeyDown: 1,
	shiftOnKeyHold: 1,
};
const testModel1 = new sliderModel(conf1);
const testView1 = new sliderView(parent1, 0);
const TestController1 = new sliderController(testModel1, testView1);

/***********************************/

const parent = document.createElement('input');
document.body.appendChild(parent);
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
const testView = new sliderView(parent, 0);
const TestController = new sliderController(testModel, testView);

describe('controller', () => {
	test('calls update method in model on calling API method "update"', () => {
		const updateSpy = jest.spyOn(testModel, 'update');
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
