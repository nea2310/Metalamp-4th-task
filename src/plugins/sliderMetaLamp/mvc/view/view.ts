import { sliderViewControl } from
	'./../view/view-control/view-control';
import { sliderViewScale } from './../view/view-scale/view-scale';
import { sliderViewBar } from './../view/view-bar/view-bar';
import { Idata, IConf } from '../interface';
import { Observer } from '../observer';


class sliderView extends Observer {
	public viewControl: sliderViewControl;
	public viewScale: sliderViewScale;
	public viewBar: sliderViewBar;

	private root: HTMLElement;
	public slider: HTMLElement;
	private track: HTMLElement;
	private frame: HTMLElement;
	private conf: IConf;
	public backEndConf: IConf;



	constructor(root: Element, i: number) {
		super();
		/*Находим корневой элемент*/
		this.root = root as HTMLElement;
		this.render();
		this.collectParms();

	}
	private render() {
		this.slider = document.createElement('div');
		this.slider.className = 'rs-metalamp__wrapper';
		this.root.after(this.slider);
		this.track = document.createElement('div');


		this.track.className = 'rs-metalamp__track';
		this.slider.append(this.track);
		this.frame = document.createElement('div');
		this.frame.className = 'rs-metalamp__frame';
		this.slider.append(this.frame);
	}

	private collectParms() {

		this.backEndConf = {};
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
				map.set(a, elem.value);
			}
		}
		for (let elem of map) {
			//если значение содержит только цифры
			if (/^-?\d+\.?\d*$/.test(elem[1])) {
				map.set(elem[0], parseFloat(elem[1]));
			}
			//если значение содержит строку 'true'
			if (elem[1] == 'true') {
				map.set(elem[0], true);
			}
			//если значение содержит строку 'false'
			if (elem[1] == 'false') {
				map.set(elem[0], false);
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

	public init(conf: IConf) {
		this.conf = conf;
		this.createSubViews();
		this.createListeners();//срабатывает после инициализации модели
		this.switchVertical(conf);
	}

	private createSubViews() {
		this.viewControl = new sliderViewControl(this.slider, this.conf);
		this.viewScale =
			new sliderViewScale(this.slider, this.track, this.conf);
		this.viewBar = new sliderViewBar(this.slider, this.conf);
	}

	private createListeners() {
		this.viewControl.subscribe(this.handleMoveEvent);
		this.viewControl.subscribe(this.handleKeydownEvent);
	}

	public updateFromPos = (data: Idata, conf: IConf) => {
		this.viewControl.updatePos(this.viewControl.controlMin,
			data.fromPos);
		this.viewControl.updateInput(conf);
	}

	public updateToPos = (data: Idata, conf: IConf) => {
		this.viewControl.updatePos(this.viewControl.controlMax,
			data.toPos);
		this.viewControl.updateInput(conf);
	}

	public updateFromVal = (data: Idata) => {
		this.viewControl.updateVal(data.fromVal, true);
	}

	public updateToVal = (data: Idata) => {
		this.viewControl.updateVal(data.toVal, false);
	}

	public updateScale = (data: Idata, conf: IConf) => {
		this.viewScale.createScale(data.marksArr, conf);

	}

	public updateBar = (data: Idata, conf: IConf) => {
		this.viewBar.
			updateBar(data.barPos, data.barWidth, conf.vertical);
	}

	public switchVertical = (conf: IConf) => {
		if (conf.vertical) {
			this.slider.classList.add('rs-metalamp__wrapper_vert');
			this.track.classList.add('rs-metalamp__track_vert');
			this.frame.classList.add('rs-metalamp__frame_vert');
		} else {
			this.slider.classList.remove('rs-metalamp__wrapper_vert');
			this.track.classList.remove('rs-metalamp__track_vert');
			this.frame.classList.remove('rs-metalamp__frame_vert');
		}
		this.viewBar.switchVertical(conf);
		this.viewControl.switchVertical(conf);
	}

	public switchRange = (conf: IConf) => {
		this.viewControl.switchRange(conf);
	}

	public switchScale = (conf: IConf) => {
		this.viewScale.switchScale(conf);
	}

	public switchBar = (conf: IConf) => {
		this.viewBar.switchBar(conf);
	}

	public switchTip = (conf: IConf) => {
		this.viewControl.switchTip(conf);
	}

	private handleMoveEvent = (key: string, data: Idata) => {
		if (key !== 'MoveEvent') return;
		else {
			this.fire('MoveEvent', data);
		}
	}

	private handleKeydownEvent = (key: string, data: Idata) => {
		if (key !== 'KeydownEvent') return;
		else {
			this.fire('KeydownEvent', data);
		}
	}
}

export { sliderView };

