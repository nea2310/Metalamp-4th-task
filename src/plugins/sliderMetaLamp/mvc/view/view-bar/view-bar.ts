import {
	IConf,
} from '../../../interface';



class sliderViewBar {
	slider: HTMLElement;
	track: HTMLElement;
	elem: HTMLElement;
	progressBar: HTMLElement;
	controlMin: HTMLElement;
	controlMax: HTMLElement;
	controlMinDist: number;
	controlMaxDist: number;
	markList: HTMLElement[];
	conf: IConf;
	scale: HTMLElement;
	checkNext: boolean;
	lastLabelRemoved: boolean;

	constructor(root: HTMLElement, conf: IConf) {
		this.slider = root;
		this.init(conf);
	}

	// Инициализация
	init(conf: IConf) {
		this.conf = conf;
		this.renderBar(conf);// шкала
	}
	//создаем бар
	renderBar(conf: IConf) {
		this.track = this.slider.querySelector('.rs__track');
		this.progressBar = document.createElement('div');
		this.progressBar.className = 'rs__progressBar';
		this.track.append(this.progressBar);
		if (!conf.bar) {
			this.progressBar.classList.add('hidden');
		}

		if (conf.vertical) {
			this.progressBar.classList.add('vert');
		} else {
			this.progressBar.classList.remove('vert');
		}
	}

	switchVertical(conf: IConf) {
		if (conf.vertical) {
			this.progressBar.classList.add('vert');
		} else {
			this.progressBar.classList.remove('vert');
		}
	}

	updateBar(pos: number, length: number, isVertical: boolean) {

		if (!isVertical) {
			this.progressBar.style.left = pos + '%';
			this.progressBar.style.width = length + '%';
			this.progressBar.style.bottom = '';
			this.progressBar.style.height = '';
		} else {
			this.progressBar.style.bottom = pos + '%';
			this.progressBar.style.height = length + '%';
			this.progressBar.style.left = '';
			this.progressBar.style.width = '';
		}
	}

	switchBar(conf: IConf) {
		this.conf = conf;
		this.conf.bar ? this.progressBar.classList.remove('hidden') :
			this.progressBar.classList.add('hidden');
	}
}


export { sliderViewBar };

