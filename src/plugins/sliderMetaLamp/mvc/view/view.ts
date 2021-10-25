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

	root: HTMLElement;
	slider: HTMLElement;
	track: HTMLElement;
	frame: HTMLElement;
	conf: IConf;
	backEndConf: IConf;
	//root: string;

	constructor(root: Element, i: number) {
		super();
		/*Находим корневой элемент*/
		this.root = root as HTMLElement;
		this.slider = document.createElement('div');
		this.slider.className = 'rs__wrapper';
		this.root.after(this.slider);
		this.track = document.createElement('div');
		this.track.className = 'rs__track';
		this.slider.append(this.track);
		this.frame = document.createElement('div');
		this.frame.className = 'rs__frame';

		this.slider.append(this.frame);


		this.backEndConf = {}
		//min
		if (this.root.getAttribute('data-min')) {
			this.backEndConf.min = parseFloat(this.root.getAttribute('data-min'));
		}
		//max
		if (this.root.getAttribute('data-max')) {
			this.backEndConf.max = parseFloat(this.root.getAttribute('data-max'));
		}
		//from
		if (this.root.getAttribute('data-from')) {
			this.backEndConf.from = parseFloat(this.root.getAttribute('data-from'));
		}
		//to
		if (this.root.getAttribute('data-to')) {
			this.backEndConf.to = parseFloat(this.root.getAttribute('data-to'));
		}
		//vertical
		if (this.root.getAttribute('data-vertical') == 'true') {
			this.backEndConf.vertical = true;
		}
		if (this.root.getAttribute('data-vertical') == 'false') {
			this.backEndConf.vertical = false;
		}
		//range
		if (this.root.getAttribute('data-range') == 'true') {
			this.backEndConf.range = true;
		}
		if (this.root.getAttribute('data-range') == 'false') {
			this.backEndConf.range = false;
		}
		//bar
		if (this.root.getAttribute('data-bar') == 'true') {
			this.backEndConf.bar = true;
		}
		if (this.root.getAttribute('data-bar') == 'false') {
			this.backEndConf.bar = false;
		}
		//tip
		if (this.root.getAttribute('data-tip') == 'true') {
			this.backEndConf.tip = true;
		}
		if (this.root.getAttribute('data-tip') == 'false') {
			this.backEndConf.tip = false;
		}
		//scale
		if (this.root.getAttribute('data-scale') == 'true') {
			this.backEndConf.scale = true;
		}
		if (this.root.getAttribute('data-scale') == 'false') {
			this.backEndConf.scale = false;
		}
		//scaleBase
		if (this.root.getAttribute('data-scaleBase') == 'steps') {
			this.backEndConf.scaleBase = 'steps';
		}
		if (this.root.getAttribute('data-scaleBase') == 'interval') {
			this.backEndConf.scaleBase = 'interval';
		}
		//step
		if (this.root.getAttribute('data-step')) {
			this.backEndConf.step = parseFloat(this.root.getAttribute('data-step'));
		}
		//interval
		if (this.root.getAttribute('data-interval')) {
			this.backEndConf.interval = parseFloat(this.root.getAttribute('data-interval'));
		}
		//sticky
		if (this.root.getAttribute('data-sticky') == 'true') {
			this.backEndConf.sticky = true;
		}
		if (this.root.getAttribute('data-sticky') == 'false') {
			this.backEndConf.sticky = false;
		}

		//shiftOnKeyDown
		if (this.root.getAttribute('data-shiftOnKeyDown')) {
			this.backEndConf.shiftOnKeyDown = parseFloat(this.root.getAttribute('data-shiftOnKeyDown'));
		}
		//shiftOnKeyHold
		if (this.root.getAttribute('data-shiftOnKeyHold')) {
			this.backEndConf.shiftOnKeyHold = parseFloat(this.root.getAttribute('data-shiftOnKeyHold'));
		}

	}
	$init(conf: IConf) {
		//	console.log(conf);

		this.conf = conf;
		this.createSubViews();
		this.$createListeners();//срабатывает после инициализации модели

		if (conf.vertical) {
			this.slider.classList.add('vertical');
			this.track.classList.add('vertical');
			this.frame.classList.add('vertical');
		} else {
			this.slider.classList.remove('vertical');
			this.track.classList.remove('vertical');
			this.frame.classList.remove('vertical');
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
		//	console.log('$handleFromPosition');

		this.viewControl.updateControlPos(this.viewControl.controlMin,
			data.$fromPos);

	}

	$handleToPosition = (key: string, data: $Idata) => {
		//	console.log('$handleToPosition');
		this.viewControl.updateControlPos(this.viewControl.controlMax,
			data.$toPos);
	}


	$handleFromValue = (key: string, data: $Idata) => {
		this.viewControl.updateTipVal(data.$fromVal, true);
	}


	$handleToValue = (key: string, data: $Idata) => {
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
			this.frame.classList.add('vertical');
		} else {
			this.slider.classList.remove('vertical');
			this.track.classList.remove('vertical');
			this.frame.classList.remove('vertical');
		}
		this.viewBar.$switchVertical(conf);
		this.viewControl.$switchVertical(conf);
	}

	$handleIsRange = (key: string, data: $Idata, conf: IConf) => {
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

