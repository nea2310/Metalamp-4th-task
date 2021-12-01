import { sliderViewScale } from './view-scale';
import { IConf } from '../../interface';

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


function mockCustomEvent(element: any,
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
		elem.classList.add('rs__mark');
		let label = document.createElement('div');
		label.innerText = String(node.val);
		label.classList.add('rs__label');
		mockElementDimensions(elem, { width: elemWidth, height: elemHeight });
		mockElementDimensions(label, { width: elemWidth, height: elemHeight });
		elem.appendChild(label);

		if (conf.vertical) {
			elem.classList.add('vert');
			label.classList.add('vert');
			elem.style.bottom = String(node.pos) + '%';
		} else {
			elem.classList.add('horizontal');
			label.classList.add('horizontal');
			elem.style.left = String(node.pos) + '%';
		}
		if (!conf.scale) {
			elem.classList.add('visually-hidden');
		}
		wrapper.appendChild(elem);
		if (conf.vertical) {
			label.style.top = label.offsetHeight / 2 * (-1) + 'px';
		} else {
			label.style.left = label.offsetWidth / 2 * (-1) + 'px';
		}
	}
	return [...wrapper.querySelectorAll<HTMLElement>('.rs__mark')];
}

const data = {
	marksArr: [
		{ pos: 0, val: 0 },
		{ pos: 50, val: 5 },
		{ pos: 100, val: 10 }
	]
};

const conf = {
	vertical: false,
	scale: true,
};
/***********INSTANCE 1 lastLabelRemoved = true****************/
const root1 = document.createElement('input');
root1.className = 'rs__root';

const slider1 = document.createElement('div');
slider1.className = 'rs__wrapper';
root1.after(slider1);

const track1 = document.createElement('div');
track1.className = 'rs__track';
slider1.append(track1);

const testViewScale1 = new sliderViewScale(slider1, track1, conf);
testViewScale1.lastLabelRemoved = true;

testViewScale1.createScale(data.marksArr, {
	scale: true,
	vertical: false
});

testViewScale1.createScale(data.marksArr, {
	scale: true,
	vertical: true
});

testViewScale1.createScale(data.marksArr, {
	scale: false,
	vertical: false
});

testViewScale1.createScale(data.marksArr, {
	scale: false,
	vertical: true
});


/***********INSTANCE 3  mockElementDimensions****************/
const root3 = document.createElement('input');
root3.className = 'rs__root';

const slider3 = document.createElement('div');
slider3.className = 'rs__wrapper';
root3.after(slider3);

const track3 = document.createElement('div');
track3.className = 'rs__track';
slider3.append(track3);
mockElementDimensions(track3, { width: 100, height: 100 });
const markList3 = createMarkList(data.marksArr, conf, track3, 100, 100);
const testViewScale3 = new sliderViewScale(slider3, track3, conf, markList3);


testViewScale3.createScale(data.marksArr, {
	scale: true,
	vertical: false
});

testViewScale3.createScale(data.marksArr, {
	scale: true,
	vertical: true
});

testViewScale3.createScale(data.marksArr, {
	scale: false,
	vertical: false
});

testViewScale3.createScale(data.marksArr, {
	scale: false,
	vertical: true
});

/***********INSTANCE 4 lastLabelRemoved = false****************/
const root4 = document.createElement('input');
root4.className = 'rs__root';

const slider4 = document.createElement('div');
slider4.className = 'rs__wrapper';
root4.after(slider4);

const track4 = document.createElement('div');
track4.className = 'rs__track';
slider4.append(track4);

const testViewScale4 = new sliderViewScale(slider4, track4, conf);
testViewScale4.createScale(data.marksArr, {
	scale: true,
	vertical: false
});

testViewScale4.createScale(data.marksArr, {
	scale: true,
	vertical: true
});

testViewScale4.createScale(data.marksArr, {
	scale: false,
	vertical: false
});

testViewScale4.createScale(data.marksArr, {
	scale: false,
	vertical: true
});



/***************************/

describe('ViewScale', () => {

	test('createScale', () => {
		expect(testViewScale1.createScale(data.marksArr, {
			scale: true,
			vertical: false
		})).
			toHaveLength(3);

		expect(testViewScale3.createScale(data.marksArr, {
			scale: true,
			vertical: false
		})).
			toHaveLength(1);
	});



	test('switchScale', () => {
		const a = testViewScale1.switchScale({
			scale: true,
		});
		expect(a[0].classList.contains('visually-hidden')).toBe(false);
		const b = testViewScale1.switchScale({
			scale: false,
		});
		expect(b[0].classList.contains('visually-hidden')).toBe(true);
	});


	test('resize', async () => {
		jest.useFakeTimers();
		jest.spyOn(global, 'setTimeout');
		mockCustomEvent(window,
			{ eventType: 'optimizedResize' });
		expect(setTimeout).toHaveBeenCalledTimes(14);
		expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 200);
	});
});

