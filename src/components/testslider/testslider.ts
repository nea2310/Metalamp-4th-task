
import { ModuleBody } from 'typescript';
import './testslider.scss';

//type CBNoArgs  = (...args: any[]) => void;
type CBNoArgs = () => void;
type CBControlElements = (arg1: IControlElements) => void;
type CBMouseEvent = (arg1: MouseEvent) => void;
type CBPointerEvent = (arg1: PointerEvent) => void;
type CBEvent = (arg1: Event) => void;
type CBStringEvent = (arg1: string, arg2: Event) => void;
type CBStringPointerEvent = (arg1: string, arg2: PointerEvent) => void;
//type CBChangeEvent = (arg1: ChangeEvent) => void;
type CBInputEvent = (arg1: InputEvent) => void;
type CBStringInputEvent = (arg1: string, arg2: InputEvent) => void;



type ControlPosUpdated = (arg1: HTMLElement, arg2: number) => void;
type ProgressBarUpdated = (arg1: string, arg2: string, arg3: IConf) => void;
type ControlValueUpdated = (arg1: HTMLElement, arg2: string) => void;

interface IConf {
	bar?: boolean
	from?: number
	max?: number
	min?: number
	range?: boolean
	scale?: boolean
	step?: number
	target?: string
	tip?: boolean
	to?: number
	vertical?: boolean
}
interface IControlData {
	cnt: string;
	isMax: boolean;
	isMin: boolean;
	maxCnt: string;
	minCnt: string;
	text: string;
	type: string;
}

interface IControlElements {
	currentControl?: HTMLElement;
	secondControl?: HTMLElement;
	currentControlFlag?: boolean;
}


interface IScaleMarks {
	pos: number;
	text: number;
}


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

class sliderView {

	slider: HTMLElement;

	constructor(root: string) {
		/*Находим корневой элемент*/
		this.slider = document.querySelector(root);
	}


	//Вешаем обработчик события отпускания мыши
	bindMouseUp(mouseUpHandler: CBNoArgs) {
		this.slider.addEventListener('mouseup', () => {
			mouseUpHandler();
		});
	}

	//Вешаем обработчик события завершения ресайза
	bindWindowResize(handler: CBNoArgs) {

		window.addEventListener("resize", () => { //Подключаем событие изменения размеров окна
			windowResizeStart(); //Вызываем функцию Обработки окна
			return false;
		});

		let resizeTimeoutId: ReturnType<typeof setTimeout>; //Таймер задержки исполнения

		function windowResizeStart() {
			clearTimeout(resizeTimeoutId); //удаляем все предыдущие события "Дребезга контактов"
			resizeTimeoutId = setTimeout(windowResizeStop, 1000);
		}

		function windowResizeStop() {
			console.log("Есть смена размера окна ");
			handler();
		}
	}

	// Удаление слайдера
	deleteSlider() {
		this.slider.firstChild.remove();
		this.slider.lastChild.remove();
	}
}

class sliderViewScale extends sliderView {

	scale: HTMLElement;
	scaleWidth: number;
	scaleHeight: number;
	progressBar: HTMLElement;
	leftControl: HTMLElement;
	rightControl: HTMLElement;
	leftControlDist: number;
	rightControlDist: number;
	markList: HTMLElement[];

	//markList: NodeList;



	constructor(root: string) {
		super(root);
	}

	// Инициализация
	init(conf: IConf) {
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

				if (!conf.vertical) {
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

	updateScaleMarks(scaleMarks: { 'pos': number, 'text': number }[],
		conf: IConf) {
		if (this.markList) {
			for (let elem of this.markList) {
				elem.remove();
			}
		}
		for (let node of scaleMarks) {
			let elem = document.createElement('div');
			elem.innerText = String(node.text);
			elem.classList.add('rs__mark');
			if (conf.vertical == true) {
				elem.classList.add('vertical');
				elem.style.bottom = String(node.pos);
			} else {
				elem.classList.add('horizontal');
				elem.style.left = String(node.pos);
			}
			if (!conf.scale) {
				elem.classList.add('hidden');
			}
			this.scale.appendChild(elem);
		}
		//this.markList = [...this.scale.querySelectorAll('.rs__mark')];
		this.markList =
			[...this.scale.querySelectorAll<HTMLElement>('.rs__mark')];
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

class sliderViewDoubleControl extends sliderView {
	conf: IConf;

	leftControl: HTMLElement;
	rightControl: HTMLElement;
	leftTip: HTMLInputElement;
	rightTip: HTMLInputElement;
	scale: Element;

	constructor(root: string) {
		super(root);
	}
	// Инициализация
	init(conf: IConf) {
		this.conf = conf;
		this.renderLeftControl();
		this.renderRightControl();
	}
	/*Создаем ползунок минимального значения*/
	renderLeftControl() {
		this.scale = this.slider.firstElementChild;
		this.leftControl = document.createElement('div');
		this.leftTip = document.createElement('input');
		this.leftControl.className = 'rs__control rs__control-min';
		this.leftTip.className = 'rs__tip rs__tip-min';
		this.leftTip.value = String(this.conf.from);
		this.scale.append(this.leftControl);
		this.leftControl.append(this.leftTip);

		if (this.conf.tip == false) { // no tip mode
			this.leftTip.classList.add('hidden');
		}

		if (this.conf.vertical == true) { // vertical mode
			this.leftControl.classList.add('vertical');
			this.leftTip.classList.add('vertical');
		} else {//horizontal mode
			this.leftControl.classList.add('horizontal');
			this.leftTip.classList.add('horizontal');
		}


	}
	/*Создаем ползунок максимального значения*/
	renderRightControl() {
		this.rightControl = document.createElement('div');
		this.rightControl.className = 'rs__control rs__control-max';
		this.scale.append(this.rightControl);


		this.rightTip = document.createElement('input');


		this.rightControl.className = 'rs__control rs__control-max';
		this.rightTip.className = 'rs__tip rs__tip-max';
		this.rightTip.value = String(this.conf.to);



		this.rightControl.append(this.rightTip);

		if (this.conf.range == false) {// single mode
			this.rightControl.classList.add('hidden');
			this.rightTip.classList.add('hidden');
		}

		if (this.conf.tip == false) {// no tip mode
			this.rightTip.classList.add('hidden');
		}

		if (this.conf.vertical == true) { // vertical mode
			this.rightControl.classList.add('vertical');
			this.rightTip.classList.add('vertical');
		} else {//horizontal mode
			this.rightControl.classList.add('horizontal');
			this.rightTip.classList.add('horizontal');
		}

	}




	// Вешаем обработчики события нажатия кнопки на ползунке (захвата ползунка) и перемещения ползунка
	bindMoveControl(firstEventHandler: CBControlElements,
		secondEventHandler: CBMouseEvent) {

		this.slider.addEventListener('mousedown', (e) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains('rs__control')) {
				let controlData: IControlElements = {};
				//определяем ползунок, за который тянут
				controlData.currentControl = target;

				//определяем второй ползунок
				controlData.currentControl == this.leftControl ?
					controlData.secondControl = this.rightControl :
					controlData.secondControl = this.leftControl;

				// Устанавливаем флаг, какой из ползунков (левый или правый) перемещается
				controlData.currentControl == this.leftControl ?
					controlData.currentControlFlag = false :
					controlData.currentControlFlag = true;
				firstEventHandler(controlData);// вызов хендлера обработки события

				document.addEventListener('mousemove', secondEventHandler);// навешивание обработчика перемещения ползунка
				//	document.addEventListener('mouseup', this.handleMouseUp);
				//document.addEventListener('touchmove', secondEventHandler);// навешивание обработчика перемещения ползунка
				//	document.addEventListener('touchend', this.handleMouseUp);
			}
		});
	}

	//Обновляем позицию ползунка (вызывается через контроллер)
	updateControlPos(elem: HTMLElement, newPos: number) {

		if (newPos) {
			if (!this.conf.vertical) {
				elem.style.left = newPos + 'px';
			}
			if (this.conf.vertical) {
				elem.style.bottom = newPos + 'px';
			}
		}
	}


	//Обновляем значение tip

	updateTipVal(val: string, isFrom: boolean) {
		isFrom ? this.leftTip.value = val : this.rightTip.value = val;
	}

	updateVerticalMode(isVertical: boolean) {
		isVertical ? console.log('VERTICALMODE') :
			console.log('HORIZONTALMODE');
	}

	updateRangeMode(isDouble: boolean) {
		if (isDouble) {
			this.rightControl.classList.remove('hidden');
			if (this.conf.tip) {
				this.rightTip.classList.remove('hidden');
			}
		} else {
			this.rightControl.classList.add('hidden');
			this.rightTip.classList.add('hidden');
		}
	}

	updateTipMode(isTip: boolean) {
		if (isTip) {
			this.rightTip.classList.remove('hidden');
			this.leftTip.classList.remove('hidden');
		} else {
			this.rightTip.classList.add('hidden');
			this.leftTip.classList.add('hidden');
		}
	}
}


class sliderViewPanel extends sliderView {
	conf: IConf;
	panelWrapper: HTMLElement;
	panelTop: HTMLElement;
	panelBottom: HTMLElement;
	minLabel: HTMLElement;
	minInput: HTMLInputElement;
	maxLabel: HTMLElement;
	maxInput: HTMLInputElement;
	stepLabel: HTMLElement;
	stepInput: HTMLInputElement;
	fromLabel: HTMLElement;
	fromInput: HTMLInputElement;
	toLabel: HTMLElement;
	toInput: HTMLInputElement;
	isVerticalToggle: HTMLElement;
	isVerticalToggleInput: HTMLInputElement;
	isVerticalToggleSpan: HTMLElement;
	isVerticalToggleLabel: HTMLElement;
	leftControlStartVal: number;
	rightControlStartVal: number;
	isRangeToggle: HTMLElement;
	isRangeToggleInput: HTMLInputElement;
	isRangeToggleSpan: HTMLElement;
	isRangeToggleLabel: HTMLElement;
	isScaleToggle: HTMLElement;
	isScaleToggleInput: HTMLInputElement;
	isScaleToggleSpan: HTMLElement;
	isScaleToggleLabel: HTMLElement;
	isBarToggle: HTMLElement;
	isBarToggleInput: HTMLInputElement;
	isBarToggleLabel: HTMLElement;
	isBarToggleSpan: HTMLElement;
	isTipToggle: HTMLElement;
	isTipToggleInput: HTMLInputElement;
	isTipToggleSpan: HTMLElement;
	isTipToggleLabel: HTMLElement;





	constructor(root: string) {
		super(root);
	}
	init(conf: IConf) {
		this.conf = conf;
		this.renderPanelWrapper();
		this.renderMinInput();
		this.renderMaxInput();
		this.renderStepInput();
		this.renderFromInput();
		this.renderToInput();
		this.renderIsVerticalToggle();
		this.renderIsRangeToggle();
		this.renderIsScaleToggle();
		this.renderIsBarToggle();
		this.renderIsTipToggle();
	}



	renderPanelWrapper() {
		this.panelWrapper = document.createElement('div');
		this.panelWrapper.className = 'rs__panelWrapper';
		this.slider.append(this.panelWrapper);
		this.panelTop = document.createElement('div');
		this.panelTop.className = 'rs__panel rs__panel-top';
		this.panelWrapper.append(this.panelTop);
		this.panelBottom = document.createElement('div');
		this.panelBottom.className = 'rs__panel rs__panel-bottom';
		this.panelWrapper.append(this.panelBottom);
	}


	renderMinInput() {
		this.minLabel = document.createElement('label');
		this.minLabel.innerText = 'min';
		this.minInput = document.createElement('input');
		this.minInput.value = String(this.conf.min);
		this.minInput.className = 'rs__input rs__input-min';
		this.minLabel.append(this.minInput);
		this.panelTop.append(this.minLabel);
	}


	renderMaxInput() {
		this.maxLabel = document.createElement('label');
		this.maxLabel.innerText = 'max';
		this.maxInput = document.createElement('input');
		this.maxInput.value = String(this.conf.max);
		this.maxInput.className = 'rs__input rs__input-max';
		this.maxLabel.append(this.maxInput);
		this.panelTop.append(this.maxLabel);
	}


	renderStepInput() {
		this.stepLabel = document.createElement('label');
		this.stepLabel.innerText = 'step';
		this.stepInput = document.createElement('input');
		this.stepInput.value = String(this.conf.step);
		this.stepInput.className = 'rs__input rs__input-step';
		this.stepLabel.append(this.stepInput);
		this.panelTop.append(this.stepLabel);
	}



	renderFromInput() {
		this.fromLabel = document.createElement('label');
		this.fromLabel.innerText = 'from';
		this.fromInput = document.createElement('input');
		this.fromInput.value = String(this.conf.from);
		this.fromInput.className = 'rs__input rs__input-from';
		this.fromLabel.append(this.fromInput);
		this.leftControlStartVal = this.conf.from;
		this.panelTop.append(this.fromLabel);
	}

	renderToInput() {
		this.toLabel = document.createElement('label');
		this.toLabel.innerText = 'to';
		this.toInput = document.createElement('input');
		this.toInput.value = String(this.conf.to);
		this.toInput.className = 'rs__input rs__input-to';
		this.toLabel.append(this.toInput);
		this.rightControlStartVal = this.conf.to;
		this.panelTop.append(this.toLabel);
	}

	renderIsVerticalToggle() {
		this.isVerticalToggle = document.createElement('label');
		this.isVerticalToggle.className = 'togglemark__wrapper';
		this.panelBottom.append(this.isVerticalToggle);

		this.isVerticalToggleInput = document.createElement('input');
		this.isVerticalToggleInput.type = 'checkbox';

		if (this.conf.vertical == true) {
			this.isVerticalToggleInput.checked = true;
		} else {
			this.isVerticalToggleInput.removeAttribute('checked');
		}

		this.isVerticalToggleInput.className = 'rs__verticalModeToggle';
		this.isVerticalToggleSpan = document.createElement('span');
		this.isVerticalToggleSpan.className = 'togglemark';
		this.isVerticalToggleLabel = document.createElement('label');
		this.isVerticalToggleLabel.className = 'togglemark__label';
		this.isVerticalToggleLabel.innerText = 'vertical';
		this.isVerticalToggle.append(this.isVerticalToggleInput);
		this.isVerticalToggle.append(this.isVerticalToggleSpan);
		this.isVerticalToggle.append(this.isVerticalToggleLabel);



		if (this.conf.vertical == true) {
			this.isVerticalToggleInput.checked = true;
		} else {
			this.isVerticalToggleInput.removeAttribute('checked');
		}
	}

	renderIsRangeToggle() {
		this.isRangeToggle = document.createElement('label');
		this.isRangeToggle.className = 'togglemark__wrapper';
		this.panelBottom.append(this.isRangeToggle);

		this.isRangeToggleInput = document.createElement('input');
		this.isRangeToggleInput.type = 'checkbox';


		if (this.conf.range == true) {
			this.isRangeToggleInput.checked = true;
		} else {
			this.isRangeToggleInput.removeAttribute('checked');
		}

		this.isRangeToggleInput.className = 'rs__rangeModeToggle';
		this.isRangeToggleSpan = document.createElement('span');
		this.isRangeToggleSpan.className = 'togglemark';
		this.isRangeToggleLabel = document.createElement('label');
		this.isRangeToggleLabel.className = 'togglemark__label';
		this.isRangeToggleLabel.innerText = 'range';
		this.isRangeToggle.append(this.isRangeToggleInput);
		this.isRangeToggle.append(this.isRangeToggleSpan);
		this.isRangeToggle.append(this.isRangeToggleLabel);
	}




	renderIsScaleToggle() {
		this.isScaleToggle = document.createElement('label');
		this.isScaleToggle.className = 'togglemark__wrapper';
		this.panelBottom.append(this.isScaleToggle);

		this.isScaleToggleInput = document.createElement('input');
		this.isScaleToggleInput.type = 'checkbox';

		if (this.conf.scale == true) {
			this.isScaleToggleInput.checked = true;
		} else {
			this.isScaleToggleInput.removeAttribute('checked');
		}

		this.isScaleToggleInput.className = 'rs__scaleModeToggle';


		this.isScaleToggleSpan = document.createElement('span');
		this.isScaleToggleSpan.className = 'togglemark';

		this.isScaleToggleLabel = document.createElement('label');
		this.isScaleToggleLabel.className = 'togglemark__label';
		this.isScaleToggleLabel.innerText = 'scale';


		this.isScaleToggle.append(this.isScaleToggleInput);
		this.isScaleToggle.append(this.isScaleToggleSpan);
		this.isScaleToggle.append(this.isScaleToggleLabel);
	}


	renderIsBarToggle() {
		this.isBarToggle = document.createElement('label');
		this.isBarToggle.className = 'togglemark__wrapper';
		this.panelBottom.append(this.isBarToggle);

		this.isBarToggleInput = document.createElement('input');
		this.isBarToggleInput.type = 'checkbox';

		if (this.conf.bar == true) {
			this.isBarToggleInput.checked = true;
		} else {
			this.isBarToggleInput.removeAttribute('checked');
		}

		this.isBarToggleInput.className = 'rs__barModeToggle';
		this.isBarToggleSpan = document.createElement('span');
		this.isBarToggleSpan.className = 'togglemark';

		this.isBarToggleLabel = document.createElement('label');
		this.isBarToggleLabel.className = 'togglemark__label';
		this.isBarToggleLabel.innerText = 'bar';


		this.isBarToggle.append(this.isBarToggleInput);
		this.isBarToggle.append(this.isBarToggleSpan);
		this.isBarToggle.append(this.isBarToggleLabel);
	}


	renderIsTipToggle() {
		this.isTipToggle = document.createElement('label');
		this.isTipToggle.className = 'togglemark__wrapper';
		this.panelBottom.append(this.isTipToggle);

		this.isTipToggleInput = document.createElement('input');
		this.isTipToggleInput.type = 'checkbox';

		if (this.conf.tip == true) {
			this.isTipToggleInput.checked = true;
		} else {
			this.isTipToggleInput.removeAttribute('checked');
		}

		this.isTipToggleInput.className = 'rs__tipModeToggle';
		this.isTipToggleSpan = document.createElement('span');
		this.isTipToggleSpan.className = 'togglemark';

		this.isTipToggleLabel = document.createElement('label');
		this.isTipToggleLabel.className = 'togglemark__label';
		this.isTipToggleLabel.innerText = 'tip';


		this.isTipToggle.append(this.isTipToggleInput);
		this.isTipToggle.append(this.isTipToggleSpan);
		this.isTipToggle.append(this.isTipToggleLabel);
	}


	//ввод значения MIN/MAX
	bindMinMaxChange(eventHandler: CBStringEvent) {
		this.minInput.addEventListener('input', (e) => {
			eventHandler(this.minInput.value, e);
		});

		this.maxInput.addEventListener('input', (e) => {
			eventHandler(this.maxInput.value, e);
		});
	}

	//ввод значения STEP
	bindStepChange(eventHandler: CBStringEvent) {
		this.stepInput.addEventListener('input', (e) => {
			eventHandler(this.stepInput.value, e);
		});
	}


	//ввод значения FROM/TO
	bindFromToChange(eventHandler: CBStringEvent) {
		this.fromInput.addEventListener('input', (e) => {
			eventHandler(this.fromInput.value, e);
		});

		this.toInput.addEventListener('input', (e) => {
			eventHandler(this.toInput.value, e);
		});
	}




	//щелчок по чекбоксу VERTICAL
	bindCheckIsVerticalControl(checkedEventHandler: CBEvent,
		notCheckedEventHandler: CBEvent) {

		this.isVerticalToggleInput.addEventListener('change', (e) => {
			this.isVerticalToggleInput.checked ?
				checkedEventHandler(e) : notCheckedEventHandler(e);
		});
	}

	//Эмуляция события ввода в инпут
	createEvent(input: HTMLInputElement) {
		input.value = String(this.conf.min);
		let event = new Event('input', {
			bubbles: true,
			cancelable: true,
		});
		this.fromInput.dispatchEvent(event);
	}


	//щелчок по чекбоксу RANGE
	bindCheckIsRangeControl(checkedEventHandler: CBMouseEvent,
		notCheckedEventHandler: CBMouseEvent) {

		this.isRangeToggleInput.addEventListener('click', (e) => {


			if (this.isRangeToggleInput.checked) {

				if (parseInt(this.fromInput.value) >=
					parseInt(this.toInput.value)) {
					this.createEvent(this.fromInput);
				}
				checkedEventHandler(e);
			}
			else {
				notCheckedEventHandler(e);
			}
		});
	}




	//щелчок по чекбоксу SCALE
	bindCheckIsScaleControl(checkedEventHandler: CBEvent,
		notCheckedEventHandler: CBEvent) {

		this.isScaleToggleInput.addEventListener('change', (e) => {
			if (this.isScaleToggleInput.checked) {
				checkedEventHandler(e);
			}
			else {
				notCheckedEventHandler(e);
			}
		});
	}



	//щелчок по чекбоксу BAR
	bindCheckIsBarControl(checkedEventHandler: CBEvent,
		notCheckedEventHandler: CBEvent) {
		this.isBarToggleInput.addEventListener('change', (e) => {
			if (this.isBarToggleInput.checked) {
				checkedEventHandler(e);
			}
			else {
				notCheckedEventHandler(e);
			}
		});
	}



	//щелчок по чекбоксу TIP
	bindCheckIsTipControl(checkedEventHandler: CBEvent,
		notCheckedEventHandler: CBEvent) {
		this.isTipToggleInput.addEventListener('change', (e) => {
			if (this.isTipToggleInput.checked) {
				checkedEventHandler(e);
			}
			else {
				notCheckedEventHandler(e);
			}
		});
	}


	//Обновление значений инпутов FROM и TO при перемещении ползунков
	updateFromTo(elem: HTMLElement, newValue: string) {
		elem.classList.contains('rs__control-min') ?
			this.fromInput.value = newValue : this.toInput.value = newValue;
	}
}


class sliderController {
	model: sliderModel;
	view: sliderView;
	viewScale: sliderViewScale;
	viewDoubleControl: sliderViewDoubleControl;
	viewPanel: sliderViewPanel;
	conf: IConf;
	defaultConf: IConf;
	customConf: IConf;

	constructor(conf: IConf, root: string,
		view: sliderView, viewScale: sliderViewScale,
		viewDoubleControl: sliderViewDoubleControl,
		viewPanel: sliderViewPanel, model: sliderModel) {
		this.model = model;
		this.view = view;
		this.viewScale = viewScale;
		this.viewDoubleControl = viewDoubleControl;
		this.viewPanel = viewPanel;
		this.prepareConfiguration();
		this.render();
		this.init();


	}

	prepareConfiguration() {
		this.defaultConf = {
			min: 1,
			max: 10,
			from: 3,
			to: 7,
			vertical: false,
			range: true,
			scale: true,
			bar: true,
			tip: true
		};

		this.customConf = conf;
		this.customConf.target = root;//это нужно для модели
		this.conf = Object.assign(this.defaultConf, this.customConf);

		// if (!this.conf.hasOwnProperty('step')) {
		// 	this.conf.step = (this.conf.max - this.conf.min) / 5;
		// }


		this.conf.step = (this.conf.max - this.conf.min) / 5;

	}


	render = () => {
		this.viewScale.init(this.conf);
		this.viewDoubleControl.init(this.conf);
		this.viewPanel.init(this.conf);
		this.model.init(this.conf);
	}



	init() {

		this.handleOnControlPosUpdated(this.viewDoubleControl.leftControl,
			this.model.leftControlStartPos);//передаем во view начальное положение левого ползунка
		this.handleOnControlPosUpdated(this.viewDoubleControl.rightControl,
			this.model.rightControlStartPos); //передаем во view начальное положение левого ползунка


		this.handleOnprogressBarUpdated(String(this.model.progressBarStartPos),
			String(this.model.progressBarStartWidth), this.conf); // передаем во view начальное положение прогресс-бара

		this.handleOnScaleMarksUpdated(this.model.marksArr); // передаем во view начальное положение делений шкалы




		this.viewDoubleControl.bindMoveControl(this.handleGetControlData,
			this.handlecomputeControlPosFromEvent);// вешаем обработчики handleGetControlData и handlecomputeControlPosFromEvent для обработки в view события захвата и перетаскивания ползунка
		this.viewScale.bindClickOnScale(this.handleGetControlData,
			this.handlecomputeControlPosFromEvent);// вешаем обработчики handleGetControlData и handlecomputeControlPosFromEvent для обработки в view события клика по шкале



		this.viewPanel.bindCheckIsVerticalControl(this.handleIsVerticalChecked,
			this.handleIsVerticalNotChecked);
		this.viewPanel.bindCheckIsRangeControl(this.handleIsRangeChecked,
			this.handleIsRangeNotChecked);
		this.viewPanel.bindCheckIsScaleControl(this.handleIsScaleChecked,
			this.handleIsScaleNotChecked);
		this.viewPanel.bindCheckIsBarControl(this.handleIsBarChecked,
			this.handleIsBarNotChecked);
		this.viewPanel.bindCheckIsTipControl(this.handleIsTipChecked,
			this.handleIsTipNotChecked);



		this.viewPanel.bindMinMaxChange(this.handleMinMaxChanged);
		this.viewPanel.bindStepChange(this.handleStepChanged);
		this.viewPanel.bindFromToChange(this.handleFromToChanged);




		this.view.bindMouseUp(this.handleMouseUp);//вешаем обработчик handleMouseUp для обработки в view события отпускания кнопки (завершение перетаскивания ползунка)
		this.view.bindWindowResize(this.handleWindowReRendering);

		this.model.bindControlPosUpdated(this.handleOnControlPosUpdated);//Вызываем для обновления положения ползунка (обращение к view)
		this.model.bindprogressBarUpdated(this.handleOnprogressBarUpdated);//Вызываем для обновления положения ползунка (обращение к view)
		this.model.bindСontrolValueUpdated(this.handleOnСontrolValueUpdated);//Вызываем для обновления панели (обращение к view)

	}

	//вызываем метод GetControlData в модели
	handleGetControlData = (controlData: IControlElements) => {
		this.model.getControlData(controlData);
	}


	// вызываем метод computeControlPosFromEvent в модели
	handlecomputeControlPosFromEvent = (e: MouseEvent) => {
		this.model.computeControlPosFromEvent(e);
	}


	//вызываем метод updateСurrentControl в view
	handleOnprogressBarUpdated = (selectedPos: string,
		selectedWidth: string, conf: IConf) => {
		this.viewScale.updateProgressBar(selectedPos, selectedWidth, conf);
	}


	handleOnScaleMarksUpdated =
		(scaleMarks: { 'pos': number, 'text': number }[]) => {
			this.viewScale.updateScaleMarks(scaleMarks, this.conf);
		}

	//вызываем метод updateСurrentControl в view
	handleOnControlPosUpdated = (elem: HTMLElement, newPos: number) => {
		this.viewDoubleControl.updateControlPos(elem, newPos);
	}


	handleIsVerticalChecked = () => {
		this.conf.vertical = true;
		this.viewDoubleControl.updateVerticalMode(true);
		this.handleWindowReRendering();
	}

	handleIsVerticalNotChecked = () => {
		this.conf.vertical = false;
		this.viewDoubleControl.updateVerticalMode(false);
		this.handleWindowReRendering();
	}


	handleIsRangeChecked = (e: MouseEvent) => {
		this.conf.range = true;
		this.viewDoubleControl.updateRangeMode(true);
		this.model.computeControlPosFromEvent(e);

	}

	handleIsRangeNotChecked = (e: MouseEvent) => {
		this.conf.range = false;
		this.viewDoubleControl.updateRangeMode(false);
		this.model.computeControlPosFromEvent(e);
	}


	handleIsScaleChecked = () => {
		this.conf.scale = true;
		this.viewScale.updateScaleMode(true);
	}

	handleIsScaleNotChecked = () => {
		this.conf.scale = false;
		this.viewScale.updateScaleMode(false);
	}

	handleIsBarChecked = () => {
		this.conf.bar = true;
		this.viewScale.updateBarMode(true);
	}

	handleIsBarNotChecked = () => {
		this.conf.bar = false;
		this.viewScale.updateBarMode(false);
	}



	handleIsTipChecked = () => {
		this.conf.tip = true;
		this.viewDoubleControl.updateTipMode(true);
	}

	handleIsTipNotChecked = () => {

		this.conf.tip = false;
		this.viewDoubleControl.updateTipMode(false);
	}

	handleFromToChanged = (val: string, e: Event) => {
		const target = e.target as HTMLElement;

		if (target.classList.contains('rs__input-from')) {
			console.log('FROM');
			this.conf.from = parseInt(val);
			this.model.computeControlPosFromVal(parseInt(val),
				false, this.viewDoubleControl.leftControl);
			this.viewDoubleControl.updateTipVal(val, true);
		} else {
			console.log('TO');
			this.conf.to = parseInt(val);
			this.model.computeControlPosFromVal(parseInt(val),
				false, this.viewDoubleControl.rightControl);
			this.viewDoubleControl.updateTipVal(val, false);
		}
	}


	//вызываем метод updateСurrentControl в view
	handleOnСontrolValueUpdated = (elem: HTMLElement, newValue: string) => {
		elem.classList.contains('rs__control-min') ?
			this.conf.from = parseInt(newValue) :
			this.conf.to = parseInt(newValue);
		this.viewPanel.updateFromTo(elem, newValue);
		elem.classList.contains('rs__control-min') ?
			this.viewDoubleControl.updateTipVal(newValue, true) :
			this.viewDoubleControl.updateTipVal(newValue, false);
	}

	handleMinMaxChanged = (val: string, e: Event) => {
		const target = e.target as HTMLElement;

		if (target.classList.contains('rs__input-min')) {

			this.conf.min = parseInt(val);
			this.model.computeControlPosFromVal(parseInt(val), false,
				this.viewDoubleControl.leftControl);
			this.viewDoubleControl.updateTipVal(val, true);
		} else if (target.classList.contains('rs__input-max')) {

			this.conf.max = parseInt(val);
			this.model.computeControlPosFromVal(parseInt(val), false,
				this.viewDoubleControl.rightControl);
			this.viewDoubleControl.updateTipVal(val, false);
		}

		this.handleWindowReRendering();
	}

	handleStepChanged = (val: string) => {
		this.conf.step = parseInt(val);
		//	console.log(this.conf);
		this.model.computeScaleMarks(this.conf);
		this.handleOnScaleMarksUpdated(this.model.marksArr);
	}



	// снимаем обработчики, повешенные на событие перемещения мыши
	handleMouseUp = () => {
		document.removeEventListener('mousemove',
			this.handlecomputeControlPosFromEvent);
		//	document.removeEventListener('mouseup', this.handleMouseUp);
		// document.removeEventListener('touchmove',
		// 	this.handlecomputeControlPosFromEvent);
		//	document.removeEventListener('touchend', this.handleMouseUp);
	}


	handleWindowReRendering = () => {
		this.view.deleteSlider();
		this.render();
		this.init();
	};
}

let root = '.rs__wrapper';

let conf = {
	min: 1,
	max: 10,
	from: 2,
	to: 7,
	step: 1,
	vertical: false
};

new sliderController(conf, root,
	new sliderView(root),
	new sliderViewScale(root),
	new sliderViewDoubleControl(root),
	new sliderViewPanel(root),
	new sliderModel(),
);


