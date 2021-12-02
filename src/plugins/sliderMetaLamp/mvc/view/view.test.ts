import { sliderView } from './../view/view';
import { IConf, Idata } from './../interface';
import { sliderViewControl } from './view-control/view-control';
import { sliderViewScale } from './view-scale/view-scale';
import { sliderViewBar } from './view-bar/view-bar';

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

const testView = new sliderView(parent, 0);
const initSpy = jest.spyOn(testView, 'init');
testView.init(conf);
const testViewControl = testView.viewControl;
const testViewScale = testView.viewScale;
const testViewBar = testView.viewBar;



describe('ViewScale', () => {
	const updatePosSpy = jest.spyOn(testViewControl, 'updatePos');
	const updateInputSpy = jest.spyOn(testViewControl, 'updateInput');
	const updateValSpy = jest.spyOn(testViewControl, 'updateVal');
	test('init', () => {
		expect(initSpy).toBeCalledTimes(1);
		expect(testViewControl).toBeInstanceOf(sliderViewControl);
		expect(testViewScale).toBeInstanceOf(sliderViewScale);
		expect(testViewBar).toBeInstanceOf(sliderViewBar);
		expect(testView.viewControl.observers).toHaveLength(2);
	});

	test('updateFromPos', async () => {
		const conf = {};
		const data = { fromPos: 10 };
		testView.updateFromPos(data, conf);
		expect(updatePosSpy).toBeCalledTimes(1);
		expect(updatePosSpy).toBeCalledWith(
			testView.viewControl.controlMin, 10);
		expect(updateInputSpy).toBeCalledTimes(1);
		expect(updateInputSpy).toBeCalledWith({});

		updatePosSpy.mockClear();
		updateInputSpy.mockClear();
	});


	test('updateToPos', () => {
		const conf = {};
		const data = { toPos: 10 };
		testView.updateToPos(data, conf);
		expect(updatePosSpy).toBeCalledTimes(1);
		expect(updatePosSpy).toBeCalledWith(
			testView.viewControl.controlMax, 10);
		expect(updateInputSpy).toBeCalledTimes(1);
		expect(updateInputSpy).toBeCalledWith({});

		updatePosSpy.mockClear();
		updateInputSpy.mockClear();
	});

	test('updateFromVal', () => {
		const data = { fromVal: '10' };
		testView.updateFromVal(data);
		expect(updateValSpy).toBeCalledTimes(1);
		expect(updateValSpy).toBeCalledWith('10', true);
		updateValSpy.mockClear();
	});

	test('updateToVal', () => {
		const data = { toVal: '10' };
		testView.updateToVal(data);
		expect(updateValSpy).toBeCalledTimes(1);
		expect(updateValSpy).toBeCalledWith('10', false);
		updateValSpy.mockClear();
	});

	test('updateScale', () => {
		const conf = { vertical: true, scale: true };
		const data = {
			marksArr: [
				{ pos: 0, val: 0 },
				{ pos: 50, val: 5 },
				{ pos: 100, val: 10 }
			]
		};
		const createScaleSpy = jest.spyOn(testViewScale, 'createScale');
		testView.updateScale(data, conf);
		expect(createScaleSpy).toBeCalledTimes(1);
		expect(createScaleSpy).toBeCalledWith([
			{ pos: 0, val: 0 },
			{ pos: 50, val: 5 },
			{ pos: 100, val: 10 }
		], conf);
	});

	test('updateBar', () => {
		const conf = { vertical: true, scale: true };
		const data = { barPos: 10, barWidth: 100 };
		const updateBarSpy = jest.spyOn(testViewBar, 'updateBar');
		testView.updateBar(data, conf);
		expect(updateBarSpy).toBeCalledTimes(1);
		expect(updateBarSpy).toBeCalledWith(10, 100, true);
	});

	test('switchScale', () => {
		const conf = { vertical: true, scale: true };
		const switchScaleSpy = jest.spyOn(testViewScale, 'switchScale');
		testView.switchScale(conf);
		expect(switchScaleSpy).toBeCalledTimes(1);
		expect(switchScaleSpy).toBeCalledWith(conf);
	});

	test('switchBar', () => {
		const conf = { bar: false };
		const switchBarSpy = jest.spyOn(testViewBar, 'switchBar');
		testView.switchBar(conf);
		expect(switchBarSpy).toBeCalledTimes(1);
		expect(switchBarSpy).toBeCalledWith(conf);
	});

	test('switchTip', async () => {
		const conf = { tip: true };
		const switchTipSpy = jest.spyOn(testViewControl, 'switchTip');
		testView.switchTip(conf);
		expect(switchTipSpy).toBeCalledTimes(1);
		expect(switchTipSpy).toBeCalledWith(conf);
	});
});
