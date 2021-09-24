import {
	ControlPosUpdated,
	ProgressBarUpdated,
	ControlValueUpdated,
	IConf,
	IControlElements,
	IObj,
	StepValueUpdated,
	$Imethods,
	$Idata
} from './../interface';
import { Observer } from '../observer/observer';


class sliderModel extends Observer {
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
	stepValueUpdated: (arg1: string) => void;
	intervalValueUpdated: (arg1: string) => void;
	stepValue: string;
	intervalValue: string;
	key: string;
	repeat: boolean;
	defaultConf: IConf;

	$conf: IConf;
	$methods: $Imethods;

	$data: $Idata;
	// $fromPos: number
	// $toPos: number
	// $marksArr: { 'pos'?: number, 'val'?: number }[];
	// $intervalValue: string
	// $stepValue: string

	constructor(conf: IConf) {
		super();
		this.$conf = {

			min: 1,
			max: 10,
			from: 3,
			to: 7,
			range: true,
			bar: true,
			tip: true,
			scale: true,
			step: 1,
			sticky: true,
			shiftOnKeyDown: 1,
			shiftOnKeyHold: 2,
			//			target: string
			vertical: false
		};

		this.$data = {};
		this.$methods = {
			$calcFromPosition: false,
			$calcToPosition: false,
			$calcGrid: false,
			$calcBar: false,
			$calcScale: false
		};
		this.$updateConf(conf);
	}

	// обновим конфигурацию
	$updateConf(newConf: IConf) {
		let conf = {};
		conf = Object.assign(conf, this.$conf, newConf);
		//проверим корректность полученных параметров конфигурации
		let checkResult = this.$checkConf(conf);
		if (checkResult) {
			//определим, какие параметры изменились, и какие методы в модели надо вызвать для пересчета значений
			this.$findChangedConf(this.$conf, conf);
			this.$conf = conf;
			//запустим методы, для которых есть изменившиеся параметры
			let key: keyof $Imethods;
			for (key in this.$methods) {
				if (this.$methods[key]) {
					let method = `this.${key}()`;
					eval(method);
				}
			}
		}
	}

	$checkConf(newConf: IConf) {
		if (newConf.range) { // режим Double
			if (newConf.min > newConf.from ||
				newConf.from >= newConf.to ||
				newConf.to >= newConf.max) return false;
		} else {
			if (newConf.min > newConf.from ||
				newConf.from >= newConf.max)
				return false;
		}
		return true;
	}

	$findChangedConf(conf: IConf, newConf: IConf) {
		//	console.log(this.$methods);
		let key: keyof IConf;
		for (key in newConf) {
			if (newConf[key] === conf[key]) {
				continue;
			} else {
				switch (key) {
					case 'min':
						this.$methods.$calcGrid = true;
						break;
					case 'max':
						this.$methods.$calcGrid = true;
						break;
					case 'from':
						this.$methods.$calcFromPosition = true;
						// this.$methods.$calcGrid = true;
						// this.$methods.$calcScale = true;
						this.$methods.$calcBar = true;
						break;
					case 'to':
						this.$methods.$calcToPosition = true;
						// this.$methods.$calcGrid = true;
						// this.$methods.$calcScale = true;
						this.$methods.$calcBar = true;
						break;
					case 'step':
						this.$methods.$calcGrid = true;
						break;
					case 'intervals':
						this.$methods.$calcGrid = true;
						break;
				}
			}
		}
		return this.$methods;
	}

	$calcFromPosition() {
		//	console.log(this.$conf);

		if (this.$conf.from != this.$conf.min) {
			if (this.$conf.vertical) {
				this.$data.$fromPos = ((this.$conf.from -
					this.$conf.min) * 100) /
					(this.$conf.max - this.$conf.min);
			} else {
				this.$data.$fromPos = ((this.$conf.from -
					this.$conf.min) * 100) /
					(this.$conf.max - this.$conf.min);
			}
		}
		else {
			this.$data.$fromPos = 0.00001; // начальное положение ползунка на шкале, если min=from 
		}
		//	console.log(this);
		this.fire('FromPosition', this.$data);
	}

	$calcToPosition() {
		if (this.$conf.vertical) {
			this.$data.$toPos = ((this.$conf.to - this.$conf.min) * 100) /
				(this.$conf.max - this.$conf.min);
		} else {
			this.$data.$toPos = ((this.$conf.to - this.$conf.min) * 100) /
				(this.$conf.max - this.$conf.min);
		}
		//	console.log(this);
		this.fire('ToPosition', this.$data);
	}



	/*Рассчитываем ширину и позицию left (top) прогресс-бара*/
	$calcBar() {

		//	if (type == 'initialRendering') {

		if (this.$conf.range) {//режим Double
			this.$data.$barPos = this.$data.$fromPos;
			this.$data.$barWidth = this.$data.$toPos -
				this.$data.$fromPos;
		} else {//режим Single
			this.$data.$barPos = 0;
			this.$data.$barWidth = this.$data.$fromPos;
		}

		this.fire('Bar', this.$data);
		//	}

		/*
				if (type == 'handleMovement') { //Если произошло перемещение ползунка
					if (this.conf.vertical == true) {//вертикальный слайдер
		
						//режим Double
						if (!this.controlMax.classList.contains('hidden')) {
							this.selectedWidth =
								parseFloat(this.controlMax.style.bottom) -
								parseFloat(this.controlMin.style.bottom) + '%';
		
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
								parseFloat(this.controlMax.style.left) -
								parseFloat(this.controlMin.style.left) + '%';
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
		
		
				*/
	}



	$calcGrid(type: string | null) {
		let intervals = 0;
		let step = 0;
		let arg = '';
		if (this.$conf.step || type == 'steps') {//если задана ширина (кол-во единиц) шага (step)
			console.log('STEPS');
			intervals = (this.$conf.max - this.$conf.min) / this.$conf.step; // находим кол-во шагов
			step = this.$conf.step;
			arg = intervals % 1 === 0 ? String(intervals) :
				String(Math.trunc(intervals + 1));
			if (typeof (type) == 'string') {

				//	this.stepValueUpdated(arg); // обновить значение интервала в панели конфигурации
			}
			else {
				this.$data.$gridType = 'steps';
				this.$data.$intervalValue = arg;
				this.$data.$stepValue = String(this.$conf.step);
			}
		}

		if (this.$conf.intervals || type == 'intervals') {//если задано кол-во интервалов шкалы
			console.log('INTERVALS');
			intervals = this.$conf.intervals; // находим кол-во шагов
			step = (this.$conf.max - this.$conf.min) / this.$conf.intervals;// находим ширину (кол-во единиц) в шаге
			let arg = step % 1 === 0 ? String(step) :
				String(step.toFixed(2));
			if (typeof (type) == 'string') {
				//	this.intervalValueUpdated(arg); // обновить значение шага в панели конфигурации
			}
			else {
				this.$data.$gridType = 'intervals';
				this.$data.$intervalValue = String(this.$conf.intervals);
				this.$data.$stepValue = arg;
			}
		}

		this.$data.$marksArr = [{ val: this.$conf.min, pos: 0 }]; //первое деление всегда стоит на позиции left = 0% и его значение равно this.$conf.min
		let val = this.$conf.min;
		for (let i = 0; i < intervals; i++) {
			let obj: IObj = {};
			val += step;
			if (val <= this.$conf.max) {
				let pos = ((val - this.$conf.min) * 100) /
					(this.$conf.max - this.$conf.min);

				obj.val = parseFloat(val.toFixed(2));
				obj.pos = pos;
				this.$data.$marksArr.push(obj);
			}
		}
		if (this.$data.$marksArr[this.$data.$marksArr.length - 1].val <
			this.$conf.max) { // если длина шкалы не кратна длине шага
			this.$data.$marksArr.push({ val: this.$conf.max, pos: 100 });//последнее деление ставим на позицию left = 100% и его значение равно this.$conf.max
		}
		//	console.log(this);
		this.fire('Grid', this.$data);
	}



	/*Инициализация. Получаем элемент ползунка, определяем расположение ползунков и прогресс-бара в момент создания слайдера */

	init(conf: IConf): void {
		this.conf = conf;
		this.wrapper = document.querySelector(conf.target);

		this.controlMin = this.wrapper.querySelector('.rs__control-min');
		this.controlMax = this.wrapper.querySelector('.rs__control-max');
		this.slider = this.controlMin.parentElement;
		this.minRangeVal = conf.min;//минимальное значение диапазон
		this.maxRangeVal = conf.max;//максимальное значение диапазона
		// this.controlMinStartPos =
		// 	this.computeControlPosFromVal(conf.from, true, null);// начальное положение левого ползунка на шкале
		// this.controlMaxStartPos =
		// 	this.computeControlPosFromVal(conf.to, true, null);// начальное положение правого ползунка на шкале

		//	this.computeProgressBar('initialRendering');
		//	this.computeGrid(this.conf, null);
	}

	//Получаем и сохраняем в объекте модели данные о перемещаемом ползунке (при перетягивании ползунка или клике по шкале)
	getControlData(controlData: IControlElements) {
		this.currentControlElem = controlData.currentControlElem; // ползунок, за который тянут
		this.moovingControl = controlData.moovingControl;
		this.shift = controlData.shift;
		this.key = controlData.key;
		this.repeat = controlData.repeat;
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
	computeGrid(conf: IConf,
		type: string | null): { 'val'?: number, 'pos'?: number }[] | string {
		console.log(type);

		let intervals = 0;
		let step = 0;
		let arg = '';
		if (this.conf.step || type == 'steps') {//если задана ширина (кол-во единиц) шага (step)
			console.log('STEPS');
			intervals = (conf.max - conf.min) / conf.step; // находим кол-во шагов
			step = conf.step;
			arg = intervals % 1 === 0 ? String(intervals) :
				String(Math.trunc(intervals + 1));
			if (typeof (type) == 'string') {

				this.stepValueUpdated(arg); // обновить значение интервала в панели конфигурации
			}
			else {
				this.intervalValue = arg;
				this.stepValue = String(conf.step);
			}
		}

		if (this.conf.intervals || type == 'intervals') {//если задано кол-во интервалов шкалы
			console.log('INTERVALS');
			intervals = conf.intervals; // находим кол-во шагов
			step = (conf.max - conf.min) / conf.intervals;// находим ширину (кол-во единиц) в шаге
			let arg = step % 1 === 0 ? String(step) :
				String(step.toFixed(2));
			if (typeof (type) == 'string') {
				this.intervalValueUpdated(arg); // обновить значение шага в панели конфигурации
			}
			else {
				this.intervalValue = String(conf.intervals);
				this.stepValue = arg;
			}
		}

		this.$data.$marksArr = [{ val: conf.min, pos: 0 }]; //первое деление всегда стоит на позиции left = 0% и его значение равно conf.min
		let val = conf.min;
		for (let i = 0; i < intervals; i++) {
			let obj: IObj = {};
			val += step;
			if (val <= conf.max) {
				let pos = ((val - conf.min) * 100) /
					(conf.max - conf.min);

				obj.val = parseFloat(val.toFixed(2));
				obj.pos = pos;
				this.$data.$marksArr.push(obj);
			}
		}
		if (this.$data.$marksArr[this.$data.$marksArr.length - 1].val
			< conf.max) { // если длина шкалы не кратна длине шага
			this.$data.$marksArr.push({ val: conf.max, pos: 100 });//последнее деление ставим на позицию left = 100% и его значение равно conf.max
		}
		return this.$data.$marksArr;
	}





	//Рассчитываем положение ползунка при возникновении события перетягивания ползунка или щелчка по шкале или перемещения сфокусированного ползунка стрелкой 
	$calcPos(type: string,
		clientY: number,
		clientX: number,
		top: number,
		left: number,
		width: number,
		height: number,
		shiftBase: number,
		moovingControl: string) {


		//if (e instanceof PointerEvent &&
		//	(e.type == 'pointerdown' || e.type == 'pointermove')) {//если потянули ползунок или кликнули по шкале
		let newPos = 0;
		if (this.$conf.vertical) {
			newPos = 100 -
				((clientY - top) * 100 / height);

		} else {
			let shift = 0;
			if (type == 'pointermove') {
				shift = (shiftBase * 100) / width;
			}

			newPos =
				((clientX - left) * 100 / width) - shift;
		}




		// если ползунок должен вставать на позицию ближайшего к нему деления шкалы
		if (this.$conf.sticky) {
			/*Перебираем массив с позициями и значениями делений шкалы и вычитаем позицию деления от значения newPos 
			до тех пор, пока результат текущей итерации не станет больше результата предыдущей (это значит, что мы нашли деление,
				ближайшее к позиции ползунка и ползунок надо переместить на позицию этого деления*/
			for (let i = 0; i < this.$data.$marksArr.length; i++) {
				let a = 0;
				if (i < this.$data.$marksArr.length - 1) {
					a = this.$data.$marksArr[i + 1].pos;
				}
				if (Math.abs(newPos - this.$data.$marksArr[i].pos) <
					Math.abs(newPos - a)) {
					newPos = this.$data.$marksArr[i].pos;
					break;
				}
			}
		}
		//	}

		let isStop = false;
		//запрещаем ползункам выходить за границы слайдера
		if (newPos < 0) {
			isStop = true;
			//this.computeControlValue('min');
			this.$calcVal('min', 0, moovingControl);
			return;
		}
		if (newPos > 100) {
			isStop = true;
			//	this.computeControlValue('max');
			this.$calcVal('max', 0, moovingControl);
			return;
		}

		/*запрещаем ползункам перепрыгивать друг через друга, если это не single режим*/
		if (!this.controlMax.classList.contains('hidden')) {
			if (this.$conf.vertical) {
				if (moovingControl == 'min') {//двигается нижний ползунок
					if (newPos >=
						parseFloat(this.controlMax.style.bottom)) {
						isStop = true;
						//this.computeControlValue('meetMax');
						this.$calcVal('meetMax', 0, moovingControl);
						return;
					}
				}
				if (moovingControl == 'max') {//двигается верхний ползунок
					if (newPos <=
						parseFloat(this.controlMin.style.bottom)) {
						isStop = true;
						//	this.computeControlValue('meetMin');
						this.$calcVal('meetMin', 0, moovingControl);
						return;
					}
				}
			} else {
				if (moovingControl == 'min') {//двигается левый ползунок
					if (newPos >
						parseFloat(this.controlMax.style.left)) {
						isStop = true;
						//this.computeControlValue('meetMax');
						this.$calcVal('meetMax', 0, moovingControl);
						return;
					}
				}
				if (moovingControl == 'max') {//двигается правый ползунок
					if (newPos <
						parseFloat(this.controlMin.style.left)) {
						isStop = true;
						//	this.computeControlValue('meetMin');
						this.$calcVal('meetMin', 0, moovingControl);
						return;
					}
				}
			}
		}

		if (moovingControl == 'min') {
			this.$data.$fromPos = newPos;
			this.fire('FromPosition', this.$data);
		} else {
			this.$data.$toPos = newPos;
			this.fire('ToPosition', this.$data);
		}

		//	this.сontrolPosUpdated(this.currentControlElem, newPos); //Вызываем для обновления положения ползунка в view



		if (!isStop)
			this.$calcVal('normal', newPos, moovingControl);
	}


	/*Рассчитываем новое значение ползунка*/

	$calcVal(stopType: string,
		pos: number,
		moovingControl: string) {
		// console.log(pos);
		// console.log(elem);


		if (!this.changeMode) {
			let newVal = '';
			if (stopType == 'normal') {
				newVal = (this.$conf.min + ((this.$conf.max -
					this.$conf.min) * pos) / 100).toFixed(0);
				this.computeProgressBar('handleMovement'); // рассчитываем прогресс-бар

			} else if (stopType == 'min') {
				newVal = String(this.$conf.min);
			} else if (stopType == 'max') {
				newVal = String(this.$conf.max);
			}
			else if (stopType == 'meetMax') {
				newVal = String(this.conf.to);
			}
			else if (stopType == 'meetMin') {
				newVal = String(this.conf.from);
			}
			//	console.log(moovingControl);

			if (moovingControl == 'min') {
				this.$data.$fromVal = newVal;
				this.fire('FromValue', this.$data);
			} else {
				this.$data.$toVal = newVal;
				this.fire('ToValue', this.$data);
			}

			//	this.сontrolValueUpdated(elem, this.newValue); //Вызываем для обновления панели view
		}

	}

	// //Рассчитываем положение ползунка при возникновении события перетягивания ползунка или щелчка по шкале или перемещения сфокусированного ползунка стрелкой 
	// computeControlPosFromEvent(e: PointerEvent): void {


	// 	if (e instanceof PointerEvent &&
	// 		(e.type == 'pointerdown' || e.type == 'pointermove')) {//если потянули ползунок или кликнули по шкале

	// 		if (this.conf.vertical) {
	// 			this.newPos = 100 -
	// 				((e.clientY -
	// 					this.slider.getBoundingClientRect().top) * 100 /
	// 					(this.slider.offsetHeight));

	// 		} else {
	// 			let shift = 0;
	// 			if (e.type == 'pointermove') {
	// 				shift = (this.shift * 100)
	// 					/ (this.slider.offsetWidth);
	// 			}
	// 			this.newPos =
	// 				((e.clientX -
	// 					this.slider.getBoundingClientRect().left) * 100 /
	// 					(this.slider.offsetWidth)) - shift;
	// 			console.log(shift);
	// 		}



	// 		// если ползунок должен вставать на позицию ближайшего к нему деления шкалы
	// 		if (this.conf.sticky) {
	// 			/*Перебираем массив с позициями и значениями делений шкалы и вычитаем позицию деления от значения this.newPos 
	// 			до тех пор, пока результат текущей итерации не станет больше результата предыдущей (это значит, что мы нашли деление,
	// 				ближайшее к позиции ползунка и ползунок надо переместить на позицию этого деления*/
	// 			for (let i = 0; i < this.$data.$marksArr.length; i++) {
	// 				let a = 0;
	// 				if (i < this.$data.$marksArr.length - 1) {
	// 					a = this.$data.$marksArr[i + 1].pos;
	// 				}
	// 				if (Math.abs(this.newPos - this.$data.$marksArr[i].pos) <
	// 					Math.abs(this.newPos - a)) {
	// 					this.newPos = this.$data.$marksArr[i].pos;
	// 					break;
	// 				}
	// 			}
	// 		}
	// 	}

	// 	let isStop = false;
	// 	//запрещаем ползункам выходить за границы слайдера
	// 	if (this.newPos < 0) {
	// 		isStop = true;
	// 		this.computeControlValue('min');
	// 		return;
	// 	}
	// 	if (this.newPos > 100) {
	// 		isStop = true;
	// 		this.computeControlValue('max');
	// 		return;
	// 	}

	// 	/*запрещаем ползункам перепрыгивать друг через друга, если это не single режим*/
	// 	if (!this.controlMax.classList.contains('hidden')) {
	// 		if (this.conf.vertical) {
	// 			if (this.moovingControl == 'min') {//двигается нижний ползунок
	// 				if (this.newPos >=
	// 					parseFloat(this.controlMax.style.bottom)) {
	// 					isStop = true;
	// 					this.computeControlValue('meetMax');
	// 					return;
	// 				}
	// 			}
	// 			if (this.moovingControl == 'max') {//двигается верхний ползунок
	// 				if (this.newPos <=
	// 					parseFloat(this.controlMin.style.bottom)) {
	// 					isStop = true;
	// 					this.computeControlValue('meetMin');
	// 					return;
	// 				}
	// 			}
	// 		} else {
	// 			if (this.moovingControl == 'min') {//двигается левый ползунок
	// 				if (this.newPos >
	// 					parseFloat(this.controlMax.style.left)) {
	// 					isStop = true;
	// 					this.computeControlValue('meetMax');
	// 					return;
	// 				}
	// 			}
	// 			if (this.moovingControl == 'max') {//двигается правый ползунок
	// 				if (this.newPos <
	// 					parseFloat(this.controlMin.style.left)) {
	// 					isStop = true;
	// 					this.computeControlValue('meetMin');
	// 					return;
	// 				}
	// 			}
	// 		}
	// 	}
	// 	this.сontrolPosUpdated(this.currentControlElem, this.newPos); //Вызываем для обновления положения ползунка в view

	// 	if (!isStop)
	// 		this.computeControlValue('normal');
	// }









	computePosFromKeyboardEvent(e: KeyboardEvent): void {
		if (e.type == 'keydown') {//если нажали стрелку на сфокусированном ползунке
			if (!this.conf.sticky) {	// если ползунок НЕ должен вставать на позицию ближайшего к нему деления шкалы
				if (this.moovingControl == 'min') {// Ползунок min
					if (this.key == 'ArrowRight' || this.key == 'ArrowUp') {//Увеличение значения
						if (!this.controlMax.classList.contains('hidden')) { // режим Double
							if (this.conf.from < this.conf.to) {
								this.repeat ?
									this.computeControlPosFromVal(
										this.conf.from +
										this.conf.shiftOnKeyHold,
										false, this.controlMin) :
									this.computeControlPosFromVal(
										this.conf.from +
										this.conf.shiftOnKeyDown,
										false, this.controlMin);
							}
						} else {// режим Single
							if (this.conf.from < this.conf.max) {
								this.repeat ?
									this.computeControlPosFromVal(
										this.conf.from +
										this.conf.shiftOnKeyHold,
										false, this.controlMin) :
									this.computeControlPosFromVal(
										this.conf.from +
										this.conf.shiftOnKeyDown,
										false, this.controlMin);
							}
						}
					} else {// Уменьшение значения

						if (this.conf.from > this.conf.min) {
							this.repeat ?
								this.computeControlPosFromVal(
									this.conf.from - this.conf.shiftOnKeyHold,
									false, this.controlMin) :
								this.computeControlPosFromVal(
									this.conf.from - this.conf.shiftOnKeyDown,
									false, this.controlMin);
						}
					}
				} else {// Ползунок max
					if (this.key == 'ArrowRight' || this.key == 'ArrowUp') {//Увеличение значения
						if (this.conf.to < this.conf.max) {
							this.repeat ?
								this.computeControlPosFromVal(
									this.conf.to + this.conf.shiftOnKeyHold,
									false, this.controlMax) :
								this.computeControlPosFromVal(
									this.conf.to + this.conf.shiftOnKeyDown,
									false, this.controlMax);
						}
					} else {// Уменьшение значения
						if (this.conf.to > this.conf.from) {
							this.repeat ?
								this.computeControlPosFromVal(
									this.conf.to - this.conf.shiftOnKeyHold,
									false, this.controlMax) :
								this.computeControlPosFromVal(
									this.conf.to - this.conf.shiftOnKeyDown,
									false, this.controlMax);
						}
					}
				}
			}

			// если ползунок должен вставать на позицию ближайшего к нему деления шкалы
			else {
				let newVal = 0;

				if (this.moovingControl == 'min') {// ползунок min
					if (this.key == 'ArrowRight' || this.key == 'ArrowUp') {//Увеличение значения
						for (let i = 0; i < this.$data.$marksArr.length; i++) {
							if (this.$data.$marksArr[i].val -
								this.conf.from > 0) {
								this.repeat ?
									newVal = this.$data.$marksArr[i +
										this.conf.shiftOnKeyHold - 1].val :
									newVal = this.$data.$marksArr[i +
										this.conf.shiftOnKeyDown - 1].val;
								break;
							}
						}
						if (newVal > this.conf.from &&
							(!this.controlMax.classList.
								contains('hidden') && newVal <= this.conf.to
								|| this.controlMax.classList.
									contains('hidden') && newVal <=
								this.conf.max))
							this.computeControlPosFromVal(
								newVal,
								false, this.controlMin);
					} else {//Уменьшение значения
						for (let i = this.$data.$marksArr.length - 1;
							i >= 0; i--) {
							if (this.conf.from > this.$data.$marksArr[i].val) {
								this.repeat ?
									newVal = this.$data.$marksArr[i -
										this.conf.shiftOnKeyHold + 1].val :
									newVal = this.$data.$marksArr[i -
										this.conf.shiftOnKeyDown + 1].val;
								break;
								//}
							}
						}
						if (newVal < this.conf.from &&
							this.conf.from > this.conf.min)
							this.computeControlPosFromVal(
								newVal,
								false, this.controlMin);
					}
				} else {// ползунок max
					if (this.key == 'ArrowRight' || this.key == 'ArrowUp') {//Увеличение значения
						for (let i = 0; i < this.$data.$marksArr.length; i++) {
							if (this.$data.$marksArr[i].val -
								this.conf.to > 0) {
								this.repeat ?
									newVal = this.$data.$marksArr[i +
										this.conf.shiftOnKeyHold - 1].val :
									newVal = this.$data.$marksArr[i +
										this.conf.shiftOnKeyDown - 1].val;
								break;
							}
						}
						if (newVal > this.conf.to &&
							this.conf.to < this.conf.max)
							this.computeControlPosFromVal(
								newVal,
								false, this.controlMax);
					} else {//Уменьшение значения
						for (let i = this.$data.$marksArr.length - 1;
							i > 0; i--) {
							if (this.conf.to > this.$data.$marksArr[i].val) {
								//	if (this.conf.to > this.conf.from) {
								this.repeat ?
									newVal = this.$data.$marksArr[i -
										this.conf.shiftOnKeyHold + 1].val :
									newVal = this.$data.$marksArr[i -
										this.conf.shiftOnKeyDown + 1].val;
								break;
							}
						}
						if (newVal >= this.conf.from &&
							this.conf.to > this.conf.from)
							this.computeControlPosFromVal(
								newVal,
								false, this.controlMax);
					}
				}
			}
		}

		this.computeControlValue('normal');
	}



	/*Рассчитываем новое значение ползунка*/

	computeControlValue(stopType: string,
		pos: number = this.newPos,
		elem: HTMLElement = this.currentControlElem) {
		// console.log(pos);
		// console.log(elem);


		if (!this.changeMode) {
			if (stopType == 'normal') {

				this.newValue = (this.minRangeVal + ((this.maxRangeVal -
					this.minRangeVal) * pos) / 100).toFixed(0);
				this.computeProgressBar('handleMovement'); // рассчитываем прогресс-бар

			} else if (stopType == 'min') {
				this.newValue = String(this.minRangeVal);
			} else if (stopType == 'max') {
				this.newValue = String(this.maxRangeVal);
			}
			else if (stopType == 'meetMax') {
				this.newValue = String(this.conf.to);
			}
			else if (stopType == 'meetMin') {
				this.newValue = String(this.conf.from);
			}

			this.сontrolValueUpdated(elem, this.newValue); //Вызываем для обновления панели view
		}

	}
	/*Если во время single режима меньший ползунок зашел за позицию большего (т.е. from стало больше to) - 
	при возвращении в double режим поменять ползунки местами */
	adjustControlPos() {
		let temp = this.conf.from;
		this.conf.from = this.conf.to;
		this.conf.to = temp;
		//Установить меньший ползунок на позицию min
		this.computeControlPosFromVal(this.conf.from, false, this.controlMin);
		//Установить больший ползунок на позицию max
		this.computeControlPosFromVal(this.conf.to, false, this.controlMax);

		let arr = [];
		arr.push(this.computeControlPosFromVal(this.conf.from,
			true, this.controlMin));
		arr.push(this.computeControlPosFromVal(this.conf.to,
			true, this.controlMax));

		//Посчитать value меньшего ползунка
		this.computeControlValue('normal',
			Math.min.apply(null, arr),
			this.controlMin);

		//Посчитать value большего ползунка
		this.computeControlValue('normal',
			Math.max.apply(null, arr),
			this.controlMax);

		// Посчитать прогресс-бар
		this.moovingControl = 'max';
		this.computeProgressBar('handleMovement');
	}

	/*Рассчитываем ширину и позицию left (top) прогресс-бара*/
	computeProgressBar(type: string) {

		// if (type == 'initialRendering') {

		// 	if (!this.controlMax.classList.contains('hidden')) {//режим Double
		// 		this.selectedPos = this.controlMinStartPos + '%';
		// 		this.selectedWidth = this.controlMaxStartPos -
		// 			this.controlMinStartPos + '%';
		// 	} else {//режим Single
		// 		this.selectedPos = '0%';
		// 		this.selectedWidth = this.controlMinStartPos + '%';
		// 	}
		// }
		if (type == 'handleMovement') { //Если произошло перемещение ползунка
			if (this.conf.vertical == true) {//вертикальный слайдер

				//режим Double
				if (!this.controlMax.classList.contains('hidden')) {
					this.selectedWidth =
						parseFloat(this.controlMax.style.bottom) -
						parseFloat(this.controlMin.style.bottom) + '%';

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
						parseFloat(this.controlMax.style.left) -
						parseFloat(this.controlMin.style.left) + '%';
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

	bindStepValueUpdated(callback: StepValueUpdated) {
		this.stepValueUpdated = callback;
	}

	bindIntervalValueUpdated(callback: StepValueUpdated) {
		this.intervalValueUpdated = callback;
	}
}

export { sliderModel };
