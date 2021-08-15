
import { ModuleBody } from 'typescript';

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
	IObj
} from './../interface';


class sliderModel {
	conf: IConf;
	slider: HTMLElement;
	controlMin: HTMLElement;
	controlMax: HTMLElement;
	scale: HTMLElement;
	scaleWidth: number;
	scaleHeight: number;
	shift: number;
	length: number;
	minRangeVal: number;
	maxRangeVal: number;
	leftControlStartVal: number;
	rightControlStartVal: number;
	leftControlStartPos: number;
	rightControlStartPos: number;
	progressBarStartPos: number;
	progressBarStartWidth: number;
	stepLength: number;
	text: number;
	marksArr: { 'pos'?: number, 'val'?: number }[];
	currentControl: HTMLElement;
	secondControl: HTMLElement;
	parentElement: HTMLElement;
	currentControlFlag: boolean;
	newPos: number;
	changeMode: boolean;
	switchToSingleMode: boolean;
	switchToDoubleMode: boolean;
	switchToVerticalMode: boolean;
	switchToHorizontalMode: boolean;
	pos: number;
	edge: number;
	secondControlPos: number;
	parentPos: number;
	newValue: string;
	selectedWidth: string;
	selectedPos: string;
	moovingControl: string;
	сontrolPosUpdated: (arg1: HTMLElement, arg2: number) => void;
	progressBarUpdated: (arg1: string, arg2: string, arg3: IConf) => void;
	сontrolValueUpdated: (arg1: HTMLElement, arg2: string) => void;




	/*Инициализация. Получаем элемент ползунка, определяем расположение ползунков и прогресс-бара в момент создания слайдера */

	init(conf: IConf): void {
		this.conf = conf;
		this.slider = document.querySelector(conf.target);
		this.controlMin = this.slider.querySelector('.rs__control-min');
		this.controlMax = this.slider.querySelector('.rs__control-max');

		this.scale = this.slider.querySelector('.rs__slider');
		this.scaleWidth = this.scale.offsetWidth;
		this.scaleHeight = this.scale.offsetHeight; //!

		if (this.conf.vertical == true) {
			this.shift = (this.controlMin.offsetHeight) / 2;
			this.length = this.scaleHeight;
		} else {
			this.shift = (this.controlMin.offsetWidth) / 2;
			this.length = this.scaleWidth;
		}



		this.minRangeVal = conf.min;//минимальное значение диапазон
		this.maxRangeVal = conf.max;//максимальное значение диапазона

		this.leftControlStartVal = conf.from;
		this.rightControlStartVal = conf.to;

		this.leftControlStartPos =
			this.computeControlPosFromVal(this.leftControlStartVal, true, null);// начальное положение левого ползунка на шкале
		this.rightControlStartPos =
			this.computeControlPosFromVal(this.rightControlStartVal,
				true, null);// начальное положение правого ползунка на шкале


		if (this.conf.vertical == true) {
			if (this.conf.range == true) {
				this.progressBarStartPos = this.leftControlStartPos; // начальная позиция прогресс-бара
				this.progressBarStartWidth =
					this.rightControlStartPos - this.leftControlStartPos; // начальная ширина прогресс-бара
			} else {
				this.progressBarStartPos = 0; // начальная позиция прогресс-бара
				this.progressBarStartWidth = this.leftControlStartPos; // начальная ширина прогресс-бара
			}
		} else {
			if (this.conf.range == true) {
				this.progressBarStartPos = this.leftControlStartPos; // начальная позиция прогресс-бара
				this.progressBarStartWidth =
					this.rightControlStartPos - this.leftControlStartPos; // начальная ширина прогресс-бара
			} else {
				this.progressBarStartPos = 0; // начальная позиция прогресс-бара
				this.progressBarStartWidth = this.leftControlStartPos; // начальная ширина прогресс-бара
			}
		}

		this.computeGrid(this.conf);

	}

	//Получаем и сохраняем в объекте модели данные о перемещаемом ползунке (при перетягивании ползунка или клике по шкале)
	getControlData(controlData: IControlElements) {
		this.currentControl = controlData.currentControl; // ползунок, за который тянут
		this.secondControl = controlData.secondControl; // второй ползунок
		this.parentElement = this.currentControl.parentElement;
		this.currentControlFlag = controlData.currentControlFlag;
		this.moovingControl = controlData.moovingControl;
		this.shift = controlData.shift;
	}
	//находим value и позиции left шагов, если задана ширина шага (step) или кол-во интервалов, на которое делится шкала (intervals)
	computeGrid(conf: IConf): { 'val'?: number, 'pos'?: number }[] {
		let stepAmount;
		if (this.conf.step) {//если задана ширина (кол-во единиц) шага (step)
			stepAmount = (conf.max - conf.min) / conf.step; // находим кол-во шагов
		}

		else if (this.conf.intervals) {//если задано кол-во интервалов шкалы
			conf.step = (conf.max - conf.min) / conf.intervals;// находим ширину (кол-во единиц) в шаге
			stepAmount = conf.intervals; // находим кол-во шагов
		}

		this.marksArr = [{ val: conf.min, pos: 0 }]; //первое деление всегда стоит на позиции left = 0% и его значение равно conf.min
		let val = conf.min;
		for (let i = 0; i < stepAmount; i++) {
			let obj: IObj = {};
			val += conf.step;
			if (val <= conf.max) {
				let pos = ((val - conf.min) * 100) /
					(conf.max - conf.min);

				obj.val = val;
				obj.pos = pos;
				this.marksArr.push(obj);
			}
		}
		if (this.marksArr[this.marksArr.length - 1].val < conf.max) { // если длина шкалы не кратна длине шага
			this.marksArr.push({ val: conf.max, pos: 100 });//последнее деление ставим на позицию left = 100% и его значение равно conf.max
		}
		return this.marksArr;
	}



	//Рассчитываем положение ползунка на основании значения, введенного в панели конфигурирования или в объекте конфигурации
	computeControlPosFromVal(val: number,
		isInitialRendering: boolean = true, control: HTMLElement): number {

		if (val != this.minRangeVal) {
			if (this.conf.vertical) {
				this.newPos = ((val - this.minRangeVal) * 100) /
					(this.maxRangeVal - this.minRangeVal);


			} else {
				this.newPos = ((val - this.minRangeVal) * 100) /
					(this.maxRangeVal - this.minRangeVal);
			}
		}
		else {
			this.newPos = 0.00001; // начальное положение левого ползунка на шкале
			this.newPos = 0.00001;
		}

		if (isInitialRendering) {
			return this.newPos;
		}
		if (!isInitialRendering) {


			if (this.conf.vertical == true) {
				if (control.classList.contains('rs__control-min')) {
					this.secondControl = this.controlMax;
					this.currentControlFlag = false;
				} else {
					this.secondControl = this.controlMin;
					this.currentControlFlag = true;
				}
			} else {
				if (control.classList.contains('rs__control-min')) {
					this.secondControl = this.controlMax;
					this.currentControlFlag = false;
				} else {
					this.secondControl = this.controlMin;
					this.currentControlFlag = true;
				}
			}
			this.сontrolPosUpdated(control, this.newPos);
			this.getControlData({
				currentControl: control,
				secondControl: this.secondControl,
				currentControlFlag: this.currentControlFlag
			});
			this.computeProgressBar();
		}

	}




	//Рассчитываем положение ползунка при возникновении события перетягивания ползунка или щелчка по шкале
	computeControlPosFromEvent(e: MouseEvent | Event): void {
		/*Определяем положение мыши в зависимости от устройства*/
		/*На мобильных устройствах может фиксироваться несколько точек касания, поэтому используется массив targetTouches*/
		/*Мы будем брать только первое зафиксированое касание по экрану targetTouches[0]*/

		//const target = e.target as HTMLElement;
		//	const touch = e.touches


		if (e instanceof Event && e.type == 'change') {//если переключили чекбокс на панели конфигурации (например смена режима Double -> Single)
		}

		else if (e instanceof MouseEvent &&
			(e.type == 'click' || e.type == 'mousemove')) {//если потянули ползунок или кликнули по шкале

			if (this.conf.vertical) {
				this.newPos = 100 -
					((e.clientY -
						this.parentElement.getBoundingClientRect().top) * 100 /
						(this.parentElement.offsetHeight));

			} else {
				let shift = 0;
				if (e.type == 'mousemove') {
					shift = (this.shift * 100)
						/ (this.parentElement.offsetWidth);
				}

				this.newPos =
					((e.clientX -
						this.parentElement.getBoundingClientRect().left) * 100 /
						(this.parentElement.offsetWidth)) - shift;
			}
			//запрещаем ползункам выходить за границы слайдера
			if (this.newPos < -0.3 || this.newPos > 100.3) return;

			/*запрещаем ползункам перепрыгивать друг через друга, если это не single режим*/
			if (!this.controlMax.classList.contains('hidden')) {

				if (this.conf.vertical) {
					if (this.moovingControl == 'min') {//двигается нижний ползунок
						if (this.newPos >
							parseFloat(this.controlMax.style.bottom)) {
							return;
						}
					}
					if (this.moovingControl == 'max') {//двигается верхний ползунок
						if (this.newPos <
							parseFloat(this.controlMin.style.bottom)) {
							return;
						}
					}
				} else {
					if (this.moovingControl == 'min') {//двигается левый ползунок
						if (this.newPos >
							parseFloat(this.controlMax.style.left)) {
							return;
						}
					}
					if (this.moovingControl == 'max') {//двигается правый ползунок
						if (this.newPos <
							parseFloat(this.controlMin.style.left)) {
							return;
						}
					}
				}
			}
			this.сontrolPosUpdated(this.currentControl, this.newPos); //Вызываем для обновления положения ползунка в view
		}
		this.computeControlValue();
	}

	/*Рассчитываем новое значение ползунка*/

	computeControlValue() {
		if (!this.changeMode) {
			this.newValue = (this.minRangeVal + ((this.maxRangeVal -
				this.minRangeVal) * this.newPos) / 100).toFixed(0);
			this.сontrolValueUpdated(this.currentControl, this.newValue); //Вызываем для обновления панели view
		}
		this.computeProgressBar();
	}

	/*Рассчитываем ширину и позицию left (top) прогресс-бара*/
	computeProgressBar() {
		if (!this.changeMode) { //Если это не переключение режима
			if (this.conf.vertical == true) {//вертикальный слайдер
				this.secondControlPos =
					parseInt(this.secondControl.style.bottom);
			} else {// горизонтальный слайдер
				//	this.secondControlPos = parseInt(this.secondControl.style.left);

			}
			//режим Double
			if (!this.controlMax.classList.contains('hidden')) {


				this.selectedWidth =
					Math.abs(this.secondControlPos -
						this.newPos) + "px";
				if (!this.currentControlFlag) { //перемещатся левый ползунок
					this.selectedPos = this.newPos + this.shift * 2 + "px";
				} else {//перемещатся правый ползунок

					this.selectedPos =
						this.secondControlPos - this.parentPos + "px";

					// console.log('this.secondControlPos: ');
					// console.log(this.secondControlPos);
					// console.log('this.parentPos: ');
					// console.log(this.parentPos);
					// console.log('this.selectedPos: ');
					// console.log(this.selectedPos);
				}
				//Режим Single
			} else {
				if (this.conf.vertical == true) {
					console.log(this.selectedPos);
					this.selectedPos = '0px';
					this.selectedWidth = this.controlMin.style.bottom;
				}

				else {
					this.selectedPos = '0px';
					this.selectedWidth = this.newPos + "px";
				}
			}
		}
		//Если это переключение режима
		else if (this.changeMode) {// если это переключение режима
			if (this.conf.vertical == true) {// вертикальный слайдер
				if (this.switchToSingleMode) {//переключение в Single режим
					this.selectedPos = '0';
					this.selectedWidth =
						this.controlMin.style.bottom;
				}
				else if (this.switchToDoubleMode) {//переключение в Double режим
					this.selectedPos = this.controlMin.style.bottom;
					this.selectedWidth =
						String(parseInt(this.controlMax.style.bottom) -
							parseInt(this.controlMin.style.bottom));
				}
				else if (this.switchToVerticalMode) {//переключение в вертикальный режим
				}
				else if (this.switchToHorizontalMode) {//переключение в горизонтальный режим
				}
			} else {// горизонтальный слайдер
				if (this.switchToSingleMode) {//переключение в Single режим
					this.selectedPos = '0';
					this.selectedWidth = this.controlMin.style.left;
				}
				else if (this.switchToDoubleMode) {//переключение в Double режим
					this.selectedPos =
						String(parseFloat(this.controlMin.style.left));
					this.selectedWidth =
						parseFloat(this.controlMax.style.left) -
						parseFloat(this.controlMin.style.left) + 'px';
				}
				else if (this.switchToVerticalMode) {//переключение в вертикальный режим
				}
				else if (this.switchToHorizontalMode) {//переключение в горизонтальный режим
				}
			}
		}
		this.progressBarUpdated(this.selectedPos,
			this.selectedWidth, this.conf); //Вызываем для обновления прогресс бара в view
	}


	//Вызываем для обновления положения ползунка (обращение к контроллеру)
	bindControlPosUpdated(callback: ControlPosUpdated) {
		this.сontrolPosUpdated = callback;
	}

	//Вызываем для обновления положения прогресс-бара (обращение к контроллеру)
	bindprogressBarUpdated(callback: ProgressBarUpdated) {
		this.progressBarUpdated = callback;
	}
	//Вызываем для обновления значения ползунка (обращение к контроллеру)
	bindСontrolValueUpdated(callback: ControlValueUpdated) {
		this.сontrolValueUpdated = callback;
	}
}

export { sliderModel };
