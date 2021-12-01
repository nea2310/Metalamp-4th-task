import { sliderController } from './../../controller/controller';
import { sliderModel } from './../../model/model';
import { sliderView } from './../../view/view';
import { IConf } from './../../interface';

function mockPointerEvent(element: HTMLElement, {
	eventType, clientX = 0, clientY = 0,
}: {
	eventType: string, clientX?: number, clientY?: number,
}): void {
	const pointerEvent = new MouseEvent(eventType, {
		bubbles: true,
		clientX,
		clientY,
	});
	element.setPointerCapture = jest.fn(element.setPointerCapture);
	element.releasePointerCapture = jest.fn(element.releasePointerCapture);
	element.dispatchEvent(pointerEvent);
}


function mockTouchEvent(element: HTMLElement,
	{ eventType }: { eventType: string }): void {
	const touchEvent = new TouchEvent(eventType,
		{/* including in this second parameter of TouchEvent constructor (touchEventInit) any parameter which value is Touch object (touches, targetTouches, changedTouches)
even with its default value (empty array) ends up with error Touch is not defined in Jest.*/
			bubbles: true,
		}
	);
	element.dispatchEvent(touchEvent);
}

function mockKeyboardEvent(element: HTMLElement,
	{ eventType, key = 'ArrowLeft', repeat = false }:
		{ eventType: string, key: string, repeat: boolean }): void {
	const keyboardEvent = new KeyboardEvent(eventType,
		{
			code: key,
			repeat: repeat,
			bubbles: true,
		}
	);
	element.setPointerCapture = jest.fn(element.setPointerCapture);
	element.releasePointerCapture = jest.fn(element.releasePointerCapture);
	element.dispatchEvent(keyboardEvent);
}

const parent = document.createElement('input');
document.body.appendChild(parent);
const conf: IConf = {};

const testModel = new sliderModel(conf);
const testView = new sliderView(parent, 0);
const testController = new sliderController(testModel, testView);

const testViewControl = testView.viewControl;
const calcPosSpy = jest.spyOn(testModel, 'calcPos');
const calcPosKeySpy = jest.spyOn(testModel, 'calcPosKey');
//const testSpy = jest.spyOn(testViewControl, 'test');

const updatePosSpy = jest.spyOn(testViewControl, 'updatePos');




describe('apply styles on calling ViewControl method', () => {

	test('updatePos', async () => {
		expect(testViewControl.controlMax).
			toHaveProperty('style.left', '100%');
		expect(testViewControl.controlMax).
			toHaveProperty('style.bottom', '');
		/*
		Это не протестируешь, т.к. в расчетах используется offsetWidth
				expect(testViewControl.tipMax).
					toHaveProperty('style.left', '0px');
				expect(testViewControl.tipMax).
					toHaveProperty('style.bottom', '');
		*/
		await testViewControl.updatePos(testViewControl.controlMax, 50);

		expect(testViewControl.controlMax).toHaveProperty('style.left', '50%');
		expect(testViewControl.controlMax).toHaveProperty('style.bottom', '');
		/*
		Это не протестируешь, т.к. в расчетах используется offsetWidth
				expect(testViewControl.tipMax).toHaveProperty('style.left', '0px');
				expect(testViewControl.tipMax).toHaveProperty('style.bottom', '');
		*/
	});

	test('change tip inner text on calling updateVal method', async () => {
		expect(testViewControl.tipMin.innerText).toBe('0');
		expect(testViewControl.tipMax.innerText).toBe('10');
		await testViewControl.updateVal('20', true);
		await testViewControl.updateVal('30', false);
		expect(testViewControl.tipMin.innerText).toBe('20');
		expect(testViewControl.tipMax.innerText).toBe('30');
	});




	test('update input value on calling updateInput method', async () => {
		expect(parent.value).toBe('0, 10');
		await testViewControl.updateInput({ from: 20, to: 30, range: true });
		expect(parent.value).toBe('20, 30');
	});


	test('toggle classes on calling switchVertical method', async () => {
		expect(testViewControl.controlMin.classList.contains('vert')).
			toBe(false);
		expect(testViewControl.controlMax.classList.contains('vert')).
			toBe(false);
		expect(testViewControl.tipMin.classList.contains('vert')).
			toBe(false);
		expect(testViewControl.tipMax.classList.contains('vert')).
			toBe(false);
		await testViewControl.switchVertical({ vertical: true });
		expect(testViewControl.controlMin.classList.contains('vert')).
			toBe(true);
		expect(testViewControl.controlMax.classList.contains('vert')).
			toBe(true);
		expect(testViewControl.tipMin.classList.contains('vert')).
			toBe(true);
		expect(testViewControl.tipMax.classList.contains('vert')).
			toBe(true);
		await testViewControl.switchVertical({ vertical: false });
		expect(testViewControl.controlMin.classList.contains('vert')).
			toBe(false);
		expect(testViewControl.controlMax.classList.contains('vert')).
			toBe(false);
		expect(testViewControl.tipMin.classList.contains('vert')).
			toBe(false);
		expect(testViewControl.tipMax.classList.contains('vert')).
			toBe(false);
	});

	test('toggle class hidden on calling switchRange method', async () => {
		expect(testViewControl.controlMin.classList.contains('hidden')).
			toBe(false);
		expect(testViewControl.controlMax.classList.contains('hidden')).
			toBe(false);
		expect(testViewControl.tipMin.classList.contains('hidden')).
			toBe(false);
		expect(testViewControl.tipMax.classList.contains('hidden')).
			toBe(false);
		await testViewControl.switchRange({ range: false, tip: true });
		expect(testViewControl.controlMin.classList.contains('hidden')).
			toBe(false);
		expect(testViewControl.controlMax.classList.contains('hidden')).
			toBe(true);
		expect(testViewControl.tipMin.classList.contains('hidden')).
			toBe(false);
		expect(testViewControl.tipMax.classList.contains('hidden')).
			toBe(true);
		await testViewControl.switchRange({ range: true, tip: true });
		expect(testViewControl.controlMin.classList.contains('hidden')).
			toBe(false);
		expect(testViewControl.controlMax.classList.contains('hidden')).
			toBe(false);
		expect(testViewControl.tipMin.classList.contains('hidden')).
			toBe(false);
		expect(testViewControl.tipMax.classList.contains('hidden')).
			toBe(false);
	});

	test('toggle class hidden on calling switchTip method', async () => {
		expect(testViewControl.tipMin.classList.contains('hidden')).
			toBe(false);
		expect(testViewControl.tipMax.classList.contains('hidden')).
			toBe(false);
		await testViewControl.switchTip({ range: true, tip: false });
		expect(testViewControl.tipMin.classList.contains('hidden')).
			toBe(true);
		expect(testViewControl.tipMax.classList.contains('hidden')).
			toBe(true);
		await testViewControl.switchTip({ range: true, tip: true });
		expect(testViewControl.tipMin.classList.contains('hidden')).
			toBe(false);
		expect(testViewControl.tipMax.classList.contains('hidden')).
			toBe(false);
	});

});


describe('ViewControl event listeners', () => {

	afterEach(() => {
		calcPosSpy.mockClear();
	});


	test('notifies observer about control mooving made by touching', () => {
		mockTouchEvent(testViewControl.controlMax,
			{ eventType: 'touchstart' });
		mockTouchEvent(testViewControl.controlMax,
			{ eventType: 'touchmove' });
		expect(calcPosSpy).toBeCalledTimes(1);
		expect(calcPosSpy).toBeCalledWith(
			undefined, 0, 0, 0, 0, 0, 0, undefined, "max");
	});

	test('notifies observer about control mooving made by mouse', () => {
		mockPointerEvent(testViewControl.controlMax,
			{ eventType: 'pointerdown', clientY: 100, clientX: 100 });
		mockPointerEvent(testViewControl.controlMax,
			{ eventType: 'pointermove', clientY: 100, clientX: 1000 });
		expect(calcPosSpy).toBeCalledTimes(1);
		expect(calcPosSpy).toBeCalledWith(
			undefined, 100, 1000, 0, 0, 0, 0, 100, "max");
	});

	test('notifies observer about clicking on the track', () => {
		mockPointerEvent(testViewControl.track,
			{ eventType: 'pointerdown', clientY: 100, clientX: 100 });
		expect(calcPosSpy).toBeCalledTimes(1);
		expect(calcPosSpy).toBeCalledWith(
			"pointerdown", 100, 100, 0, 0, 0, 0, 100, "min");
	});

	test('notifies observer about pressing on a focused control', () => {
		mockKeyboardEvent(testViewControl.controlMax,
			{ eventType: 'keydown', key: 'ArrowLeft', repeat: false });
		expect(calcPosKeySpy).toBeCalledTimes(1);
		expect(calcPosKeySpy).toBeCalledWith('ArrowLeft', false, 'max');
	});
});