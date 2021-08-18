
import { sliderView } from './../../view/view';

import {
	CBControlElements,
	CBMouseEvent,
	CBPointerEvent,
	IConf,
	IControlElements,
} from './../../interface';



class sliderViewScale extends sliderView {

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
		this.renderScale();// шкала
	}
	//создаем шкалу
	renderScale() {
		this.scale = document.createElement('div');
		this.scale.className = 'rs__slider';

		this.slider.append(this.scale);
	}


	//Вешаем обработчик клика по шкале

	bindClickOnScale(getControlData: CBControlElements,
		computeControlPos: CBPointerEvent) {

		this.slider.addEventListener('pointerdown', (e) => {

			const target = e.target as HTMLElement;

			if (target.classList.contains('rs__slider') ||
				target.classList.contains('rs__progressBar')) {
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

				let controlData: IControlElements = {};
				//определяем ползунок, находящийся ближе к позиции клика
				if (this.controlMax.classList.contains('hidden')) {//Single mode
					controlData.currentControlElem = this.controlMin;
				}

				else {//Double mode
					this.controlMinDist <= this.controlMaxDist ?
						controlData.currentControlElem = this.controlMin :
						controlData.currentControlElem = this.controlMax;
				}
				getControlData(controlData);// вызов хендлера обработки события
				computeControlPos(e);

			}
		});
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

