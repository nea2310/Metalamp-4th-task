import { sliderController } from './../../controller/controller';
import { sliderModel } from './../../model/model';
import { sliderView } from './../../view/view';
import { IConf } from './../../interface';

let parent: HTMLInputElement;
parent = document.createElement('input');
document.body.appendChild(parent);
const conf: IConf = {};

const testModel = new sliderModel(conf);
const testView = new sliderView(parent, 0);

new sliderController(testModel, testView);
const testViewControl = testView.viewControl;
const calcPosSpy = jest.spyOn(testModel, 'calcPos');

function mockPointerEvent(element: HTMLElement, {
	eventType, clientX = 0, clientY = 0,
}: {
	eventType: string, clientX?: number, clientY?: number,
}): void {
	const mockElement = element;
	const pointerEvent = new MouseEvent(eventType, {
		//	view: window,
		bubbles: true,
		cancelable: true,
		clientX,
		clientY,
	});
	mockElement.setPointerCapture = jest.fn(element.setPointerCapture);
	mockElement.releasePointerCapture = jest.fn(element.releasePointerCapture);
	mockElement.dispatchEvent(pointerEvent);
}


function mockTouchEvent(element: HTMLElement,
	{ eventType }: { eventType: string }): void {
	const mockElement = element;
	const touchEvent = new TouchEvent(eventType,
		{/* including in this second parameter of TouchEvent constructor (touchEventInit) any parameter which value is Touch object (touches, targetTouches, changedTouches)
even with its default value (empty array) ends up with error Touch is not defined in Jest.
But touchEventInit should include other non-Touch object parameters,
otherwise the dispatched event will not trigger the event listener
*/
			cancelable: true,
			bubbles: true,
		}
	);
	mockElement.dispatchEvent(touchEvent);
}


describe('ViewControl', () => {

	afterEach(() => {
		calcPosSpy.mockClear();
	});
	test('notifies observer about control mooving made by touching', () => {
		mockTouchEvent(testViewControl.controlMax,
			{ eventType: 'touchstart' });
		mockTouchEvent(testViewControl.controlMax,
			{ eventType: 'touchmove' });
		expect(calcPosSpy).toBeCalledTimes(1);
	});

	test('notifies observer about control mooving made by mouse', () => {
		mockPointerEvent(testViewControl.controlMax,
			{ eventType: 'pointerdown', clientY: 100 });
		mockPointerEvent(testViewControl.controlMax,
			{ eventType: 'pointermove', clientY: 100 });
		expect(calcPosSpy).toBeCalledTimes(1);
	});

	test('notifies observer about clicking on the track', () => {
		mockPointerEvent(testViewControl.track,
			{ eventType: 'pointerdown', clientY: 100 });
		expect(calcPosSpy).toBeCalledTimes(1);
	});

});
