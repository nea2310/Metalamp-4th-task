import { sliderViewControl } from
	'./../view/view-control/view-control';
import { sliderViewScale } from './../view/view-scale/view-scale';
import { sliderViewBar } from './../view/view-bar/view-bar';
import { Idata, IConf } from '../interface';
import { Observer } from '../observer';


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

	constructor(root: Element, i: number) {
		super();
		/*Находим корневой элемент*/
		this.root = root as HTMLElement;
		this.render();
		this.collectParms();
	}
	render() {
		this.slider = document.createElement('div');
		this.slider.className = 'rs__wrapper';
		this.root.after(this.slider);
		this.track = document.createElement('div');


		this.track.className = 'rs__track';
		this.slider.append(this.track);
		this.frame = document.createElement('div');
		this.frame.className = 'rs__frame';
		this.slider.append(this.frame);
		this.getHeight();
		setTimeout(this.getHeight, 3000)
		//console.log(this.track.offsetHeight);
	}

	getHeight = () => {
		console.log(this.track.offsetHeight);
	}

	collectParms() {

		this.backEndConf = {}
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
			//перевод ключей в camelCase
			if (elem[0] == 'shiftonkeydown') {
				map.set('shiftOnKeyDown', elem[1]);
				map.delete(elem[0]);
			}
			if (elem[0] == 'shiftonkeyhold') {
				map.set('shiftOnKeyHold', elem[1]);
				map.delete(elem[0]);
			}
			if (elem[0] == 'scalebase') {
				map.set('scaleBase', elem[1]);
				map.delete(elem[0]);
			}
		}
		this.backEndConf = Object.fromEntries(map.entries());
	}

	init(conf: IConf) {
		this.conf = conf;


		// let createSubViews = this.createSubViews.bind(this);
		// let createListeners = this.createListeners.bind(this);
		// let switchVertical = this.switchVertical.bind(this);
		// setTimeout(createSubViews, 100); //нужна задержка, т.к. иначе  ширина offsetWidth берется у не успевшего построиться элемента
		// setTimeout(createListeners, 200); //нужна задержка, т.к. иначе  ширина offsetWidth берется у не успевшего построиться элемента
		// setTimeout(switchVertical, 200, conf); //нужна задержка, т.к. иначе  ширина offsetWidth берется у не успевшего построиться элемента

		this.createSubViews();
		this.createListeners();//срабатывает после инициализации модели
		this.switchVertical(conf);
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

	updateFromPos = (data: Idata) => {
		this.viewControl.updatePos(this.viewControl.controlMin,
			data.fromPos);
	}

	updateToPos = (data: Idata) => {
		this.viewControl.updatePos(this.viewControl.controlMax,
			data.toPos);
	}

	updateFromVal = (data: Idata) => {
		this.viewControl.updateVal(data.fromVal, true);
	}

	updateToVal = (data: Idata) => {
		this.viewControl.updateVal(data.toVal, false);
	}

	updateScale = (data: Idata, conf: IConf) => {
		let calcScale = this.viewScale.createScale.bind(this.viewScale);
		setTimeout(calcScale, 100, data.marksArr, conf); //нужна задержка, т.к. иначе в view ширина offsetWidth берется у не успевшего перестроиться элемента
	}

	updateBar = (data: Idata, conf: IConf) => {
		this.viewBar.
			updateBar(data.barPos, data.barWidth, conf.vertical);
	}

	switchVertical = (conf: IConf) => {
		if (conf.vertical) {
			this.slider.classList.add('vert');
			this.track.classList.add('vert');
			this.frame.classList.add('vert');
		} else {
			this.slider.classList.remove('vert');
			this.track.classList.remove('vert');
			this.frame.classList.remove('vert');
		}
		this.viewBar.switchVertical(conf);
		this.viewControl.switchVertical(conf);
	}

	switchRange = (conf: IConf) => {
		this.viewControl.switchRange(conf);
	}

	switchScale = (conf: IConf) => {
		this.viewScale.switchScale(conf);
	}

	switchBar = (conf: IConf) => {
		this.viewBar.switchBar(conf);
	}

	switchTip = (conf: IConf) => {
		this.viewControl.switchTip(conf);
	}

	handleMoveEvent = (key: string, data: Idata) => {
		if (key !== 'MoveEvent') return;
		else {
			this.fire('MoveEvent', data);
		}
	}

	handleKeydownEvent = (key: string, data: Idata) => {
		if (key !== 'KeydownEvent') return;
		else {
			this.fire('KeydownEvent', data);
		}
	}
}

export { sliderView };

