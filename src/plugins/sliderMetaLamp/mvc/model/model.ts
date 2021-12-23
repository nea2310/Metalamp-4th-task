import {
	IConf,
	IObj,
	Imethods,
	Idata
} from './../interface';
import { Observer } from '../observer';

class Model extends Observer {
	private changeMode: boolean;
	public conf: IConf;
	private startConf: IConf;
	private backEndConf: IConf;
	private methods: Imethods;
	private data: Idata;
	private onStart?: Function | null;
	private onUpdate?: Function | null;
	private onChange?: Function | null;
	private noCalVal: boolean;

	constructor(conf: IConf) {
		super();
		//дефолтный конфиг
		this.conf = {
			min: 0,
			max: 0,
			from: 0,
			to: 0,
			vertical: false,
			range: true,
			bar: true,
			tip: true,
			scale: true,
			scaleBase: 'step',
			step: 0,
			interval: 0,
			sticky: false,
			shiftOnKeyDown: 0,
			shiftOnKeyHold: 0,
			onStart: null, // null?
			onChange: null,
			onUpdate: null,
		};

		this.data = {};

		this.methods = {
			calcFromPosition: false,
			calcToPosition: false,
			calcScale: false,
			calcBar: false,
			switchVertical: false,
			switchRange: false,
			switchScale: false,
			switchBar: false,
			switchTip: false,
			updateControlPos: false,
		};
		this.startConf = conf;
		this.noCalVal = false;
	}
	public getConf(conf: IConf) {
		this.backEndConf = conf;
		let joinedConf = {};
		joinedConf = Object.assign(joinedConf,
			this.conf, this.startConf, this.backEndConf);
		//проверим корректность полученных параметров конфигурации и при необходимости - исправим
		return this.conf = this.checkConf(joinedConf);
	}

	public start() {
		this.onStart = this.conf.onStart;
		this.onUpdate = this.conf.onUpdate;
		this.onChange = this.conf.onChange;
		this.calcScale();
		this.calcFromPosition();
		this.calcToPosition();
		this.calcBar();
		if (typeof this.onStart == 'function') {
			this.onStart(this.conf);
		}
		//console.log(this.data);
	}

	public getData() {
		//	if (typeof this.onStart == 'function') {
		//this.onStart(this.conf);
		return this.conf;
		//	}
	}

	//Рассчитываем положение ползунка при возникновении события перетягивания ползунка или щелчка по шкале
	public calcPos(type: string = 'pointerevent',
		clientY: number,
		clientX: number,
		top: number,
		left: number,
		width: number,
		height: number,
		shiftBase: number,
		moovingControl: string) {

		let newPos = 0;
		if (this.conf.vertical) {
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

		/* если ползунок должен вставать на позицию ближайшего к нему деления шкалы - скорректировать значение newPos (переместить ползунок 
		к ближайшему делению шкалы) */
		if (this.conf.sticky) {
			newPos = this.setSticky(newPos);
		}

		let isStop = false;
		//запрещаем ползункам выходить за границы слайдера
		if (newPos < 0) {
			isStop = true;
			this.calcVal('min', 0, moovingControl);
			return 'newPos < 0';
		}
		if (newPos > 100) {
			isStop = true;
			this.calcVal('max', 0, moovingControl);
			return 'newPos > 100';
		}

		/*запрещаем ползункам перепрыгивать друг через друга, если это не single режим*/
		if (this.conf.range) {
			if (moovingControl == 'min') {//двигается min ползунок
				if (newPos > this.data.toPos) {
					isStop = true;
					this.calcVal('meetMax', 0, moovingControl);
					return 'newPos > toPos';
				}
			}
			if (moovingControl == 'max') {//двигается max ползунок
				if (newPos < this.data.fromPos) {
					isStop = true;
					this.calcVal('meetMin', 0, moovingControl);
					return 'newPos < fromPos';
				}
			}
		}

		if (moovingControl == 'min') {
			this.data.fromPos = newPos;
			this.fire('FromPosition', this.data, this.conf);
		} else {
			this.data.toPos = newPos;
			this.fire('ToPosition', this.data, this.conf);
		}
		if (!isStop)
			this.calcVal('normal', newPos, moovingControl);

		this.calcBar();
		if (typeof this.onChange == 'function') {
			this.onChange(this.conf);
		}

		return newPos;


	}


	// Рассчитывает значение ползунка при нажатии кнопки стрелки на сфокусированном ползунке
	public calcPosKey(key: string, repeat: boolean, moovingControl: string) {
		// поменять позицию и значение FROM
		let changeFrom = (item: IObj) => {
			this.conf.from = item.val;
			this.data.fromPos = item.pos;
			this.data.fromVal = String(item.val);
			this.fire('FromPosition', this.data);
			this.fire('FromValue', this.data);

			return { newVal: String(item.val), newPos: item.pos };
		};
		// поменять позицию и значение TO
		let changeTo = (item: IObj) => {
			this.conf.to = item.val;
			this.data.toPos = item.pos;
			this.data.toVal = String(item.val);
			this.fire('ToPosition', this.data);
			this.fire('ToValue', this.data);
			return { newVal: String(item.val), newPos: item.pos };
		};
		// движение в большую сторону
		let incr = (index: number) => {
			if (repeat) {
				return this.data.marksArr[index +
					this.conf.shiftOnKeyHold];
			} else {
				return this.data.marksArr[index +
					this.conf.shiftOnKeyDown];
			}
		};
		// движение в меньшую сторону
		let decr = (index: number) => {
			if (repeat) {
				return this.data.marksArr[index -
					this.conf.shiftOnKeyHold];
			} else {
				return this.data.marksArr[index -
					this.conf.shiftOnKeyDown];
			}
		};


		let newVal;
		let item;
		let result;
		if (!this.conf.sticky) {	// если ползунок НЕ должен вставать на позицию ближайшего к нему деления шкалы
			this.noCalVal = true;
			if (moovingControl == 'min') {// Ползунок min
				if (key == 'ArrowRight' || key == 'ArrowUp') {//Увеличение значения
					/*проверяем, что FROM не стал больше TO или MAX*/
					const belowMaxRange = this.conf.range && this.conf.from <
						this.conf.to;
					const belowMaxNoRange = !this.conf.range &&
						this.conf.from < this.conf.max;
					const aboveMaxRange = this.conf.range &&
						this.conf.from >= this.conf.to;
					const aboveMaxNoRange = !this.conf.range &&
						this.conf.from >= this.conf.max;

					if (belowMaxRange || belowMaxNoRange) {
						newVal = repeat ?
							this.conf.from +
							this.conf.shiftOnKeyHold :
							this.conf.from +
							this.conf.shiftOnKeyDown;
						if (this.conf.range && newVal > this.conf.to) {
							newVal = this.conf.to;
						}
						if (!this.conf.range && newVal > this.conf.max) {
							newVal = this.conf.max;
						}
					}
					if (aboveMaxRange) {
						newVal = this.conf.to;
					}
					if (aboveMaxNoRange) {
						newVal = this.conf.max;
					}
				}
				else {// Уменьшение значения
					if (this.conf.from > this.conf.min) {
						newVal = repeat ?
							this.conf.from -
							this.conf.shiftOnKeyHold :
							this.conf.from -
							this.conf.shiftOnKeyDown;
						if (newVal < this.conf.min) {
							newVal = this.conf.min;
						}
					} else {
						newVal = this.conf.min;
					}
				}

				this.data.fromVal = String(newVal);
				this.conf.from = newVal;
				this.calcFromPosition();
				this.fire('FromValue', this.data);
				result = newVal;

			} else {// Ползунок max
				if (key == 'ArrowRight' || key == 'ArrowUp') {//Увеличение значения
					if (this.conf.to < this.conf.max) {

						newVal = repeat ?
							this.conf.to +
							this.conf.shiftOnKeyHold :
							this.conf.to +
							this.conf.shiftOnKeyDown;
						if (newVal > this.conf.max) {
							newVal = this.conf.max;
						}
					} else newVal = this.conf.max;
				} else {// Уменьшение значения
					if (this.conf.to > this.conf.from) {
						newVal = repeat ?
							this.conf.to -
							this.conf.shiftOnKeyHold :
							this.conf.to -
							this.conf.shiftOnKeyDown;
						if (newVal < this.conf.from) {
							newVal = this.conf.from;
						}
					} else newVal = this.conf.from;
				}
				this.data.toVal = String(newVal);
				this.conf.to = newVal;
				this.calcToPosition();
				this.fire('ToValue', this.data);
				result = newVal;
			}
			this.noCalVal = false; // ??
		}

		// если ползунок должен вставать на позицию ближайшего к нему деления шкалы
		else {
			if (moovingControl == 'min') {// ползунок min
				let index = this.data.marksArr.
					findIndex(item => item.val == this.conf.from);
				if (key == 'ArrowRight' || key == 'ArrowUp') {//Увеличение значения
					item = incr(index);
					if (item == undefined) return 'newPos>100';
					else if (item.val > this.conf.from &&
						(this.conf.range && item.val <= this.conf.to
							|| !this.conf.range && item.val <=
							this.conf.max)) {
						result = changeFrom(item);
					}
					else result = 'too big newPos';
				} else {//Уменьшение значения
					item = decr(index);
					if (item == undefined) return 'newPos<0';

					else if (this.conf.range && item.val < this.conf.to ||
						!this.conf.range) {
						result = changeFrom(item);
					}
					else result = 'too small newPos';
				}

			} else {// ползунок max
				let index = this.data.marksArr.
					findIndex(item => item.val == this.conf.to);
				if (key == 'ArrowRight' || key == 'ArrowUp') {//Увеличение значения
					item = incr(index);
					if (item == undefined) return 'newPos>100';
					else if (item && item.val > this.conf.to &&
						this.conf.to < this.conf.max) {
						result = changeTo(item);
					}
					else result = 'too big newPos';
				} else {//Уменьшение значения
					item = decr(index);
					if (item == undefined) return 'newPos<0';
					else if (item.val >= this.conf.from &&
						this.conf.to > this.conf.from) {
						result = changeTo(item);
					}
					else result = 'too small newPos';
				}
			}
		}
		this.calcBar();
		if (typeof this.onChange == 'function') {
			this.onChange(this.conf);
		}
		return result;
	}

	private checkConf(conf: IConf) {
		//надо проверять на число те параметры, которые вводятся в инпут (т.к. можно ввести строку)

		const validNumber =
			(value: any) => //typeof +value == 'number' ? +value : 0;
			{
				let result = 0;
				if (!isNaN(+value)) {
					result = +value;
				}
				return result;
			};

		const validBoolean = (value: any) => {
			let result = false;
			if (value == true || value == 'true') {
				result = true;
			}
			return result;
		};

		// console.log('conf.min before validation: ');
		// console.log(conf.min);
		conf.min = validNumber(conf.min);
		// console.log('conf.min after validation: ');
		// console.log(conf.min);

		conf.max = validNumber(conf.max);
		conf.from = validNumber(conf.from);
		conf.to = validNumber(conf.to);
		conf.step = validNumber(conf.step);
		conf.interval = validNumber(conf.interval);
		conf.shiftOnKeyDown = validNumber(conf.shiftOnKeyDown);
		conf.shiftOnKeyHold = validNumber(conf.shiftOnKeyHold);

		conf.vertical = validBoolean(conf.vertical);
		conf.range = validBoolean(conf.range);
		conf.sticky = validBoolean(conf.sticky);
		conf.scale = validBoolean(conf.scale);
		conf.bar = validBoolean(conf.bar);
		conf.tip = validBoolean(conf.tip);


		if (conf.scaleBase != 'step' && conf.scaleBase != 'interval') {
			conf.scaleBase = 'step';
			//console.log('0');
		}

		if (conf.shiftOnKeyDown <= 0) {
			conf.shiftOnKeyDown = 1;
			//console.log('1');

		}
		if (conf.shiftOnKeyHold <= 0) {
			conf.shiftOnKeyHold = 1;
			//	console.log('2');
		}

		if (conf.max <= conf.min) {
			conf.max = conf.min + 10;
			conf.from = conf.min;
			conf.to = conf.max;
			//console.log('3');
		}
		if (conf.from < conf.min) {
			conf.from = conf.min;
			//console.log('4');
		}

		if (conf.to < conf.min) {
			conf.to = conf.from;
			//console.log('5');
		}
		if (!conf.range && conf.to > conf.max) {
			conf.to = conf.from;
			//console.log('6');
		}

		if (conf.range && conf.to > conf.max) {
			conf.to = conf.max;
			//console.log('7');
		}
		if (conf.range && conf.from > conf.max) {
			conf.from = conf.to;
			//console.log('8');
		}

		if (!conf.range && conf.from > conf.max) {
			conf.from = conf.max;
			//console.log('8');
		}
		if (conf.range && conf.from > conf.to) {
			conf.from = conf.min;
			//console.log('9');
		}

		if (conf.step <= 0) {
			conf.step = (conf.max - conf.min) / 2;
		}
		if (conf.interval <= 0) {
			conf.interval = 2;
		}
		return conf;
	}

	public update(newConf: IConf) {


		let conf = {};
		conf = Object.assign(conf, this.conf, newConf);
		//проверим корректность полученных параметров конфигурации и при необходимости - исправим
		conf = this.checkConf(conf);
		//определим, какие параметры изменились, и какие методы в модели надо вызвать для пересчета значений
		//для этого сравним this.conf (текущая конфигурация) и conf (новая конфигурация)
		this.findChangedConf(this.conf, conf);
		this.conf = conf;
		//запустим методы, для которых есть изменившиеся параметры
		let key: keyof Imethods;
		for (key in this.methods) {
			if (this.methods[key]) {
				let method = `this.${key}()`;
				eval(method);
			}
		}
		if (typeof this.onUpdate == 'function') {
			this.onUpdate(this.conf);
		}
		//вернем исходные значения (false)
		for (key in this.methods) {
			if (this.methods[key]) {
				this.methods[key] = false;
			}
		}
		this.noCalVal = false;

		return Object.assign(this.conf, this.data);
	}
	/*находим изменившийся параметр и меняем соотв-щее св-во объекта this.methods; это нужно чтобы не выполнять одни и те же 
	действия несколько раз, если получаем несколько параметров, требующих запуска одного и того же метода в модели*/
	private findChangedConf(conf: IConf, newConf: IConf) {
		// console.log(conf);
		// console.log(newConf);
		let key: keyof IConf;
		for (key in newConf) {
			if (newConf[key] === conf[key]) {
				continue;
			} else {
				switch (key) {
					case 'min':
						this.noCalVal = false;
						this.methods.calcScale = true;
						this.methods.calcFromPosition = true;
						this.methods.calcToPosition = true;
						this.methods.calcBar = true;
						break;
					case 'max':
						this.noCalVal = false;
						this.methods.calcScale = true;
						this.methods.calcFromPosition = true;
						this.methods.calcToPosition = true;
						this.methods.calcBar = true;
						//console.log(this.data);
						break;
					case 'from':
						this.methods.calcFromPosition = true;
						this.methods.calcBar = true;
						break;
					case 'to':
						this.methods.calcToPosition = true;
						this.methods.calcBar = true;
						break;
					case 'step':
						this.methods.calcScale = true;
						this.methods.updateControlPos = true;
						//console.log(this.data);
						break;
					case 'interval':
						this.methods.calcScale = true;
						this.methods.updateControlPos = true;
						break;
					case 'scaleBase':
						this.methods.calcScale = true;
						break;
					case 'vertical':
						this.methods.switchVertical = true;
						//(this.data);
						break;
					case 'range':
						this.methods.switchRange = true;
						break;
					case 'scale':
						this.methods.switchScale = true;
						break;
					case 'bar':
						this.methods.switchBar = true;
						break;
					case 'tip':
						this.methods.switchTip = true;
						break;
					case 'sticky':
						this.methods.updateControlPos = true;
						break;
					case 'onStart':
						this.conf.onStart = newConf.onStart;
						this.onStart = newConf.onStart;
						break;
					case 'onChange':
						this.conf.onChange = newConf.onChange;
						this.onChange = newConf.onChange;
						break;
					case 'onUpdate':
						this.conf.onUpdate = newConf.onUpdate;
						this.onUpdate = newConf.onUpdate;
						break;
				}
			}
		}
		//	console.log(this.conf);
		return this.methods;
	}


	private async switchVertical() {
		await this.fire('IsVertical', this.data, this.conf);
		await this.calcFromPosition();
		await this.calcToPosition();
		await this.calcBar();
		await this.calcScale();
	}

	private async switchRange() {
		await this.fire('IsRange', this.data, this.conf);
		await this.calcBar(); // ???
		if (typeof this.onChange == 'function') {
			await this.onChange(this.conf);
		} // onChange нужен т.к. после проверки перед возвратом в double режим могут поменяться значения from / to, их нужно отдать наружу
	}

	private async updateControlPos() {
		await this.calcFromPosition();
		await this.calcToPosition();
		await this.calcBar();
		if (typeof this.onChange == 'function') {
			await this.onChange(this.conf);
		} // onChange нужен т.к. после проверки  могут поменяться значения from / to / min / max, их нужно отдать наружу
		await this.fire('IsSticky', this.data, this.conf);
	}

	private switchScale() {
		this.fire('IsScale', this.data, this.conf);
	}

	private switchBar() {
		this.fire('IsBar', this.data, this.conf);
	}

	private switchTip() {
		this.fire('IsTip', this.data, this.conf);
	}
	// корректирует позицию ползунка, устанавливает его на ближайшее деление шкалы при sticky режиме
	private setSticky(controlPos: number) {
		/*Перебираем массив с позициями и значениями делений шкалы и вычитаем позицию деления из значения newPos 
	до тех пор, пока результат текущей итерации не станет больше результата предыдущей (это значит, что мы нашли деление,
	ближайшее к позиции ползунка и ползунок надо переместить на позицию этого деления*/
		let pos = 0;
		for (let i = 0; i < this.data.marksArr.length; i++) {
			let a = 0;
			if (i < this.data.marksArr.length - 1) {
				a = this.data.marksArr[i + 1].pos;
			}
			if (Math.abs(controlPos - this.data.marksArr[i].pos) <
				Math.abs(controlPos - a)) {
				pos = this.data.marksArr[i].pos;
				break;
			}
		}
		return pos;
	}
	// рассчитать позицию From (%) на основании значений from, min и max
	private calcFromPosition() {
		//console.log('calcFromPosition');

		this.data.fromPos = ((this.conf.from -
			this.conf.min) * 100) /
			(this.conf.max - this.conf.min);

		/* если ползунок должен вставать на позицию ближайшего к нему деления шкалы - скорректировать значение newPos (переместить ползунок 
		к ближайшему делению шкалы) */
		if (this.conf.sticky) {
			this.data.fromPos = this.setSticky(this.data.fromPos);
		}
		if (!this.noCalVal) {
			this.calcVal('normal', this.data.fromPos, 'min');
		}
		this.fire('FromPosition', this.data, this.conf);
		//	this.noCalVal = false;
	}
	// рассчитать позицию To (%) на основании значений to, min и max
	private calcToPosition() {
		this.data.toPos = ((this.conf.to - this.conf.min) * 100) /
			(this.conf.max - this.conf.min);
		if (this.conf.sticky) {
			this.data.toPos = this.setSticky(this.data.toPos);
		}
		if (!this.noCalVal) {
			this.calcVal('normal', this.data.toPos, 'max');
		}
		this.fire('ToPosition', this.data, this.conf);
	}



	/*Рассчитываем ширину и позицию left (top) прогресс-бара*/
	private calcBar() {
		if (this.conf.range) {//режим Double
			this.data.barPos = this.data.fromPos;
			this.data.barWidth = this.data.toPos -
				this.data.fromPos;
		} else {//режим Single
			this.data.barPos = 0;
			this.data.barWidth = this.data.fromPos;
		}
		this.fire('Bar', this.data, this.conf);
	}


	// рассчитываем деления шкалы (создаем массив объектов {значение:, позиция:})
	private calcScale() {
		let interval = 1;
		let step = 1;
		let arg = '';
		if (this.conf.scaleBase == 'step') {//если рассчитываем шкалу на основе кол-ва шагов
			step = this.conf.step; // находим длину шага
			interval = (this.conf.max - this.conf.min) / step; // находим кол-во интервалов
			arg = interval % 1 === 0 ? String(interval) :
				String(Math.trunc(interval + 1));
			this.data.scaleBase = 'step';
			this.data.intervalValue = arg;
			this.data.stepValue = String(this.conf.step);
			this.conf.interval = parseFloat(arg);
		}

		if (this.conf.scaleBase == 'interval') {//если рассчитываем шкалу на основе интервалов
			interval = this.conf.interval; // находим кол-во интервалов
			step = (this.conf.max - this.conf.min) / interval;// находим ширину (кол-во единиц) в шаге
			let arg = step % 1 === 0 ? String(step) :
				String(step.toFixed(2));
			this.data.scaleBase = 'interval';
			this.data.intervalValue = String(interval);
			this.data.stepValue = arg;
			this.conf.step = parseFloat(arg);
		}

		this.data.marksArr = [{ val: this.conf.min, pos: 0 }]; //первое деление всегда стоит на позиции left = 0% и его значение равно this.conf.min
		let val = this.conf.min;

		for (let i = 0; i < interval; i++) {
			let obj: IObj = {};
			val += step;
			// console.log(val);
			// console.log(step);

			if (val <= this.conf.max) {
				let pos = ((val - this.conf.min) * 100) /
					(this.conf.max - this.conf.min);

				obj.val = parseFloat(val.toFixed(2));
				obj.pos = pos;
				this.data.marksArr.push(obj);
			}
		}
		if (this.data.marksArr[this.data.marksArr.length - 1].val <
			this.conf.max) { // если длина шкалы не кратна длине шага
			this.data.marksArr.push({ val: this.conf.max, pos: 100 });//последнее деление ставим на позицию left = 100% и его значение равно this.conf.max
		}
		this.fire('Scale', this.data, this.conf);
	}

	private calcVal(stopType: string,
		pos: number,
		moovingControl: string) {
		if (!this.changeMode) {
			let newVal = '';
			if (stopType == 'normal') {
				newVal = (this.conf.min + ((this.conf.max -
					this.conf.min) * pos) / 100).toFixed(0);

			} else if (stopType == 'min') {
				newVal = String(this.conf.min);
			} else if (stopType == 'max') {
				newVal = String(this.conf.max);
			}
			else if (stopType == 'meetMax') {
				newVal = String(this.conf.to);
			}
			else if (stopType == 'meetMin') {
				newVal = String(this.conf.from);
			}
			if (moovingControl == 'min') {
				this.data.fromVal = newVal;
				this.conf.from = parseFloat(newVal);
				this.fire('FromValue', this.data);
			} else {
				this.data.toVal = newVal;
				this.conf.to = parseFloat(newVal);
				this.fire('ToValue', this.data);
			}
		}
	}
}

export { Model };
