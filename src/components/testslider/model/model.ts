
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
	IControlElements
} from './../interface';


class sliderModel {
	conf: IConf;
	slider: HTMLElement;
	leftControl: HTMLElement;
	rightControl: HTMLElement;
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
	marksArr: { 'pos': number, 'text': number }[];
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
	сontrolPosUpdated: (arg1: HTMLElement, arg2: number) => void;
	progressBarUpdated: (arg1: string, arg2: string, arg3: IConf) => void;
	сontrolValueUpdated: (arg1: HTMLElement, arg2: string) => void;




	/*Инициализация. Получаем элемент ползунка, определяем расположение ползунков и прогресс-бара в момент создания слайдера */

	init(conf: IConf): void {
		this.conf = conf;

		this.slider = document.querySelector(conf.target);
		this.leftControl = this.slider.querySelector('.rs__control-min');
		this.rightControl = this.slider.querySelector('.rs__control-max');

		this.scale = this.slider.querySelector('.rs__slider');
		this.scaleWidth = this.scale.offsetWidth;
		this.scaleHeight = this.scale.offsetHeight; //!

		if (this.conf.vertical == true) {
			this.shift = (this.leftControl.offsetHeight) / 2;
			//this.length = parseFloat(this.scaleHeight);
			this.length = this.scaleHeight;
		} else {
			this.shift = (this.leftControl.offsetWidth) / 2;
			//this.length = parseFloat(this.scaleWidth);
			this.length = this.scaleWidth;
		}



		this.minRangeVal = conf.min;//минимальное значение диапазон
		this.maxRangeVal = conf.max;//максимальное значение диапазона

		this.leftControlStartVal = conf.from;
		this.rightControlStartVal = conf.to;

		console.log(this.leftControlStartVal);

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

		this.computeScaleMarks(this.conf);

	}

	//Получаем и сохраняем в объекте модели данные о перемещаемом ползунке (при перетягивании ползунка или клике по шкале)
	getControlData(controlData: IControlElements) {
		console.log(controlData);

		this.currentControl = controlData.currentControl; // ползунок, за который тянут
		this.secondControl = controlData.secondControl; // второй ползунок
		this.parentElement = this.currentControl.parentElement;
		this.currentControlFlag = controlData.currentControlFlag;
	}

	computeScaleMarks(conf: IConf): { 'pos': number, 'text': number }[] {
		/*
		расчет делений шкалы:
		(conf.max - conf.min) - кол-во единичных интервалов
		this.length / (conf.max - conf.min);//ширина единичного интервала; 
		(this.length / (conf.max - conf.min)) * conf.step;// ширина шага (шаг может быть равен одному или нескольким единичным интервалам)
		*/
		//	console.log(conf);
		this.stepLength = (this.length / (conf.max - conf.min)) * conf.step;
		this.text = conf.min + conf.step;
		this.marksArr = [];
		while (this.length >= this.stepLength) {
			let pos;
			if (conf.vertical == true) {
				//	pos = parseFloat(this.scaleHeight) *
				pos = this.scaleHeight *
					(this.text - conf.min) / (conf.max - conf.min);
			} else {
				pos = (this.text - conf.min) *
					this.scaleWidth / (conf.max - conf.min);
			}
			this.marksArr.push({ 'pos': pos, 'text': this.text });
			this.length = this.length - this.stepLength;
			this.text = this.text + conf.step;
		}
		return this.marksArr;

	}

	//Рассчитываем положение ползунка на основании значения, введенного в панели конфигурирования или в объекте конфигурации
	computeControlPosFromVal(val: number,
		isInitialRendering: boolean = true, control: HTMLElement): number {

		console.log(control);

		if (val != this.minRangeVal) {
			if (this.conf.vertical) {
				this.newPos = (this.scaleHeight *
					(val - this.minRangeVal) /
					(this.maxRangeVal - this.minRangeVal)) - this.shift;



			} else {
				this.newPos = (val - this.minRangeVal) *
					this.scaleWidth /
					(this.maxRangeVal - this.minRangeVal) - this.shift;
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
					this.secondControl = this.rightControl;
					this.currentControlFlag = false;
				} else {
					this.secondControl = this.leftControl;
					this.currentControlFlag = true;
				}
			} else {
				if (control.classList.contains('rs__control-min')) {
					this.secondControl = this.rightControl;
					this.currentControlFlag = false;
				} else {
					this.secondControl = this.leftControl;
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
	computeControlPosFromEvent(e: MouseEvent): void {
		/*Определяем положение мыши в зависимости от устройства*/
		/*На мобильных устройствах может фиксироваться несколько точек касания, поэтому используется массив targetTouches*/
		/*Мы будем брать только первое зафиксированое касание по экрану targetTouches[0]*/

		const target = e.target as HTMLElement;
		//	const touch = e.touches


		if (e.type == 'change') {//если переключили чекбокс на панели конфигурации (например смена режима Double -> Single)
			this.changeMode = true;
			if (target.classList.contains('rs__rangeModeToggle')) { //меняется режим double->single или наоборот
				if (this.rightControl.classList.contains('hidden')) {
					this.switchToSingleMode = true;
					this.switchToDoubleMode = false;
				}
				else {
					this.switchToDoubleMode = true;
					this.switchToSingleMode = false;
				}

			}

			if (target.classList.contains('rs__verticalModeToggle')) { //меняется режим vertical->horizontal или наоборот
			}
		}

		else if (e.type == 'click' || e.type == 'mousemove') {//если потянули ползунок или кликнули по шкале

			this.changeMode = false;
			this.switchToSingleMode = false;
			this.switchToDoubleMode = false;
			this.switchToVerticalMode = false;
			this.switchToHorizontalMode = false;

			if (this.conf.vertical) {
				// e.touches === undefined ? this.pos = e.clientY : this.pos =
				// 	e.targetTouches[0].clientY;
				this.pos = e.clientY;
				this.edge = this.parentElement.offsetHeight;
				this.secondControlPos =
					this.secondControl.getBoundingClientRect().top;
				this.parentPos =
					this.parentElement.getBoundingClientRect().top +
					this.parentElement.offsetHeight;

				this.newPos = this.parentPos - this.pos - this.shift;
			} else {
				// e.touches === undefined ? this.pos = e.clientX :
				// 	this.pos = e.targetTouches[0].clientX;
				this.pos = e.clientX;
				this.edge = this.parentElement.offsetWidth;
				this.secondControlPos =
					this.secondControl.getBoundingClientRect().left;
				this.parentPos =
					this.parentElement.getBoundingClientRect().left;

				this.newPos = this.pos - this.parentPos - this.shift;
			}
			if (this.newPos < this.shift * (-1)) {
				this.newPos = this.shift * (-1); // если здесь поставить this.newPos =0, то по какой-то причине левый ползунок не доходит до самого края шкалы (т.е. вместо elem.style.left=0px ему присваивается 2px)
			} else if (this.newPos > this.edge - this.shift) {

				this.newPos = this.edge - this.shift;
			}

			/*запрещаем ползункам перепрыгивать друг через друга, если это не single режим*/
			if (!this.rightControl.classList.contains('hidden')) {

				if (this.conf.vertical) {
					if ((this.currentControlFlag &&
						this.pos > this.secondControlPos) ||
						(!this.currentControlFlag &&
							this.pos < this.secondControlPos +
							this.shift * 2)) {
						console.log('RETURN');
						return;
					}
				} else {
					if ((!this.currentControlFlag &&
						this.pos > this.secondControlPos) ||
						(this.currentControlFlag &&
							this.pos < this.secondControlPos +
							this.shift * 2)) {
						console.log('RETURN');
						return;
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
			this.newValue = ((this.newPos + this.shift) /
				(this.edge / (this.maxRangeVal -
					this.minRangeVal)) + this.minRangeVal).toFixed(0);
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
				this.secondControlPos = parseInt(this.secondControl.style.left);
			}
			//режим Double
			if (!this.rightControl.classList.contains('hidden')) {
				this.selectedWidth =
					Math.abs(this.secondControlPos -
						this.newPos) + "px";
				if (!this.currentControlFlag) { //перемещатся левый ползунок
					this.selectedPos = this.newPos + this.shift * 2 + "px";
				} else {//перемещатся правый ползунок
					this.selectedPos =
						this.secondControlPos - this.parentPos + "px";
				}
				//Режим Single
			} else {
				if (this.conf.vertical == true) {
					console.log(this.selectedPos);
					this.selectedPos = '0px';
					this.selectedWidth = this.leftControl.style.bottom;
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
						this.leftControl.style.bottom;
				}
				else if (this.switchToDoubleMode) {//переключение в Double режим
					this.selectedPos = this.leftControl.style.bottom;
					this.selectedWidth =
						String(parseInt(this.rightControl.style.bottom) -
							parseInt(this.leftControl.style.bottom));
				}
				else if (this.switchToVerticalMode) {//переключение в вертикальный режим
				}
				else if (this.switchToHorizontalMode) {//переключение в горизонтальный режим
				}
			} else {// горизонтальный слайдер
				if (this.switchToSingleMode) {//переключение в Single режим
					this.selectedPos = '0';
					this.selectedWidth = this.leftControl.style.left;
				}
				else if (this.switchToDoubleMode) {//переключение в Double режим
					this.selectedPos =
						String(parseFloat(this.leftControl.style.left));
					this.selectedWidth =
						parseFloat(this.rightControl.style.left) -
						parseFloat(this.leftControl.style.left) + 'px';
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
