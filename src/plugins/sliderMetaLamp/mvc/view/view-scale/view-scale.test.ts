import { sliderController } from './../../controller/controller';
import { sliderModel } from './../../model/model';
import { sliderView } from './../../view/view';
import { IConf } from './../../interface';


const parent = document.createElement('input');
document.body.appendChild(parent);
const conf: IConf = {};

const testView = new sliderView(parent, 0);
testView.init({});
const testViewScale = testView.viewScale;
const arr = testViewScale.slider.querySelectorAll('.rs__mark');
const testSpy = jest.spyOn(testViewScale, 'test');
const createScaleSpy = jest.spyOn(testViewScale, 'createScale');



function mockCustomEvent(element: any,
	{ eventType }: { eventType: string }): void {
	const customEvent = new CustomEvent(eventType,
		{ bubbles: true }
	);
	element.dispatchEvent(customEvent);
}


describe('ViewScale', () => {

	//console.log(arr.length);
	const arr = [
		{ pos: 0, val: 0 },
		{ pos: 50, val: 5 },
		{ pos: 100, val: 10 }
	];


	test('createScale', () => {
		expect(testViewScale.createScale(arr, {})).toHaveLength(3);
		expect(testViewScale.markList).toHaveLength(3);
	});

	test('resize', async () => {
		jest.useFakeTimers();
		jest.spyOn(global, 'setTimeout');
		mockCustomEvent(window,
			{ eventType: 'optimizedResize' });
		//	expect(testSpy).toBeCalled();
		expect(setTimeout).toHaveBeenCalledTimes(1);
		expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 200);
		//	setTimeout(expect(testSpy).toBeCalled, 0);

	});

});

