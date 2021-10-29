import {
	IConf,
	IObj,
	Imethods,
	Idata
} from './../interface';
import { Observer } from '../observer';
import { isConstTypeReference } from 'typescript';


class sliderModel extends Observer {
	changeMode: boolean;
	conf: IConf;
	startConf: IConf;
	backEndConf: IConf;
	methods: Imethods;
	data: Idata;
	onStart?: Function;
	onUpdate?: Function;
	onChange?: Function;

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
			scaleBase: 'interval',
			step: 0,
			interval: 0,
			sticky: true,
			shiftOnKeyDown: 0,
			shiftOnKeyHold: 0,
			onStart: () => true,
			onChange: () => true,
			onUpdate: () => true,
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
	}
	getConf(conf: IConf) {
		this.backEndConf = conf;
		let joinedConf = {};
		joinedConf = Object.assign(joinedConf, this.conf, this.startConf, this.backEndConf);
		//проверим корректность полученных параметров конфигурации и при необходимости - исправим
		this.conf = this.checkConf(joinedConf);

	}

	start() {
		this.onStart = this.conf.onStart;
		this.onUpdate = this.conf.onUpdate;
		this.onChange = this.conf.onChange;

		this.calcScale();
		this.calcFromPosition();
		this.calcToPosition();
		this.calcBar();
		this.onStart(this.conf);

	}



	checkConf(conf: IConf) {
		//надо проверять на число те параметры, которые вводятся в инпут (т.к. можно ввести строку)

		const validType = (value: any) => Number.isNaN(value) ? 0 : value;

		conf.min = validType(conf.min);
		conf.max = validType(conf.max);
		conf.from = validType(conf.from);
		conf.to = validType(conf.to);
		conf.step = validType(conf.step);
		conf.interval = validType(conf.interval);
		conf.shiftOnKeyDown = validType(conf.shiftOnKeyDown);
		conf.shiftOnKeyHold = validType(conf.shiftOnKeyHold);


		if (conf.step <= 0) {
			conf.step = (conf.max - conf.min) / 2;
		}
		if (conf.interval <= 0) {
			conf.interval = 2;
		}
		if (conf.shiftOnKeyDown <= 0) {
			conf.shiftOnKeyDown = 1;
		}
		if (conf.shiftOnKeyHold <= 0) {
			conf.shiftOnKeyHold = 1;
		}

		if (conf.max <= conf.min) {
			conf.max = conf.min + 10;
			conf.from = conf.min;
			conf.to = conf.max;
		}
		if (conf.from < conf.min) {
			conf.from = conf.min
		}

		if (conf.to < conf.min) {
			conf.to = conf.from
		}
		if (!conf.range && conf.to > conf.max) {
			conf.to = conf.from
		}

		if (conf.range && conf.to > conf.max) {
			conf.to = conf.max
		}
		if (conf.from > conf.max) {
			conf.from = conf.to
		}
		if (conf.range && conf.from > conf.to) {
			conf.from = conf.min
		}
		return conf;
	}

	update(newConf: IConf) {
		let conf = {};
		conf = Object.assign(conf, this.conf, newConf);
		//проверим корректность полученных параметров конфигурации и при необходимости - исправим
		conf = this.checkConf(conf);
		//определим, какие параметры изменились, и какие методы в модели надо вызвать для пересчета значений
		this.$findChangedConf(this.conf, conf);
		this.conf = conf;
		console.log(this.conf);
		//запустим методы, для которых есть изменившиеся параметры
		let key: keyof Imethods;
		for (key in this.methods) {
			if (this.methods[key]) {
				let method = `this.${key}()`;
				eval(method);
			}
		}
		this.onUpdate(this.conf);
		//вернем исходные значения (false)
		for (key in this.methods) {
			if (this.methods[key]) {
				this.methods[key] = false;
			}
		}
	}
	/*находим изменившийся параметр и меняем соотв-щее св-во объекта this.methods; это нужно чтобы не выполнять одни и те же 
	действия несколько раз, если получаем несколько параметров, требующих запуска одного и того же метода в модели*/
	$findChangedConf(conf: IConf, newConf: IConf) {
		let key: keyof IConf;
		for (key in newConf) {
			if (newConf[key] === conf[key]) {
				continue;
			} else {
				switch (key) {
					case 'min':
						this.methods.calcScale = true;
						this.methods.calcFromPosition = true;
						this.methods.calcToPosition = true;
						this.methods.calcBar = true;
						break;
					case 'max':
						this.methods.calcScale = true;
						this.methods.calcFromPosition = true;
						this.methods.calcToPosition = true;
						this.methods.calcBar = true;
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
				}
			}
		}
		return this.methods;
	}


	switchVertical() {
		this.fire('IsVertical', this.data, this.conf);
		this.calcFromPosition();
		this.calcToPosition();
		this.calcBar();
		let calcScale = this.calcScale.bind(this);
		setTimeout(calcScale, 100); //нужна задержка, т.к. иначе в view ширина offsetWidth берется у не успевшего перестроиться элемента
	}



	switchRange() {
		this.fire('IsRange', this.data, this.conf);
		this.calcBar();
		this.onChange(this.conf)
	}

	updateControlPos() {
		this.calcFromPosition();
		this.calcToPosition();
		this.calcBar();
		this.onChange(this.conf)
		this.fire('IsSticky', this.data, this.conf);
	}

	switchScale() { //??
		this.fire('IsScale', this.data, this.conf);
	}

	switchBar() {
		this.fire('IsBar', this.data, this.conf);
	}

	switchTip() {
		this.fire('IsTip', this.data, this.conf);
	}

	setSticky(controlPos: number) {
		/*Перебираем массив с позициями и значениями делений шкалы и вычитаем позицию деления из значения newPos 
до тех пор, пока результат текущей итерации не станет больше результата предыдущей (это значит, что мы нашли деление,
	ближайшее к позиции ползунка и ползунок надо переместить на позицию этого деления*/
		let pos = 0
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
	calcFromPosition() {
		if (this.conf.from != this.conf.min) {
			this.data.fromPos = ((this.conf.from -
				this.conf.min) * 100) /
				(this.conf.max - this.conf.min);
		}
		else {
			this.data.fromPos = 0.00001; // начальное положение ползунка на шкале, если min=from 
		}



		/* если ползунок должен вставать на позицию ближайшего к нему деления шкалы - скорректировать значение newPos (переместить ползунок 
		к ближайшему делению шкалы) */
		if (this.conf.sticky) {
			this.data.fromPos = this.setSticky(this.data.fromPos);
		}

		this.calcVal('normal', this.data.fromPos, 'min');
		this.fire('FromPosition', this.data);

	}
	// рассчитать позицию To (%) на основании значений to, min и max
	calcToPosition() {
		console.log(this.conf.to);
		console.log(this.conf.min);
		console.log(this.conf.max);

		this.data.toPos = ((this.conf.to - this.conf.min) * 100) /
			(this.conf.max - this.conf.min);
		if (this.conf.sticky) {
			this.data.toPos = this.setSticky(this.data.toPos);
		}

		console.log(this.data.toPos);
		this.calcVal('normal', this.data.toPos, 'max');
		this.fire('ToPosition', this.data);
	}



	/*Рассчитываем ширину и позицию left (top) прогресс-бара*/
	calcBar() {
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
	calcScale() {
		let interval = 0;
		let step = 0;
		let arg = '';
		if (this.conf.scaleBase == 'steps') {//если рассчитываем шкалу на основе кол-ва шагов
			step = this.conf.step; // находим длину шага
			interval = (this.conf.max - this.conf.min) / step; // находим кол-во интервалов
			arg = interval % 1 === 0 ? String(interval) :
				String(Math.trunc(interval + 1));
			this.data.scaleBase = 'steps';
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


	//Рассчитываем положение ползунка при возникновении события перетягивания ползунка или щелчка по шкале или перемещения сфокусированного ползунка стрелкой 
	calcPos(type: string,
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
		if (this.conf.sticky) {
			newPos = this.setSticky(newPos);
		}

		let isStop = false;
		//запрещаем ползункам выходить за границы слайдера
		if (newPos < 0) {
			isStop = true;
			this.calcVal('min', 0, moovingControl);
			return;
		}
		if (newPos > 100) {
			isStop = true;
			this.calcVal('max', 0, moovingControl);
			return;
		}

		/*запрещаем ползункам перепрыгивать друг через друга, если это не single режим*/
		if (this.conf.range) {
			if (moovingControl == 'min') {//двигается min ползунок
				if (newPos > this.data.toPos) {
					isStop = true;
					this.calcVal('meetMax', 0, moovingControl);
					return;
				}
			}
			if (moovingControl == 'max') {//двигается max ползунок
				if (newPos < this.data.fromPos) {
					isStop = true;
					this.calcVal('meetMin', 0, moovingControl);
					return;
				}
			}
		}

		if (moovingControl == 'min') {
			this.data.fromPos = newPos;
			this.fire('FromPosition', this.data);
		} else {
			this.data.toPos = newPos;
			this.fire('ToPosition', this.data);
		}
		if (!isStop)
			this.calcVal('normal', newPos, moovingControl);

		this.calcBar();
		this.onChange(this.conf);
	}



	calcPosKey(key: string, repeat: boolean, moovingControl: string) {
		// поменять позицию и значение FROM
		let changeFrom = (item: IObj) => {
			this.conf.from = item.val;
			this.data.fromPos = item.pos;
			this.data.fromVal = String(item.val);
			this.fire('FromPosition', this.data);
			this.fire('FromValue', this.data);
		};
		// поменять позицию и значение TO
		let changeTo = (item: IObj) => {
			this.conf.to = item.val;
			this.data.toPos = item.pos;
			this.data.toVal = String(item.val);
			this.fire('ToPosition', this.data);
			this.fire('ToValue', this.data);
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
		if (!this.conf.sticky) {	// если ползунок НЕ должен вставать на позицию ближайшего к нему деления шкалы
			if (moovingControl == 'min') {// Ползунок min
				if (key == 'ArrowRight' || key == 'ArrowUp') {//Увеличение значения
					/*проверяем, что FROM не стал больше TO или MAX*/
					const checkMaxRange = this.conf.range && this.conf.from <
						this.conf.to;
					const checkMaxNoRange = !this.conf.range && this.conf.from < this.conf.max;

					if (checkMaxRange || checkMaxNoRange) {
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
					} else return;
				} else {// Уменьшение значения
					if (this.conf.from > this.conf.min) {
						newVal = repeat ?
							this.conf.from -
							this.conf.shiftOnKeyHold :
							this.conf.from -
							this.conf.shiftOnKeyDown;
						if (newVal < this.conf.min) {
							newVal = this.conf.min;
						}
					} else return;
				}

				this.data.fromVal = String(newVal);
				this.conf.from = newVal;
				this.calcFromPosition();
				this.fire('FromValue', this.data);

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
					} else return;
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
					} else return;
				}
				this.data.toVal = String(newVal);
				this.conf.to = newVal;
				this.calcToPosition();
				this.fire('ToValue', this.data);
			}
		}

		// если ползунок должен вставать на позицию ближайшего к нему деления шкалы
		else {

			console.log('!!!');
			console.log(this.data.marksArr);
			console.log(this.conf.from);

			if (moovingControl == 'min') {// ползунок min
				let index = this.data.marksArr.
					findIndex(item => item.val == this.conf.from);
				if (key == 'ArrowRight' || key == 'ArrowUp') {//Увеличение значения
					item = incr(index);
					if (item.val > this.conf.from &&
						(this.conf.range && item.val <= this.conf.to
							|| !this.conf.range && item.val <=
							this.conf.max)) {
						changeFrom(item);
					}
				} else {//Уменьшение значения
					item = decr(index);
					if (item.val < this.conf.to) {
						changeFrom(item);
					}
				}

			} else {// ползунок max
				let index = this.data.marksArr.
					findIndex(item => item.val == this.conf.to);
				if (key == 'ArrowRight' || key == 'ArrowUp') {//Увеличение значения
					item = incr(index);
					if (item && item.val > this.conf.to &&
						this.conf.to < this.conf.max) {
						changeTo(item);
					}
				} else {//Уменьшение значения
					item = decr(index);
					if (item.val >= this.conf.from &&
						this.conf.to > this.conf.from) {
						changeTo(item);
					}
				}
			}
		}
		this.calcBar();
		this.onChange(this.conf);
	}

	/*Рассчитываем новое значение ползунка на основании min, max и позиции (%)*/

	calcVal(stopType: string,
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

export { sliderModel };
