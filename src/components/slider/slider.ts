import './slider.scss';
import { Panel } from './../panel/panel';
import {
	IConf,
	$Idata
} from './../../plugins/slider/interface';
const panelHor = document.querySelector('.panel-horizontal');
const panelHorObj = new Panel('.panel', panelHor);
const sliderHorObj = $('.rs__wrapper-hor').Slider({
	min: -10,
	max: 100,
	from: 0,
	to: 70,
	step: 2,
	shiftOnKeyDown: 1,
	shiftOnKeyHold: 2,
	sticky: false,
	//intervals: 26,
	//vertical: true,
	//range: false
	onStart: (data: IConf) => {
		//	console.log(panelHorObj);
		panelHorObj.min.value = data.min;
		panelHorObj.max.value = data.max;
		panelHorObj.from.value = data.from;
		panelHorObj.to.value = data.to;
		panelHorObj.interval.value = data.intervals;
		panelHorObj.step.value = data.step;
		panelHorObj.shiftOnKeyDown.value = data.shiftOnKeyDown;
		panelHorObj.shiftOnKeyHold.value = data.shiftOnKeyHold;

		panelHorObj.vertical.checked = data.vertical;
		panelHorObj.range.checked = data.range;
		panelHorObj.scale.checked = data.scale;
		panelHorObj.bar.checked = data.bar;
		panelHorObj.tip.checked = data.tip;
		panelHorObj.sticky.checked = data.sticky;

	}

}).data('Slider'); // вернёт объект для одного элемента


const panelVert = document.querySelector('.panel-vertical');
const panelVertObj = new Panel('.panel', panelVert);
const sliderVertObj = $('.rs__wrapper-vert').Slider({
	min: 0,
	max: 90,
	from: 10,
	to: 80,
	step: 2,
	shiftOnKeyDown: 1,
	shiftOnKeyHold: 2,
	sticky: false,
	//intervals: 26,
	vertical: true,
	//range: false
	onStart: (data: IConf) => {

		panelVertObj.min.value = data.min;
		panelVertObj.max.value = data.max;
		panelVertObj.from.value = data.from;
		panelVertObj.to.value = data.to;
		panelVertObj.interval.value = data.intervals;
		panelVertObj.step.value = data.step;
		panelVertObj.shiftOnKeyDown.value = data.shiftOnKeyDown;
		panelVertObj.shiftOnKeyHold.value = data.shiftOnKeyHold;

	}

}).data('Slider'); // вернёт объект для одного элемента



//console.log(sliderHor);
//obj.testAPI();
//obj.update({ from: -10, min: -20 });

