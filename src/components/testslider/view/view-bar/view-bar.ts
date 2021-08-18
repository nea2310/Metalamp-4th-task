import { sliderView } from './../../view/view';

import {
	CBNoArgs,
	CBControlElements,
	CBMouseEvent,
	CBPointerEvent,
	CBEvent,
	CBStringEvent,
	CBStringPointerEvent,
	CBInputEvent,
	CBStringInputEvent,
	ControlPosUpdated,
	ProgressBarUpdated,
	ControlValueUpdated,
	IConf,
	IControlElements,
	IScaleLabels
} from './../../interface';



class sliderViewBar extends sliderView {

	scale: HTMLElement;
	elem: HTMLElement;
	progressBar: HTMLElement;
	controlMin: HTMLElement;
	controlMax: HTMLElement;
	controlMinDist: number;
	controlMaxDist: number;
	markList: HTMLElement[];
	conf: IConf;
	grid: HTMLElement;
	checkNext: boolean;
	lastLabelRemoved: boolean;

	constructor(root: string) {
		super(root);
	}

	// Инициализация
	init(conf: IConf) {
		this.conf = conf;
		this.renderBar(conf);// шкала
	}
	//создаем шкалу
	renderBar(conf: IConf) {
		this.scale = this.slider.querySelector('.rs__slider');
		//создаем progress bar
		this.progressBar = document.createElement('div');
		this.progressBar.className = 'rs__progressBar';
		this.scale.append(this.progressBar);
		if (!conf.bar) {
			this.progressBar.classList.add('hidden');
		}


		if (conf.vertical) {
			this.slider.classList.add('vertical');
			this.scale.classList.add('vertical');
			this.progressBar.classList.add('vertical');
		} else {
			this.slider.classList.remove('vertical');
			this.scale.classList.remove('vertical');
			this.progressBar.classList.remove('vertical');
		}
	}




	/*красим Progress Bar (вызывается из контроллера)*/
	updateProgressBar(pos: string, length: string, isVertical: boolean) {
		if (!isVertical) {
			this.progressBar.style.left = pos;
			this.progressBar.style.width = length;
		} else {
			this.progressBar.style.bottom = pos;
			this.progressBar.style.height = length;
		}
	}


	updateBarMode(isBar: boolean) {
		isBar ? this.progressBar.classList.remove('hidden') :
			this.progressBar.classList.add('hidden');
	}
}


export { sliderViewBar };

