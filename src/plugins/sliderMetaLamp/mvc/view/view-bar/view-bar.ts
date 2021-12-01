import {
	IConf,
} from '../../interface';

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
	private init(conf: IConf) {
		this.conf = conf;
		this.renderBar(conf);
	}
	//создание бара
	private renderBar(conf: IConf) {
		this.track = this.slider.querySelector('.rs__track');
		this.progressBar = document.createElement('div');
		this.progressBar.className = 'rs__progressBar';
		this.track.append(this.progressBar);
		this.switchBar(conf);
	}

	// переключение в вертикальный режим
	public switchVertical(conf: IConf) {
		const classList = this.progressBar.classList;
		conf.vertical ? classList.add('vert') : classList.remove('vert');
	}

	// отключение / включение бара
	public switchBar(conf: IConf) {
		this.conf = conf;
		const classList = this.progressBar.classList;
		this.conf.bar ? classList.remove('hidden') : classList.add('hidden');
	}

	//обновление бара при изменении позиций ползунков
	public updateBar(pos: number, length: number, isVertical: boolean) {
		const style = this.progressBar.style;
		if (!isVertical) {
			style.left = pos + '%';
			style.width = length + '%';
			style.bottom = '';
			style.height = '';
		} else {
			style.bottom = pos + '%';
			style.height = length + '%';
			style.left = '';
			style.width = '';
		}
	}
}

export { sliderViewBar };

