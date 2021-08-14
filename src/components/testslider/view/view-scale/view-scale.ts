
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
	leftControl: HTMLElement;
	rightControl: HTMLElement;
	leftControlDist: number;
	rightControlDist: number;
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

	bindClickOnScale(firstEventHandler: CBControlElements,
		secondEventHandler: CBMouseEvent) {

		this.slider.addEventListener('click', (e) => {

			const target = e.target as HTMLElement;

			if (target.classList.contains('rs__slider') ||
				target.classList.contains('rs__progressBar')) {
				this.leftControl =
					this.slider.querySelector('.rs__control-min');
				this.rightControl =
					this.slider.querySelector('.rs__control-max');

				if (!this.conf.vertical) {
					console.log('horizontal');
					this.leftControlDist =
						Math.abs(this.leftControl.getBoundingClientRect().left -
							e.clientX);
					this.rightControlDist =
						Math.abs(this.rightControl.
							getBoundingClientRect().left -
							e.clientX);
				} else {
					console.log('vertical');
					this.leftControlDist =
						Math.abs(this.leftControl.getBoundingClientRect().
							bottom - e.clientY);
					this.rightControlDist = Math.abs(this.rightControl.
						getBoundingClientRect().bottom - e.clientY);
				}

				let controlData: IControlElements = {};
				if (this.rightControl.classList.contains('hidden')) {
					controlData.currentControl = this.leftControl;
					controlData.secondControl = this.rightControl;
					controlData.currentControlFlag = false;
				}

				else {//определяем ползунок, находящийся ближе к позиции клика
					this.leftControlDist <= this.rightControlDist ?
						controlData.currentControl = this.leftControl :
						controlData.currentControl = this.rightControl;
					//определяем второй ползунок
					controlData.currentControl == this.leftControl ?
						controlData.secondControl = this.rightControl :
						controlData.secondControl = this.leftControl;
					// Устанавливаем флаг, какой из ползунков (левый или правый/ верхний или нижний) ближе к позиции клика
					controlData.currentControl == this.leftControl ?
						controlData.currentControlFlag = false :
						controlData.currentControlFlag = true;
				}
				firstEventHandler(controlData);// вызов хендлера обработки события
				secondEventHandler(e);

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

	updateScaleMarks(scaleMarks: { 'pos'?: number, 'val'?: number }[],
		conf: IConf) {
		if (this.markList) {
			for (let elem of this.markList) {
				elem.remove();
			}
		}
		for (let node of scaleMarks) {
			let elem = document.createElement('div');
			elem.classList.add('rs__mark');
			let label = document.createElement('div');
			label.innerText = String(node.val);
			label.classList.add('rs__label');
			elem.appendChild(label);


			if (conf.vertical == true) {
				elem.classList.add('vertical');
				label.classList.add('vertical');
				elem.style.bottom = String(node.pos) + '%';
			} else {
				elem.classList.add('horizontal');
				label.classList.add('horizontal');
				elem.style.left = String(node.pos) + '%';
			}
			if (!conf.scale) {
				elem.classList.add('hidden');
			}
			this.scale.appendChild(elem);

			if (conf.vertical == true) {
				label.style.top = label.offsetHeight / 2 * (-1) + 'px';
			} else {
				label.style.left = label.offsetWidth / 2 * (-1) + 'px';
			}
		}

		this.markList =
			[...this.scale.querySelectorAll<HTMLElement>('.rs__mark')];
		console.log(this.markList);
		this.checkScaleMarksWidth(this.markList);
	}



	checkScaleMarksWidth(markList: HTMLElement[]) {

		//проходим циклом по элементам шагов
		for (let i = 0; i < markList.length; i++) {
			if (i < markList.length - 1) {
				let metricsCurrent = markList[i].firstElementChild.
					getBoundingClientRect();
				let metricsNext = markList[i + 1].firstElementChild.
					getBoundingClientRect();
				//если right подписи шага заходит за left подписи следующего шага
				if (metricsCurrent.left + metricsCurrent.width >
					metricsNext.left) {
					//скрываем подпись каждого второго эл-та шага, а самому эл-ту добавляем класс "no-label"
					for (let i = 1; i < markList.length; i += 2) {
						markList[i].firstElementChild.
							classList.add('hidden');
						markList[i].
							classList.add('no-label');
					}
					this.markList = //создаем новый markList из элементов, не имеющих класса "no-label" (т.е. с видимыми подписями)
						[...this.scale.
							querySelectorAll<HTMLElement>
							('.rs__mark:not(.no-label)')];
					// запускаем функцию проверки заново
					this.checkScaleMarksWidth(this.markList);
					this.lastLabelRemoved = true;
				} else {
					//this.addLastLabel(this.lastLabelRemoved);
					continue;
				}
			}
		}

		console.log('!!!!!!');


		//this.addLastLabel(this.lastLabelRemoved);
	}


	addLastLabel(isRemoved: boolean) {
		if (isRemoved) {
			let lastMark = this.scale.querySelector('.rs__mark:last-child');
			console.log(lastMark);
			let lastMarkLabeled = this.scale.
				querySelectorAll('.rs__mark:not(.no-label)');
			let test = lastMarkLabeled[lastMarkLabeled.length - 1];
			console.log(test);
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

