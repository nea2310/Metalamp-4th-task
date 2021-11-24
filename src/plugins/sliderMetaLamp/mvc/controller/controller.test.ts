import { sliderController } from './controller';
import { sliderModel } from './../model/model';
import { sliderView } from './../view/view';
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

const parent = document.createElement('input');
document.body.appendChild(parent);

const conf: IConf = {};
const testModel = new sliderModel(conf);
const testView = new sliderView(parent, 0);
const TestController =
	new sliderController(testModel, testView);
const updateSpy = jest.spyOn(testModel, 'update');

describe('controller', () => {
	test('calls update method in model on calling API method "update"', () => {
		TestController.update(conf);
		expect(updateSpy).toBeCalledTimes(1);
		expect(updateSpy).toBeCalledWith(conf);
	});
});
