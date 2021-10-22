import { sliderViewControl } from
	'./../view/view-control/view-control';
import { sliderViewScale } from './../view/view-scale/view-scale';
import { sliderViewBar } from './../view/view-bar/view-bar';
import {
	$Idata, IConf
} from '../../interface';

import { Observer } from '../../observer';


class sliderView extends Observer {
	viewControl: sliderViewControl;
	viewScale: sliderViewScale;
	viewBar: sliderViewBar;

	slider: HTMLElement;
	track: HTMLElement;
	input: HTMLInputElement;
	conf: IConf;
	backEndConf: IConf;
	//root: string;

	constructor(root: Element, i: number) {
		super();
		/*Находим корневой элемент*/
		this.slider = root as HTMLElement;
		this.track = document.createElement('div');
		this.track.className = 'rs__track';
		this.slider.append(this.track);
		this.input = document.createElement('input');
		this.input.className = 'rs__input';

		this.slider.append(this.input);


		this.backEndConf = {}
		//min
		if (this.slider.getAttribute('data-min')) {
			this.backEndConf.min = parseFloat(this.slider.getAttribute('data-min'));
		}
		//max
		if (this.slider.getAttribute('data-max')) {
			this.backEndConf.max = parseFloat(this.slider.getAttribute('data-max'));
		}
		//from
		if (this.slider.getAttribute('data-from')) {
			this.backEndConf.from = parseFloat(this.slider.getAttribute('data-from'));
		}
		//to
		if (this.slider.getAttribute('data-to')) {
			this.backEndConf.to = parseFloat(this.slider.getAttribute('data-to'));
		}
		//vertical
		if (this.slider.getAttribute('data-vertical') == 'true') {
			this.backEndConf.vertical = true;
		}
		if (this.slider.getAttribute('data-vertical') == 'false') {
			this.backEndConf.vertical = false;
		}
		//range
		if (this.slider.getAttribute('data-range') == 'true') {
			this.backEndConf.range = true;
		}
		if (this.slider.getAttribute('data-range') == 'false') {
			this.backEndConf.range = false;
		}
		//bar
		if (this.slider.getAttribute('data-bar') == 'true') {
			this.backEndConf.bar = true;
		}
		if (this.slider.getAttribute('data-bar') == 'false') {
			this.backEndConf.bar = false;
		}
		//tip
		if (this.slider.getAttribute('data-tip') == 'true') {
			this.backEndConf.tip = true;
		}
		if (this.slider.getAttribute('data-tip') == 'false') {
			this.backEndConf.tip = false;
		}
		//scale
		if (this.slider.getAttribute('data-scale') == 'true') {
			this.backEndConf.scale = true;
		}
		if (this.slider.getAttribute('data-scale') == 'false') {
			this.backEndConf.scale = false;
		}
		//scaleBase
		if (this.slider.getAttribute('data-scaleBase') == 'steps') {
			this.backEndConf.scaleBase = 'steps';
		}
		if (this.slider.getAttribute('data-scaleBase') == 'intervals') {
			this.backEndConf.scaleBase = 'intervals';
		}
		//step
		if (this.slider.getAttribute('data-step')) {
			this.backEndConf.step = parseFloat(this.slider.getAttribute('data-step'));
		}
		//intervals
		if (this.slider.getAttribute('data-intervals')) {
			this.backEndConf.intervals = parseFloat(this.slider.getAttribute('data-intervals'));
		}
		//sticky
		if (this.slider.getAttribute('data-sticky') == 'true') {
			this.backEndConf.sticky = true;
		}
		if (this.slider.getAttribute('data-sticky') == 'false') {
			this.backEndConf.sticky = false;
		}

		//shiftOnKeyDown
		if (this.slider.getAttribute('data-shiftOnKeyDown')) {
			this.backEndConf.shiftOnKeyDown = parseFloat(this.slider.getAttribute('data-shiftOnKeyDown'));
		}
		//shiftOnKeyHold
		if (this.slider.getAttribute('data-shiftOnKeyHold')) {
			this.backEndConf.shiftOnKeyHold = parseFloat(this.slider.getAttribute('data-shiftOnKeyHold'));
		}

	}
	$init(conf: IConf) {
		//	console.log(conf);

		this.conf = conf;
		this.createSubViews();
		this.$createListeners();//срабатывает после инициализации модели
		this.input.value = this.conf.from + ', ' + this.conf.to;
		//	console.log(this.input.value);

		if (conf.vertical) {
			this.slider.classList.add('vertical');
			this.track.classList.add('vertical');
			this.input.classList.add('vertical');
		} else {
			this.slider.classList.remove('vertical');
			this.track.classList.remove('vertical');
			this.input.classList.remove('vertical');
		}
	}


	createSubViews() {
		this.viewControl = new sliderViewControl(this.slider, this.conf);
		this.viewScale = new sliderViewScale(this.slider, this.conf);
		this.viewBar = new sliderViewBar(this.slider, this.conf);

	}

	$createListeners() {
		this.viewControl.subscribe(this.$handleMoveEvent);
		this.viewControl.subscribe(this.$handleKeydownEvent);
	}


	$handleFromPosition = (key: string, data: $Idata) => {
		this.viewControl.updateControlPos(this.viewControl.controlMin,
			data.$fromPos);

	}

	$handleToPosition = (key: string, data: $Idata) => {
		this.viewControl.updateControlPos(this.viewControl.controlMax,
			data.$toPos);
	}


	$handleFromValue = (key: string, data: $Idata) => {
		this.viewControl.updateTipVal(data.$fromVal, true);
	}


	$handleToValue = (key: string, data: $Idata) => {
		//this.viewPanel.updateFromTo('to', data.$toVal);
		this.viewControl.updateTipVal(data.$toVal, false);
	}

	$handleScale = (key: string, data: $Idata, conf: IConf) => {
		this.viewScale.createScale(data.$marksArr, conf);
	}

	$handleBar = (key: string, data: $Idata, conf: IConf) => {
		this.viewBar.
			$updateBar(data.$barPos, data.$barWidth, conf.vertical);
	}

	$handleIsVertical = (key: string, data: $Idata, conf: IConf) => {
		if (conf.vertical) {
			this.slider.classList.add('vertical');
			this.track.classList.add('vertical');
			this.input.classList.add('vertical');
		} else {
			this.slider.classList.remove('vertical');
			this.track.classList.remove('vertical');
			this.input.classList.remove('vertical');
		}
		this.viewBar.$switchVertical(conf);
		this.viewControl.$switchVertical(conf);
	}

	$handleIsRange = (key: string, data: $Idata, conf: IConf) => {

		//this.viewBar.$updateBar(data.$barPos, data.$barWidth, conf.vertical);
		this.viewControl.$switchRange(conf);
	}

	$handleIsScale = (key: string, data: $Idata, conf: IConf) => {
		this.viewScale.$switchScale(conf);
	}

	$handleIsBar = (key: string, data: $Idata, conf: IConf) => {
		this.viewBar.$switchBar(conf);
	}

	$handleIsTip = (key: string, data: $Idata, conf: IConf) => {
		this.viewControl.$switchTip(conf);
	}


	$handleMoveEvent = (key: string, data: $Idata) => {
		if (key !== 'MoveEvent') return;
		else {
			this.fire('MoveEvent', data);
		}
	}

	$handleKeydownEvent = (key: string, data: $Idata) => {
		if (key !== 'KeydownEvent') return;
		else {
			this.fire('KeydownEvent', data);
		}
	}

}



export { sliderView };

