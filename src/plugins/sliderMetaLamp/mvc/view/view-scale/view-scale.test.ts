import { sliderController } from './../../controller/controller';
import { sliderModel } from './../../model/model';
import { sliderView } from './../../view/view';
import { IConf } from './../../interface';

function mockElementDimensions(element: HTMLElement, {
	width, height, padding = 0, x = 0, y = 0,
}: {
	width: number, height: number, padding?: number, x?: number, y?: number,
}): HTMLElement {
	const mockElement = element;
	mockElement.style.width = `${width}px`;
	mockElement.style.height = `${height}px`;
	mockElement.getBoundingClientRect = jest.fn(() => {
		const rect = {
			x,
			y,
			left: x,
			top: y,
			width,
			height,
			right: x + width,
			bottom: y + height,
		};
		return { ...rect, toJSON: () => rect };
	});
	Object.defineProperties(mockElement, {
		clientWidth: { value: width + 2 * padding },
		clientHeight: { value: height + 2 * padding },
		offsetWidth: { value: width + 2 * padding },
		offsetHeight: { value: height + 2 * padding },
		width: { value: width + 2 * padding },
		height: { value: height + 2 * padding },
	});
	return mockElement;
}




const wrapper1 = document.createElement('div');
mockElementDimensions(wrapper1, { width: 500, height: 500 });
const parent1 = document.createElement('input');
wrapper1.appendChild(parent1);
const conf1 = {
	vertical: false,
	scale: true,
};

const data1 = {
	marksArr: [
		{ pos: 0, val: 0 },
		{ pos: 50, val: 5 },
		{ pos: 100, val: 10 }
	]
};

const testView1 = new sliderView(parent1, 0);
testView1.init(conf1);
testView1.updateScale(data1, conf1);
const testViewScale1 = testView1.viewScale;
/******************/


const parent2 = document.createElement('input');
document.body.appendChild(parent2);
const conf2 = {
	vertical: true,
	scale: true,
};

const data2 = {
	marksArr: [
		{ pos: 0, val: 0 },
		{ pos: 50, val: 5 },
		{ pos: 100, val: 10 }
	]
};

const testView2 = new sliderView(parent2, 0);
testView2.init(conf2);
testView2.updateScale(data2, conf2);
const testViewScale2 = testView2.viewScale;

/*********************/

const wrapper3 = document.createElement('div');
mockElementDimensions(wrapper3, { width: 500, height: 500 });
const parent3 = document.createElement('input');
wrapper3.appendChild(parent3);
const conf3 = {
	vertical: false,
	scale: false,
};

const data3 = {
	marksArr: [
		{ pos: 0, val: 0 },
		{ pos: 50, val: 5 },
		{ pos: 100, val: 10 }
	]
};

const testView3 = new sliderView(parent3, 0);
testView1.init(conf3);
testView1.updateScale(data3, conf3);
const testViewScale3 = testView3.viewScale;

/******************/


const parent4 = document.createElement('input');
document.body.appendChild(parent4);
const conf4 = {
	vertical: true,
	scale: false,
};

const data4 = {
	marksArr: [
		{ pos: 0, val: 0 },
		{ pos: 50, val: 5 },
		{ pos: 100, val: 10 }
	]
};

const testView4 = new sliderView(parent4, 0);
testView1.init(conf4);
testView1.updateScale(data4, conf4);
const testViewScale4 = testView4.viewScale;

/*********************/

function mockCustomEvent(element: any,
	{ eventType }: { eventType: string }): void {
	const customEvent = new CustomEvent(eventType,
		{ bubbles: true }
	);
	element.dispatchEvent(customEvent);
}


describe('ViewScale', () => {

	test('createScale', () => {
		expect(testViewScale1.createScale(data1.marksArr, conf1)).
			toHaveLength(3);
		expect(testViewScale1.markList).toHaveLength(3);
	});



	// test('switchScale', () => {
	// 	//testViewScale1.switchScale(conf1);
	// 	const t = testViewScale1.switchScale(conf1)[0];
	// 	expect(t.classList.contains('visually-hidden')).toBe(false);
	// 	const a = testViewScale1.switchScale(conf3)[0];
	// 	expect(a.classList.contains('visually-hidden')).toBe(true);
	// 	//expect(testViewScale2.switchScale(conf3)).toBe(true);
	// 	//let stepMarks = testViewScale2.querySelectorAll('.rs__mark');
	// });


	test('resize', async () => {
		jest.useFakeTimers();
		jest.spyOn(global, 'setTimeout');
		mockCustomEvent(window,
			{ eventType: 'optimizedResize' });
		//	expect(testSpy).toBeCalled();
		expect(setTimeout).toHaveBeenCalledTimes(5);
		expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 200);
		//	setTimeout(expect(testSpy).toBeCalled, 0);

	});

});

