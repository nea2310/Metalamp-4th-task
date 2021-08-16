import {
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
	shift: number;
	minRangeVal: number;
	maxRangeVal: number;
	controlMinStartPos: number;
	controlMaxStartPos: number;
	progressBarStartPos: number;
	progressBarStartWidth: number;
	stepLength: number;
	text: number;
	marksArr: { 'pos'?: number, 'val'?: number }[];
	currentControlElem: HTMLElement;
	secondControl: HTMLElement;
	wrapper: HTMLElement;
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
	progressBarUpdated: (arg1: string, arg2: string, arg3: boolean) => void;
	сontrolValueUpdated: (arg1: HTMLElement, arg2: string) => void;




	/*Инициализация. Получаем элемент ползунка, определяем расположение ползунков и прогресс-бара в момент создания слайдера */

	init(conf: IConf): void {
		this.conf = conf;
		this.wrapper = document.querySelector(conf.target);

		this.controlMin = this.wrapper.querySelector('.rs__control-min');
		this.controlMax = this.wrapper.querySelector('.rs__control-max');
		this.slider = this.controlMin.parentElement;
		this.minRangeVal = conf.min;//минимальное значение диапазон
		this.maxRangeVal = conf.max;//максимальное значение диапазона
		this.controlMinStartPos =
			this.computeControlPosFromVal(conf.from, true, null);// начальное положение левого ползунка на шкале
		this.controlMaxStartPos =
			this.computeControlPosFromVal(conf.to, true, null);// начальное положение правого ползунка на шкале

		this.computeProgressBar('initialRendering');
		this.computeGrid(this.conf);
	}

	//Получаем и сохраняем в объекте модели данные о перемещаемом ползунке (при перетягивании ползунка или клике по шкале)
	getControlData(controlData: IControlElements) {
		this.currentControlElem = controlData.currentControlElem; // ползунок, за который тянут
		this.moovingControl = controlData.moovingControl;
		this.shift = controlData.shift;
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
			this.newPos = 0.00001; // начальное положение ползунка на шкале, если min=from и/ или max=to
		}

		if (isInitialRendering) {
			return this.newPos;
		}
		if (!isInitialRendering) {
			this.сontrolPosUpdated(control, this.newPos);
			this.computeProgressBar('handleMovement');
		}
	}


	//находим value и позиции left шагов, если задана ширина шага (step) или кол-во интервалов, на которое делится шкала (intervals)
	computeGrid(conf: IConf): { 'val'?: number, 'pos'?: number }[] {
		let intervals = 0;
		if (this.conf.step) {//если задана ширина (кол-во единиц) шага (step)
			intervals = (conf.max - conf.min) / conf.step; // находим кол-во шагов
		}

		else if (this.conf.intervals) {//если задано кол-во интервалов шкалы
			conf.step = (conf.max - conf.min) / conf.intervals;// находим ширину (кол-во единиц) в шаге
			intervals = conf.intervals; // находим кол-во шагов
		}

		this.marksArr = [{ val: conf.min, pos: 0 }]; //первое деление всегда стоит на позиции left = 0% и его значение равно conf.min
		let val = conf.min;
		for (let i = 0; i < intervals; i++) {
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


	//Рассчитываем положение ползунка при возникновении события перетягивания ползунка или щелчка по шкале
	computeControlPosFromEvent(e: MouseEvent | Event): void {
		/*Определяем положение мыши в зависимости от устройства*/
		/*На мобильных устройствах может фиксироваться несколько точек касания, поэтому используется массив targetTouches*/
		/*Мы будем брать только первое зафиксированое касание по экрану targetTouches[0]*/
		let isMinMax = false;
		if (e instanceof Event && e.type == 'change') {//если переключили чекбокс на панели конфигурации (например смена режима Double -> Single)


		}

		else if (e instanceof MouseEvent &&
			(e.type == 'click' || e.type == 'mousemove')) {//если потянули ползунок или кликнули по шкале

			if (this.conf.vertical) {
				this.newPos = 100 -
					((e.clientY -
						this.slider.getBoundingClientRect().top) * 100 /
						(this.slider.offsetHeight));

			} else {
				let shift = 0;
				if (e.type == 'mousemove') {
					shift = (this.shift * 100)
						/ (this.slider.offsetWidth);
				}

				this.newPos =
					((e.clientX -
						this.slider.getBoundingClientRect().left) * 100 /
						(this.slider.offsetWidth)) - shift;
			}


			//запрещаем ползункам выходить за границы слайдера

			if (this.newPos < 0) {
				isMinMax = true;
				this.computeControlValue('min');
				return;
			}
			if (this.newPos > 100) {
				isMinMax = true;
				this.computeControlValue('max');
				return;
			}

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
			this.сontrolPosUpdated(this.currentControlElem, this.newPos); //Вызываем для обновления положения ползунка в view
		}
		if (!isMinMax)
			this.computeControlValue('middle');






	}

	/*Рассчитываем новое значение ползунка*/

	computeControlValue(minMax: string) {
		if (!this.changeMode) {
			if (minMax == 'middle') {
				this.newValue = (this.minRangeVal + ((this.maxRangeVal -
					this.minRangeVal) * this.newPos) / 100).toFixed(0);
			} else if (minMax == 'min') {
				this.newValue = String(this.minRangeVal);
			} else if (minMax == 'max') {
				this.newValue = String(this.maxRangeVal);
			}

			this.сontrolValueUpdated(this.currentControlElem, this.newValue); //Вызываем для обновления панели view
		}
		this.computeProgressBar('handleMovement'); // рассчитываем прогресс-бар
	}

	/*Рассчитываем ширину и позицию left (top) прогресс-бара*/
	computeProgressBar(type: string) {

		if (type == 'initialRendering') {

			if (!this.controlMax.classList.contains('hidden')) {//режим Double
				this.selectedPos = this.controlMinStartPos + '%';
				this.selectedWidth = this.controlMaxStartPos -
					this.controlMinStartPos + '%';
			} else {//режим Single
				this.selectedPos = '0%';
				this.selectedWidth = this.controlMinStartPos + '%';

			}
		}


		if (type == 'handleMovement') { //Если произошло перемещение ползунка
			if (this.conf.vertical == true) {//вертикальный слайдер
				console.log(this.controlMax);

				//режим Double
				if (!this.controlMax.classList.contains('hidden')) {
					this.selectedWidth =
						this.controlMin.getBoundingClientRect().bottom -
						this.controlMax.getBoundingClientRect().bottom + 'px';

					if (this.moovingControl == 'min') { //перемещатся нижний ползунок
						this.selectedPos = this.newPos + '%';
					} else {//перемещатся верхний ползунок
						this.selectedPos = this.controlMin.style.bottom;
					}
					//Режим Single
				} else {
					this.selectedPos = '0%';
					this.selectedWidth = this.controlMin.style.bottom;
				}
			} else {//горизонтальный слайдер
				//режим Double
				if (!this.controlMax.classList.contains('hidden')) {
					this.selectedWidth =
						this.controlMax.getBoundingClientRect().left -
						this.controlMin.getBoundingClientRect().left + 'px';
					if (this.moovingControl == 'min') { //перемещатся левый ползунок
						this.selectedPos = this.newPos + '%';
					} else {//перемещатся правый ползунок
						this.selectedPos = this.controlMin.style.left;
					}
					//Режим Single
				} else {
					this.selectedPos = '0%';
					this.selectedWidth = this.controlMin.style.left;
				}
			}
		}
		if (type != 'initialRendering') {
			this.progressBarUpdated(this.selectedPos,
				this.selectedWidth, this.conf.vertical); //Вызываем для обновления прогресс бара в view
		}
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
