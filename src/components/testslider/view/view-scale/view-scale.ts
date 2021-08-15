
import { ModuleBody } from 'typescript';
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



class sliderViewScale extends sliderView {

	scale: HTMLElement;
	elem: HTMLElement;
	scaleWidth: number;
	scaleHeight: number;
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

	//markList: NodeList;



	constructor(root: string) {
		super(root);
	}

	// Инициализация
	init(conf: IConf) {
		this.conf = conf;
		this.renderScale(conf);// шкала
	}
	//создаем шкалу
	renderScale(conf: IConf) {
		this.scale = document.createElement('div');
		this.scale.className = 'rs__slider';
		this.slider.append(this.scale);
		this.scaleWidth = this.scale.offsetWidth;
		this.scaleHeight = this.scale.offsetHeight;

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


	//Вешаем обработчик клика по шкале

	bindClickOnScale(getControlData: CBControlElements,
		computeControlPos: CBMouseEvent) {

		this.slider.addEventListener('click', (e) => {

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
				if (this.controlMax.classList.contains('hidden')) {
					controlData.currentControl = this.controlMin;
					controlData.secondControl = this.controlMax;
					controlData.currentControlFlag = false;
				}

				else {//определяем ползунок, находящийся ближе к позиции клика
					this.controlMinDist <= this.controlMaxDist ?
						controlData.currentControl = this.controlMin :
						controlData.currentControl = this.controlMax;
					//определяем второй ползунок
					controlData.currentControl == this.controlMin ?
						controlData.secondControl = this.controlMax :
						controlData.secondControl = this.controlMin;
					// Устанавливаем флаг, какой из ползунков (левый или правый/ верхний или нижний) ближе к позиции клика
					controlData.currentControl == this.controlMin ?
						controlData.currentControlFlag = false :
						controlData.currentControlFlag = true;
				}
				getControlData(controlData);// вызов хендлера обработки события
				computeControlPos(e);

			}
		});
	}

	/*красим Progress Bar (вызывается из контроллера)*/
	updateProgressBar(pos: string, length: string, conf: IConf) {
		if (!conf.vertical) {
			this.progressBar.style.left = pos;
			this.progressBar.style.width = length;
		} else {
			this.progressBar.style.bottom = pos;
			this.progressBar.style.height = length;
		}
	}

	updateScaleMode(isScale: boolean) {
		if (isScale) {
			for (let elem of this.markList) {
				elem.classList.remove('hidden');
			}
		} else {
			for (let elem of this.markList) {
				elem.classList.add('hidden');
			}
		}
	}
	updateBarMode(isBar: boolean) {
		isBar ? this.progressBar.classList.remove('hidden') :
			this.progressBar.classList.add('hidden');
	}
}


export { sliderViewScale };

