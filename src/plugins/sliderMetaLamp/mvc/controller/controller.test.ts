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

function prepareInstance(conf: IConf) {
	const parent = document.createElement('input');
	document.body.appendChild(parent);
	const testModel = new sliderModel(conf);
	const testView = new sliderView(parent, 0);
	return new sliderController(testModel, testView);
}


/***********************************/
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


const TestController2 = prepareInstance(conf2);

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