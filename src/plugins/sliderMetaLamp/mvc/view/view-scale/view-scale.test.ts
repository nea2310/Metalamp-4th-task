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


function mockCustomEvent(element: any,
	{ eventType }: { eventType: string }): void {
	const customEvent = new CustomEvent(eventType,
		{/* including in this second parameter of TouchEvent constructor (touchEventInit) any parameter which value is Touch object (touches, targetTouches, changedTouches)
even with its default value (empty array) ends up with error Touch is not defined in Jest.*/
			bubbles: true,
		}
	);
	element.dispatchEvent(customEvent);
}


describe('ViewScale', () => {

	console.log(arr.length);

	test('createScale', async () => {
		expect(testViewScale.createScale([
			{ pos: 0, val: 0 },
			{ pos: 50, val: 5 },
			{ pos: 100, val: 10 }
		], {})).toHaveLength(3);
		expect(testViewScale.markList).toHaveLength(3);
	});

	test('resize', () => {
		mockCustomEvent(window,
			{ eventType: 'optimizedResize' });
		expect(testSpy).toBeCalledTimes(1);
	});

});

