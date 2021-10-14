import {
	IConf,
	IObj,
	$Imethods,
	$Idata
} from './../../interface';
import { Observer } from '../../observer';


class sliderModel extends Observer {
	changeMode: boolean;
	$conf: IConf;
	$methods: $Imethods;
	$data: $Idata;

	constructor(conf: IConf) {
		super();
		//дефолтный конфиг
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
			vertical: false,
		};

		this.$data = {};

		this.$methods = {
			$calcFromPosition: false,
			$calcToPosition: false,
			$calcGrid: false,
			$calcBar: false,
		};
		this.$calc(conf, true);
	}

	$calc(newConf: IConf, isInit: boolean = false) {
		console.log('CALC');

		let conf = {};
		conf = Object.assign(conf, this.$conf, newConf);
		console.log(conf);

		//проверим корректность полученных параметров конфигурации
		let checkResult = this.$checkConf(conf);
		console.log(checkResult);
		if (checkResult) {

			//Если это первый запуск
			if (isInit) {
				this.$calcFromPosition();
				this.$calcToPosition();
				this.$calcGrid(null);
				this.$calcBar();
			} else {
				//определим, какие параметры изменились, и какие методы в модели надо вызвать для пересчета значений
				this.$findChangedConf(this.$conf, conf);
			}
			this.$conf = conf;
			if (!isInit) {


				//запустим методы, для которых есть изменившиеся параметры
				let key: keyof $Imethods;
				for (key in this.$methods) {
					if (this.$methods[key]) {
						let method = `this.${key}()`;
						eval(method);
						this.$methods[key] = false;
					}
				}
			}
		}
	}

	$checkConf(newConf: IConf) {
		if (newConf.range) { // режим Double
			console.log('newConf.min: ' + newConf.min);
			console.log('newConf.max: ' + newConf.max);
			console.log('newConf.from: ' + newConf.from);
			console.log('newConf.to: ' + newConf.to);

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
		console.log(this.$methods);

		return this.$methods;
	}
	// рассчитать позицию From (%) на основании значений from, min и max
	$calcFromPosition() {
		if (this.$conf.from != this.$conf.min) {
			if (this.$conf.vertical) {
				this.$data.$fromPos = ((this.$conf.from -
					this.$conf.min) * 100) /
					(this.$conf.max - this.$conf.min);
			} else { // ???
				this.$data.$fromPos = ((this.$conf.from -
					this.$conf.min) * 100) /
					(this.$conf.max - this.$conf.min);
			}
		}
		else {
			this.$data.$fromPos = 0.00001; // начальное положение ползунка на шкале, если min=from 
		}
		this.fire('FromPosition', this.$data);
	}
	// рассчитать позицию To (%) на основании значений to, min и max
	$calcToPosition() {
		this.$data.$toPos = ((this.$conf.to - this.$conf.min) * 100) /
			(this.$conf.max - this.$conf.min);
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


	// рассчитываем деления шкалы (создаем массив объектов {значение:, позиция:})
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
				((clientY - top) * 100 / height);  ///????

		} else {
			let shift = 0;
			if (type == 'pointermove') {
				shift = (shiftBase * 100) / width;
			}

			newPos =
				((clientX - left) * 100 / width) - shift;
		}

		/* если ползунок должен вставать на позицию ближайшего к нему деления шкалы - скорректировать значение newPos (переместить ползунок 
		к ближайшему делению шкалы) */
		if (this.$conf.sticky) {
			/*Перебираем массив с позициями и значениями делений шкалы и вычитаем позицию деления из значения newPos 
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

		this.$calcBar();
	}



	$calcPosKey(key: string, repeat: boolean, moovingControl: string) {
		// поменять позицию и значение FROM
		let changeFrom = (item: IObj) => {
			this.$conf.from = item.val;
			this.$data.$fromPos = item.pos;
			this.$data.$fromVal = String(item.val);
			this.fire('FromPosition', this.$data);
			this.fire('FromValue', this.$data);
		};
		// поменять позицию и значение TO
		let changeTo = (item: IObj) => {
			this.$conf.to = item.val;
			this.$data.$toPos = item.pos;
			this.$data.$toVal = String(item.val);
			this.fire('ToPosition', this.$data);
			this.fire('ToValue', this.$data);
		};
		// движение в большую сторону
		let incr = (index: number) => {
			if (repeat) {
				return this.$data.$marksArr[index +
					this.$conf.shiftOnKeyHold];
			} else {
				return this.$data.$marksArr[index +
					this.$conf.shiftOnKeyDown];
			}
		};
		// движение в меньшую сторону
		let decr = (index: number) => {
			if (repeat) {
				return this.$data.$marksArr[index -
					this.$conf.shiftOnKeyHold];
			} else {
				return this.$data.$marksArr[index -
					this.$conf.shiftOnKeyDown];
			}
		};


		let newVal;
		let item;
		if (!this.$conf.sticky) {	// если ползунок НЕ должен вставать на позицию ближайшего к нему деления шкалы
			if (moovingControl == 'min') {// Ползунок min
				if (key == 'ArrowRight' || key == 'ArrowUp') {//Увеличение значения
					if (this.$conf.range && this.$conf.from <
						this.$conf.to ||
						!this.$conf.range && this.$conf.from < this.$conf.max) {

						newVal = repeat ?
							this.$conf.from +
							this.$conf.shiftOnKeyHold :
							this.$conf.from +
							this.$conf.shiftOnKeyDown;

						if (this.$conf.range && newVal > this.$conf.to) {
							newVal = this.$conf.to;
						}
						if (!this.$conf.range && newVal > this.$conf.max) {
							newVal = this.$conf.max;
						}

					} else return;
				} else {// Уменьшение значения
					if (this.$conf.from > this.$conf.min) {
						newVal = repeat ?
							this.$conf.from -
							this.$conf.shiftOnKeyHold :
							this.$conf.from -
							this.$conf.shiftOnKeyDown;


						if (newVal < this.$conf.min) {
							newVal = this.$conf.min;
						}
					} else return;
				}

				this.$data.$fromVal = String(newVal);
				this.$conf.from = newVal;
				this.$calcFromPosition();
				this.fire('FromValue', this.$data);

			} else {// Ползунок max
				if (key == 'ArrowRight' || key == 'ArrowUp') {//Увеличение значения
					if (this.$conf.to < this.$conf.max) {

						newVal = repeat ?
							this.$conf.to +
							this.$conf.shiftOnKeyHold :
							this.$conf.to +
							this.$conf.shiftOnKeyDown;
						if (newVal > this.$conf.max) {
							newVal = this.$conf.max;
						}
					} else return;
				} else {// Уменьшение значения
					if (this.$conf.to > this.$conf.from) {
						newVal = repeat ?
							this.$conf.to -
							this.$conf.shiftOnKeyHold :
							this.$conf.to -
							this.$conf.shiftOnKeyDown;
						if (newVal < this.$conf.from) {
							newVal = this.$conf.from;
						}
					} else return;
				}
				this.$data.$toVal = String(newVal);
				this.$conf.to = newVal;
				this.$calcToPosition();
				this.fire('ToValue', this.$data);
			}
		}

		// если ползунок должен вставать на позицию ближайшего к нему деления шкалы
		else {
			if (moovingControl == 'min') {// ползунок min
				let index = this.$data.$marksArr.
					findIndex(item => item.val == this.$conf.from);
				if (key == 'ArrowRight' || key == 'ArrowUp') {//Увеличение значения
					item = incr(index);
					if (item.val > this.$conf.from &&
						(this.$conf.range && item.val <= this.$conf.to
							|| !this.$conf.range && item.val <=
							this.$conf.max)) {
						changeFrom(item);
					}
				} else {//Уменьшение значения
					item = decr(index);
					if (item.val < this.$conf.to) {
						changeFrom(item);
					}
				}

			} else {// ползунок max
				let index = this.$data.$marksArr.
					findIndex(item => item.val == this.$conf.to);
				if (key == 'ArrowRight' || key == 'ArrowUp') {//Увеличение значения
					item = incr(index);
					if (item && item.val > this.$conf.to &&
						this.$conf.to < this.$conf.max) {
						changeTo(item);
					}
				} else {//Уменьшение значения
					item = decr(index);
					if (item.val >= this.$conf.from &&
						this.$conf.to > this.$conf.from) {
						changeTo(item);
					}
				}
			}
		}
		this.$calcBar();
	}

	/*Рассчитываем новое значение ползунка на основании min, max и позиции (%)*/

	$calcVal(stopType: string,
		pos: number,
		moovingControl: string) {


		if (!this.changeMode) {
			let newVal = '';
			if (stopType == 'normal') {
				newVal = (this.$conf.min + ((this.$conf.max -
					this.$conf.min) * pos) / 100).toFixed(0);

			} else if (stopType == 'min') {
				newVal = String(this.$conf.min);
			} else if (stopType == 'max') {
				newVal = String(this.$conf.max);
			}
			else if (stopType == 'meetMax') {
				newVal = String(this.$conf.to);
			}
			else if (stopType == 'meetMin') {
				newVal = String(this.$conf.from);
			}
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
