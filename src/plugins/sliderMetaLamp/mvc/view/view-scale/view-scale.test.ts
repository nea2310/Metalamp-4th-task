import { IConf } from '../../interface';
import { ViewScale } from './view-scale';

interface IMockElement {
	width: number,
	height: number,
	padding?: number,
	x?: number,
	y?: number,
}

function mockElementDimensions(element: HTMLElement, {
	width, height, padding = 0, x = 0, y = 0,
}: IMockElement) {
	element.getBoundingClientRect = jest.fn(() => {
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
	Object.defineProperties(element, {
		offsetWidth: { value: width + 2 * padding },
		offsetHeight: { value: height + 2 * padding },
	});
	return element;
}


function mockCustomEvent(element: Window,
	{ eventType }: { eventType: string }): void {
	const customEvent = new CustomEvent(eventType,
		{ bubbles: true }
	);
	element.dispatchEvent(customEvent);
}


function createMarkList(scaleMarks: { 'pos'?: number, 'val'?: number }[],
	conf: IConf, wrapper: HTMLElement, elemWidth: number, elemHeight: number) {
	for (let node of scaleMarks) {
		let elem = document.createElement('div');
		elem.classList.add('js-rs-metalamp__mark');
		let label = document.createElement('div');
		mockElementDimensions(elem, { width: elemWidth, height: elemHeight });
		mockElementDimensions(label, { width: elemWidth, height: elemHeight });
		elem.appendChild(label);
		wrapper.appendChild(elem);
	}
	return [...wrapper.querySelectorAll<HTMLElement>('.js-rs-metalamp__mark')];
}


const marksArr = [
	{ pos: 0, val: 0 },
	{ pos: 50, val: 5 },
	{ pos: 100, val: 10 }
];


const conf = {
	vertical: false,
	scale: true,
};


function prepareInstance(
	scaleMarks: { 'pos'?: number, 'val'?: number }[],
	conf: IConf,
	mockDimensions: boolean) {

	const root = document.createElement('input');
	const slider = document.createElement('div');
	root.after(slider);
	const track = document.createElement('div');
	slider.append(track);
	let testViewScale: ViewScale;
	if (mockDimensions) {
		mockElementDimensions(track, { width: 100, height: 100 });
		const markList = createMarkList(scaleMarks, conf, track, 100, 100);
		testViewScale =
			new ViewScale(slider, track, conf, markList);
	}
	else {
		testViewScale = new ViewScale(slider, track, conf);
	}

	function createScale(conf: IConf) {
		testViewScale.createScale(scaleMarks, conf);
	}
	//create scale for each scale / vertical combination
	createScale({ scale: true, vertical: false });
	createScale({ scale: true, vertical: true });
	createScale({ scale: false, vertical: false });
	createScale({ scale: false, vertical: true });

	return testViewScale;
}

/***************************/

describe('ViewScale', () => {
	// eslint-disable-next-line max-len
	test('scale marks are not hidden if their total width (height) is less or equal to slider width (height)', () => {
		const testViewScale = prepareInstance(
			marksArr, conf, false
		);
		expect(testViewScale.createScale(marksArr, {
			scale: true,
			vertical: false
		})).
			toHaveLength(3);
	});

	// eslint-disable-next-line max-len
	test('scale marks are hidden if their total width (height) is less or equal to slider width (height)', () => {
		const testViewScale = prepareInstance(
			marksArr, conf, true
		);
		expect(testViewScale.createScale(marksArr, {
			scale: true,
			vertical: false
		})).
			toHaveLength(1);
	});

	test('switchScale', () => {
		const testViewScale = prepareInstance(
			marksArr, conf, false
		);
		const a = testViewScale.switchScale({
			scale: true,
		});
		expect(a[0].classList.contains('rs-metalamp__mark_visually-hidden')).
			toBe(false);
		const b = testViewScale.switchScale({
			scale: false,
		});
		expect(b[0].classList.contains('rs-metalamp__mark_visually-hidden')).
			toBe(true);
	});

});

