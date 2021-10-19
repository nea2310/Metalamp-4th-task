import './slider.scss';
import { Panel } from './../panel/panel';
import {
	IConf,
	$Idata
} from './../../plugins/slider/interface';


// const panelHor = document.querySelector('.panel-horizontal');
// const panelHorObj = new Panel('.panel', panelHor);
// const sliderHorObj = $('.rs__wrapper-hor').Slider({
// 	min: -10,
// 	max: 100,
// 	from: 0,
// 	to: 70,
// 	step: 2,
// 	shiftOnKeyDown: 1,
// 	shiftOnKeyHold: 2,
// 	sticky: false,
// 	//intervals: 26,
// 	//vertical: true,
// 	//range: false
// 	onStart: (data: IConf) => {
// 		//	console.log(panelHorObj);
// 		panelHorObj.min.value = data.min;
// 		panelHorObj.max.value = data.max;
// 		panelHorObj.from.value = data.from;
// 		panelHorObj.to.value = data.to;
// 		panelHorObj.interval.value = data.intervals;
// 		panelHorObj.step.value = data.step;
// 		panelHorObj.shiftOnKeyDown.value = data.shiftOnKeyDown;
// 		panelHorObj.shiftOnKeyHold.value = data.shiftOnKeyHold;

// 		panelHorObj.vertical.checked = data.vertical;
// 		panelHorObj.range.checked = data.range;
// 		panelHorObj.scale.checked = data.scale;
// 		panelHorObj.bar.checked = data.bar;
// 		panelHorObj.tip.checked = data.tip;
// 		panelHorObj.sticky.checked = data.sticky;

// 	}

// }).data('Slider'); // вернёт объект для одного элемента


// const panelVert = document.querySelector('.panel-vertical');
// const panelVertObj = new Panel('.panel', panelVert);
// const sliderVertObj = $('.rs__wrapper-vert').Slider({
// 	min: 0,
// 	max: 90,
// 	from: 10,
// 	to: 80,
// 	step: 2,
// 	shiftOnKeyDown: 1,
// 	shiftOnKeyHold: 2,
// 	sticky: false,
// 	//intervals: 26,
// 	vertical: true,
// 	//range: false
// 	onStart: (data: IConf) => {

// 		panelVertObj.min.value = data.min;
// 		panelVertObj.max.value = data.max;
// 		panelVertObj.from.value = data.from;
// 		panelVertObj.to.value = data.to;
// 		panelVertObj.interval.value = data.intervals;
// 		panelVertObj.step.value = data.step;
// 		panelVertObj.shiftOnKeyDown.value = data.shiftOnKeyDown;
// 		panelVertObj.shiftOnKeyHold.value = data.shiftOnKeyHold;

// 		panelVertObj.vertical.checked = data.vertical;
// 		panelVertObj.range.checked = data.range;
// 		panelVertObj.scale.checked = data.scale;
// 		panelVertObj.bar.checked = data.bar;
// 		panelVertObj.tip.checked = data.tip;
// 		panelVertObj.sticky.checked = data.sticky;

// 	}

// }).data('Slider'); // вернёт объект для одного элемента



class SliderInstance {
	panel: Panel
	slider: any
	constructor(panel: string, slider: string) {
		let panelElem = document.querySelector(panel);
		this.panel = new Panel('.panel', panelElem);

		this.slider = $(slider).Slider({
			min: -10,
			max: 100,
			from: 0,
			to: 30,
			step: 2,
			shiftOnKeyDown: 1,
			shiftOnKeyHold: 2,
			scaleBase: 'steps',
			//sticky: false,
			intervals: 10,
			vertical: true,
			range: false,
			onStart: (data: IConf) => {
				//	console.log(panelHorObj);
				this.panel.min.value = data.min;
				this.panel.max.value = data.max;
				this.panel.from.value = data.from;
				this.panel.to.value = data.to;
				this.panel.interval.value = data.intervals;
				this.panel.step.value = data.step;
				this.panel.shiftOnKeyDown.value = data.shiftOnKeyDown;
				this.panel.shiftOnKeyHold.value = data.shiftOnKeyHold;

				this.panel.vertical.checked = data.vertical;
				this.panel.range.checked = data.range;
				this.panel.scale.checked = data.scale;
				this.panel.bar.checked = data.bar;
				this.panel.tip.checked = data.tip;
				this.panel.sticky.checked = data.sticky;
				if (data.scaleBase == 'intervals') {
					this.panel.scaleBaseIntervals.checked = true;
					this.panel.step.disabled = true;
				} else {
					this.panel.scaleBaseSteps.checked = true;
					this.panel.interval.disabled = true;
				}
				this.panel.to.disabled = data.range ? false : true;

			}

		}).data('Slider'); // вернёт объект для одного элемента

		this.panel.updateMin(this.slider);
		this.panel.updateMax(this.slider);
		this.panel.updateFrom(this.slider);
		this.panel.updateTo(this.slider);
		this.panel.updateShiftOnKeyDown(this.slider);
		this.panel.updateShiftOnKeyHold(this.slider);

		this.panel.updateStep(this.slider);
		this.panel.updateInterval(this.slider);

		this.panel.selectScaleBaseSteps(this.slider);
		this.panel.selectScaleBaseIntervals(this.slider);

		this.panel.updateIsVertical(this.slider);
		this.panel.updateIsRange(this.slider);

	}
}

const Test = new SliderInstance('.panel-horizontal', '.rs__wrapper-hor');