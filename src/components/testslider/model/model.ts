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
						this.$methods.$calcBar = true;
						break;
					case 'to':
						this.$methods.$calcToPosition = true;
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
		console.log(this);

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
		if (this.$conf.range) {//режим Double
			this.$data.$barPos = this.$data.$fromPos;
			this.$data.$barWidth = this.$data.$toPos -
				this.$data.$fromPos;
		} else {//режим Single
			this.$data.$barPos = 0;
			this.$data.$barWidth = this.$data.$fromPos;
		}
		this.fire('Bar', this.$data, this.$conf);
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
			this.$calcVal('min', 0, moovingControl);
			return;
		}
		if (newPos > 100) {
			isStop = true;
			this.$calcVal('max', 0, moovingControl);
			return;
		}

		/*запрещаем ползункам перепрыгивать друг через друга, если это не single режим*/
		if (this.$conf.range) {
			if (moovingControl == 'min') {//двигается min ползунок
				if (newPos >= this.$data.$toPos) {
					isStop = true;
					this.$calcVal('meetMax', 0, moovingControl);
					return;
				}
			}
			if (moovingControl == 'max') {//двигается max ползунок
				if (newPos <= this.$data.$fromPos) {
					isStop = true;
					this.$calcVal('meetMin', 0, moovingControl);
					return;
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
		if (!isStop)
			this.$calcVal('normal', newPos, moovingControl);
	}



	$calcPosKey(key: string, repeat: boolean, moovingControl: string) {
		let newVal = 0;
		//	if (e.type == 'keydown') {//если нажали стрелку на сфокусированном ползунке
		if (!this.$conf.sticky) {	// если ползунок НЕ должен вставать на позицию ближайшего к нему деления шкалы
			if (moovingControl == 'min') {// Ползунок min
				if (key == 'ArrowRight' || key == 'ArrowUp') {//Увеличение значения
					if (this.$conf.range) { // режим Double
						if (this.$conf.from < this.$conf.to) {
							newVal = repeat ?
								this.$conf.from +
								this.$conf.shiftOnKeyHold :
								this.$conf.from +
								this.$conf.shiftOnKeyDown;
							this.$conf.from = newVal;
							this.$calcFromPosition();


						}
					} else {// режим Single
						if (this.$conf.from < this.$conf.max) {
							newVal = repeat ?
								this.$conf.from +
								this.$conf.shiftOnKeyHold :
								this.$conf.from +
								this.$conf.shiftOnKeyDown;
							this.$conf.from = newVal;
							this.$calcFromPosition();
						}
					}
				} else {// Уменьшение значения
					if (this.$conf.from > this.$conf.min) {
						newVal = repeat ?
							this.$conf.from -
							this.$conf.shiftOnKeyHold :
							this.$conf.from -
							this.$conf.shiftOnKeyDown;
						this.$conf.from = newVal;
						this.$calcFromPosition();
					}
				}

				this.$data.$fromVal = String(newVal);
				this.$conf.from = newVal;
				this.fire('FromValue', this.$data);

			} else {// Ползунок max
				if (key == 'ArrowRight' || key == 'ArrowUp') {//Увеличение значения
					if (this.$conf.to < this.$conf.max) {

						newVal = repeat ?
							this.$conf.to +
							this.$conf.shiftOnKeyHold :
							this.$conf.to +
							this.$conf.shiftOnKeyDown;
						this.$conf.to = newVal;
						this.$calcToPosition();
					}
				} else {// Уменьшение значения
					if (this.$conf.to > this.$conf.from) {
						newVal = repeat ?
							this.$conf.to -
							this.$conf.shiftOnKeyHold :
							this.$conf.to -
							this.$conf.shiftOnKeyDown;
						this.$conf.to = newVal;
						this.$calcToPosition();
					}
				}
				this.$data.$toVal = String(newVal);
				this.$conf.to = newVal;
				this.fire('ToValue', this.$data);
			}
		}

		// если ползунок должен вставать на позицию ближайшего к нему деления шкалы
		else {
			if (moovingControl == 'min') {// ползунок min
				if (key == 'ArrowRight' || key == 'ArrowUp') {//Увеличение значения
					for (let i = 0; i < this.$data.$marksArr.length; i++) {
						if (this.$data.$marksArr[i].val -
							this.$conf.from > 0) {
							repeat ?
								newVal = this.$data.$marksArr[i +
									this.$conf.shiftOnKeyHold - 1].val :
								newVal = this.$data.$marksArr[i +
									this.$conf.shiftOnKeyDown - 1].val;
							break;
						}
					}
					if (newVal > this.$conf.from &&
						(!this.controlMax.classList.
							contains('hidden') && newVal <= this.$conf.to
							|| this.controlMax.classList.
								contains('hidden') && newVal <=
							this.$conf.max))

						this.$conf.from = newVal;
					this.$calcFromPosition();

				} else {//Уменьшение значения
					for (let i = this.$data.$marksArr.length - 1;
						i >= 0; i--) {
						if (this.$conf.from > this.$data.$marksArr[i].val) {
							repeat ?
								newVal = this.$data.$marksArr[i -
									this.$conf.shiftOnKeyHold + 1].val :
								newVal = this.$data.$marksArr[i -
									this.$conf.shiftOnKeyDown + 1].val;
							break;
							//}
						}
					}
					if (newVal < this.$conf.from &&
						this.$conf.from > this.$conf.min) {
						this.$conf.from = newVal;
						this.$calcFromPosition();
					}
				}
				this.$data.$fromVal = String(newVal);
				this.$conf.from = newVal;
				this.fire('FromValue', this.$data);

			} else {// ползунок max
				if (key == 'ArrowRight' || key == 'ArrowUp') {//Увеличение значения
					for (let i = 0; i < this.$data.$marksArr.length; i++) {
						if (this.$data.$marksArr[i].val -
							this.$conf.to > 0) {
							repeat ?
								newVal = this.$data.$marksArr[i +
									this.$conf.shiftOnKeyHold - 1].val :
								newVal = this.$data.$marksArr[i +
									this.$conf.shiftOnKeyDown - 1].val;
							break;
						}
					}
					if (newVal > this.$conf.to &&
						this.$conf.to < this.$conf.max) {
						this.$conf.to = newVal;
						this.$calcToPosition();
					}
				} else {//Уменьшение значения
					for (let i = this.$data.$marksArr.length - 1;
						i > 0; i--) {
						if (this.$conf.to > this.$data.$marksArr[i].val) {
							//	if (this.$conf.to > this.$conf.from) {
							repeat ?
								newVal = this.$data.$marksArr[i -
									this.$conf.shiftOnKeyHold + 1].val :
								newVal = this.$data.$marksArr[i -
									this.$conf.shiftOnKeyDown + 1].val;
							break;
						}
					}
					if (newVal >= this.$conf.from &&
						this.$conf.to > this.$conf.from) {
						this.$conf.to = newVal;
						this.$calcToPosition();
					}
				}
				this.$data.$toVal = String(newVal);
				this.$conf.to = newVal;
				this.fire('ToValue', this.$data);
			}
		}
	}

	/*Рассчитываем новое значение ползунка*/

	$calcVal(stopType: string,
		pos: number,
		moovingControl: string) {
		if (!this.changeMode) {
			let newVal = '';
			if (stopType == 'normal') {
				newVal = (this.$conf.min + ((this.$conf.max -
					this.$conf.min) * pos) / 100).toFixed(0);
				//				this.computeProgressBar('handleMovement'); // рассчитываем прогресс-бар
				this.$calcBar();

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
				this.$conf.from = parseFloat(newVal);
				this.fire('FromValue', this.$data);
			} else {
				this.$data.$toVal = newVal;
				this.$conf.to = parseFloat(newVal);
				this.fire('ToValue', this.$data);
			}
		}
		console.log(this);
	}

	/*Если во время single режима меньший ползунок зашел за позицию большего (т.е. from стало больше to) - 
	при возвращении в double режим поменять ползунки местами */
	adjustControlPos() {
		//Поменять местами min и max в конфигурации
		let temp = this.$conf.from;
		this.$conf.from = this.$conf.to;
		this.$conf.to = temp;

		//Установить меньший ползунок на позицию min, а больший на позицию max
		this.$calcFromPosition();
		this.$calcToPosition();
		//Поменять местами подписи ползунков
		this.$data.$fromVal = String(this.$conf.from);
		this.$data.$toVal = String(this.$conf.to);

		this.fire('FromValue', this.$data);
		this.fire('ToValue', this.$data);
	}
}

export { sliderModel };
