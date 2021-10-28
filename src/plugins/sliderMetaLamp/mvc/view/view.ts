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
	backEndConfTest: any
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
		// this.backEndConfTest = {};
		// //min
		// if (this.root.hasAttribute('data-min')) {
		// 	this.backEndConf.min = parseFloat(this.root.getAttribute('data-min'));
		// }
		// //max
		// if (this.root.hasAttribute('data-max')) {
		// 	this.backEndConf.max = parseFloat(this.root.getAttribute('data-max'));
		// }
		// //from
		// if (this.root.hasAttribute('data-from')) {
		// 	this.backEndConf.from = parseFloat(this.root.getAttribute('data-from'));
		// }
		// //to
		// if (this.root.hasAttribute('data-to')) {
		// 	this.backEndConf.to = parseFloat(this.root.getAttribute('data-to'));
		// }
		// //shiftOnKeyDown
		// if (this.root.hasAttribute('data-shiftOnKeyDown')) {
		// 	this.backEndConf.shiftOnKeyDown = parseFloat(this.root.getAttribute('data-shiftOnKeyDown'));
		// }
		// //shiftOnKeyHold
		// if (this.root.hasAttribute('data-shiftOnKeyHold')) {
		// 	this.backEndConf.shiftOnKeyHold = parseFloat(this.root.getAttribute('data-shiftOnKeyHold'));
		// }

		// //scaleBase
		// if (this.root.getAttribute('data-scaleBase')) {
		// 	this.backEndConf.scaleBase = this.root.getAttribute('data-scaleBase');
		// }

		// //step
		// if (this.root.hasAttribute('data-step')) {
		// 	this.backEndConf.step = parseFloat(this.root.getAttribute('data-step'));
		// }
		// //interval
		// if (this.root.hasAttribute('data-interval')) {
		// 	this.backEndConf.interval = parseFloat(this.root.getAttribute('data-interval'));
		// }




		// //vertical
		// if (this.root.hasAttribute('data-vertical')) {
		// 	this.backEndConf.vertical = true;
		// }

		// //range
		// if (this.root.hasAttribute('data-range')) {
		// 	this.backEndConf.range = true;
		// }

		// //bar
		// if (this.root.hasAttribute('data-bar')) {
		// 	this.backEndConf.bar = true;
		// }

		// //tip
		// if (this.root.hasAttribute('data-tip')) {
		// 	this.backEndConf.tip = true;
		// }

		// //scale
		// if (this.root.hasAttribute('data-scale')) {
		// 	this.backEndConf.scale = true;
		// }


		// //sticky
		// if (this.root.hasAttribute('data-sticky')) {
		// 	this.backEndConf.sticky = true;
		// }

		//	console.log(this.root.attributes);
		let map = new Map();
		let arr = ['min',
			'max',
			'from',
			'to',
			'step',
			'interval',
			'shiftonkeydown',
			'shiftonkeyhold',
			'scalebase',
			'vertical',
			'range',
			'sticky',
			'scale',
			'bar',
			'tip',
		];
		for (let elem of this.root.attributes) {
			let a = elem.name.replace(/^data-/, '');
			if (arr.indexOf(a) != -1) {
				map.set(a, elem.value)
			}
		}
		for (let elem of map) {
			//если значение содержит только цифры
			if (/^-?\d+\.?\d*$/.test(elem[1])) {
				map.set(elem[0], parseFloat(elem[1]))
			}
			//если значение содержит строку 'true'
			if (elem[1] == 'true') {
				map.set(elem[0], true)
			}
			//если значение содержит строку 'false'
			if (elem[1] == 'false') {
				map.set(elem[0], false)
			}
		}
		this.backEndConf = Object.fromEntries(map.entries());
	}


	$init(conf: IConf) {
		this.conf = conf;
		this.createSubViews();
		this.createListeners();//срабатывает после инициализации модели

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

	createListeners() {
		this.viewControl.subscribe(this.handleMoveEvent);
		this.viewControl.subscribe(this.handleKeydownEvent);
	}


	updateFromPos = (key: string, data: $Idata) => {
		this.viewControl.updatePos(this.viewControl.controlMin,
			data.$fromPos);

	}

	updateToPos = (key: string, data: $Idata) => {
		this.viewControl.updatePos(this.viewControl.controlMax,
			data.$toPos);
	}


	updateFromVal = (key: string, data: $Idata) => {
		this.viewControl.updateVal(data.$fromVal, true);
	}


	updateToVal = (key: string, data: $Idata) => {
		this.viewControl.updateVal(data.$toVal, false);
	}

	updateScale = (key: string, data: $Idata, conf: IConf) => {
		this.viewScale.createScale(data.$marksArr, conf);
	}

	updateBar = (key: string, data: $Idata, conf: IConf) => {
		this.viewBar.
			updateBar(data.$barPos, data.$barWidth, conf.vertical);
	}

	switchVertical = (key: string, data: $Idata, conf: IConf) => {
		if (conf.vertical) {
			this.slider.classList.add('vertical');
			this.track.classList.add('vertical');
			this.frame.classList.add('vertical');
		} else {
			this.slider.classList.remove('vertical');
			this.track.classList.remove('vertical');
			this.frame.classList.remove('vertical');
		}
		this.viewBar.switchVertical(conf);
		this.viewControl.switchVertical(conf);
	}

	switchRange = (key: string, data: $Idata, conf: IConf) => {
		this.viewControl.switchRange(conf);
	}

	switchScale = (key: string, data: $Idata, conf: IConf) => {
		this.viewScale.switchScale(conf);
	}

	switchBar = (key: string, data: $Idata, conf: IConf) => {
		this.viewBar.switchBar(conf);
	}

	switchTip = (key: string, data: $Idata, conf: IConf) => {
		this.viewControl.switchTip(conf);
	}


	handleMoveEvent = (key: string, data: $Idata) => {
		if (key !== 'MoveEvent') return;
		else {
			this.fire('MoveEvent', data);
		}
	}

	handleKeydownEvent = (key: string, data: $Idata) => {
		if (key !== 'KeydownEvent') return;
		else {
			this.fire('KeydownEvent', data);
		}
	}

}



export { sliderView };

