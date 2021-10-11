
import {
	CBControlElements,
	CBMouseEvent,
	CBPointerEvent,
	IConf,
	IControlElements,
	$Idata
} from './../../interface';

import { Observer } from '../../observer/observer';

class sliderViewScale extends Observer {

	slider: HTMLElement;
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
	$data: $Idata;

	constructor(root: string, conf: IConf) {
		super();
		this.slider = document.querySelector(root);
		this.init(conf);
		this.$data = {};
		this.$data.$thumb = {};
		this.clickScale();
	}

	// Инициализация
	init(conf: IConf) {
		this.conf = conf;
		this.renderScale();// шкала
	}
	//создаем шкалу
	renderScale() {
		this.scale = document.createElement('div');
		this.scale.className = 'rs__slider';

		this.slider.append(this.scale);
	}

	clickScale() {

		let pointerDownHandler = (e: PointerEvent) => {

			e.preventDefault();
			const target = e.target as HTMLElement;

			if (target.classList.contains('rs__slider') ||
				target.classList.contains('rs__progressBar') ||
				target.classList.contains('rs__label') ||
				target.classList.contains('rs__mark') ||
				target.classList.contains('rs__wrapper')) {
				this.controlMin =
					this.slider.querySelector('.rs__control-min');
				this.controlMax =
					this.slider.querySelector('.rs__control-max');
				//определяем расстояние от места клика до каждого из бегунков
				if (!this.conf.vertical) {
					console.log('horizontal');
					this.controlMinDist =
						Math.abs(this.controlMin.getBoundingClientRect().left -
							e.clientX);
					this.controlMaxDist =
						Math.abs(this.controlMax.
							getBoundingClientRect().left -
							e.clientX);
				} else {
					console.log('vertical');
					this.controlMinDist =
						Math.abs(this.controlMin.getBoundingClientRect().
							bottom - e.clientY);
					this.controlMaxDist = Math.abs(this.controlMax.
						getBoundingClientRect().bottom - e.clientY);
				}


				let scale = this.controlMin.parentElement;
				this.$data.$thumb.$top = scale.getBoundingClientRect().top;
				this.$data.$thumb.$left = scale.getBoundingClientRect().left;
				this.$data.$thumb.$width = scale.offsetWidth;
				this.$data.$thumb.$height = scale.offsetHeight;
				this.$data.$thumb.$type = e.type;
				this.$data.$thumb.$clientX = e.clientX;
				this.$data.$thumb.$clientY = e.clientY;



				//определяем ползунок, находящийся ближе к позиции клика
				if (this.controlMax.classList.contains('hidden')) {//Single mode
					this.$data.$thumb.$moovingControl = 'min';
				}

				else {//Double mode
					this.controlMinDist <= this.controlMaxDist ?
						this.$data.$thumb.$moovingControl = 'min' :
						this.$data.$thumb.$moovingControl = 'max';
				}
				console.log(this.$data);

				this.fire('MoveEvent', this.$data);
			}
		};
		this.slider.addEventListener('pointerdown', pointerDownHandler);
	}




	updateScaleMode(isScale: boolean) {
		let stepMarks = this.slider.querySelectorAll('.rs__mark');
		if (isScale) {
			for (let elem of stepMarks) {
				elem.classList.remove('hidden');
			}
		} else {
			for (let elem of stepMarks) {
				elem.classList.add('hidden');
			}
		}
	}

}


export { sliderViewScale };

