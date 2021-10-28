import {
	IConf,
	$Idata
} from '../../../interface';

import { Observer } from '../../../observer';

class sliderViewControl extends Observer {
	conf: IConf;
	slider: HTMLElement;
	root: HTMLInputElement;
	//	input: HTMLInputElement;
	controlMin: HTMLElement;
	controlMax: HTMLElement;
	tipMin: HTMLInputElement;
	tipMax: HTMLInputElement;
	track: HTMLInputElement;
	$data: $Idata;

	constructor(sliderElem: HTMLElement, conf: IConf) {
		super();
		this.slider = sliderElem;
		this.root = sliderElem.previousElementSibling as HTMLInputElement;
		this.track = this.slider.querySelector('.rs__track');
		this.$data = {};
		this.$data.$thumb = {};
		this.init(conf);
		this.dragControl();
		this.pressControl();
		this.clickTrack();
	}

	// Инициализация
	init(conf: IConf) {
		this.conf = conf;
		this.renderLeftControl();
		this.renderRightControl();
	}

	renderControl(
		controlClassName: string, tipClassName: string, value: number,
		isTip: boolean, isVertical: boolean) {
		let control = document.createElement('button');
		control.className = 'rs__control';
		control.classList.add(controlClassName);
		let tip = document.createElement('input');
		tip.className = 'rs__tip';
		tip.classList.add(tipClassName);
		tip.value = String(value);

		if (!isTip) { // no tip mode
			tip.classList.add('hidden');
		}
		if (isVertical) { // vertical mode
			control.classList.add('vertical');
			tip.classList.add('vertical');
		} else {//horizontal mode
			control.classList.add('horizontal');
			tip.classList.add('horizontal');
		}

		control.append(tip);
		return control;
	}


	/*Создаем ползунок минимального значения*/
	renderLeftControl() {
		this.controlMin = this.renderControl(
			'rs__control-min', 'rs__tip-min', this.conf.from,
			this.conf.tip, this.conf.vertical);
		this.tipMin = this.controlMin.querySelector('.rs__tip');
		this.track.append(this.controlMin);
	}

	/*Создаем ползунок максимального значения*/
	renderRightControl() {
		this.controlMax = this.renderControl(
			'rs__control-max', 'rs__tip-max', this.conf.to,
			this.conf.tip, this.conf.vertical);
		this.tipMax = this.controlMax.querySelector('.rs__tip');
		this.track.append(this.controlMax);
		if (!this.conf.range) { // single mode
			this.controlMax.classList.add('hidden');
			this.tipMax.classList.add('hidden');
		}
	}

	switchVertical(conf: IConf) {
		this.conf = conf;

		if (this.conf.vertical) { // vertical mode
			this.controlMax.classList.add('vertical');
			this.tipMax.classList.add('vertical');
			this.controlMin.classList.add('vertical');
			this.tipMin.classList.add('vertical');
			this.controlMax.classList.remove('horizontal');
			this.tipMax.classList.remove('horizontal');
			this.controlMin.classList.remove('horizontal');
			this.tipMin.classList.remove('horizontal');
		} else {//horizontal mode
			this.controlMax.classList.add('horizontal');
			this.tipMax.classList.add('horizontal');
			this.controlMin.classList.add('horizontal');
			this.tipMin.classList.add('horizontal');
			this.controlMax.classList.remove('vertical');
			this.tipMax.classList.remove('vertical');
			this.controlMin.classList.remove('vertical');
			this.tipMin.classList.remove('vertical');
		}
	}




	// Вешаем обработчики события нажатия кнопки на ползунке (захвата ползунка) и перемещения ползунка
	dragControl() {
		let pointerDownHandler = (e: PointerEvent) => {
			e.preventDefault();
			const target = e.target as HTMLElement;
			if (target.classList.contains('rs__control')) {
				//определяем ползунок, за который тянут
				target.classList.contains('rs__control-min') ?
					this.$data.$thumb.$moovingControl = 'min' :
					this.$data.$thumb.$moovingControl = 'max';
				//определяем расстояние между позицией клика и левым краем ползунка
				if (!this.conf.vertical) {
					this.$data.$thumb.$shiftBase = e.clientX -
						target.getBoundingClientRect().left;
				}
				let scale = target.parentElement;
				this.$data.$thumb.$top = scale.getBoundingClientRect().top;
				this.$data.$thumb.$left = scale.getBoundingClientRect().left;
				this.$data.$thumb.$width = scale.offsetWidth;
				this.$data.$thumb.$height = scale.offsetHeight;

				let pointerMoveHandler = (e: PointerEvent) => {
					this.$data.$thumb.$type = e.type;
					this.$data.$thumb.$clientX = e.clientX;
					this.$data.$thumb.$clientY = e.clientY;
					this.fire('MoveEvent', this.$data);
					// this.input.value = this.$data.$fromVal + ', ' + this.$data.$toVal;
					// console.log(this.$data);
					// console.log(this.input.value);
				};

				let pointerUpHandler = () => {
					target.
						removeEventListener('pointermove', pointerMoveHandler);
					target.
						removeEventListener('pointerup', pointerUpHandler);
				};

				target.setPointerCapture(e.pointerId);
				target.addEventListener('pointermove', pointerMoveHandler);
				target.addEventListener('pointerup', pointerUpHandler);
			}
		};

		this.slider.addEventListener('pointerdown', pointerDownHandler);
		this.slider.addEventListener('dragstart', () => false);
		this.slider.addEventListener('selectstart', () => false);
	}


	// Вешаем обработчик нажатия стрелок на сфокусированном ползунке
	pressControl() {
		let pointerDownHandler = (e: KeyboardEvent) => {
			if (e.code == 'ArrowLeft' || e.code == 'ArrowDown' ||
				e.code == 'ArrowRight' || e.code == 'ArrowUp') {
				e.preventDefault();
				const target = e.target as HTMLElement;
				if (target.classList.contains('rs__control')) {
					//определяем ползунок, на который нажимают
					target.classList.contains('rs__control-min') ?
						this.$data.$thumb.$moovingControl = 'min' :
						this.$data.$thumb.$moovingControl = 'max';
					this.$data.$thumb.$key = e.code;
					this.$data.$thumb.$repeat = e.repeat;
					this.fire('KeydownEvent', this.$data);
					//	this.input.value = this.$data.$fromVal + ', ' + this.$data.$toVal;
					//console.log(this.input.value);
				}
			}
		};
		this.slider.addEventListener('keydown', pointerDownHandler);
	}

	clickTrack() {
		let pointerDownHandler = (e: PointerEvent) => {
			e.preventDefault();
			const target = e.target as HTMLElement;

			if (target.classList.contains('rs__track') ||
				target.classList.contains('rs__progressBar') ||
				target.classList.contains('rs__label') ||
				target.classList.contains('rs__mark') ||
				target.classList.contains('rs__input')) {
				console.log(e);


				let controlMinDist = 0;
				let controlMaxDist = 0;
				//определяем расстояние от места клика до каждого из бегунков
				if (!this.conf.vertical) {
					controlMinDist =
						Math.abs(this.controlMin.getBoundingClientRect().left -
							e.clientX);
					controlMaxDist =
						Math.abs(this.controlMax.
							getBoundingClientRect().left -
							e.clientX);
				} else {
					controlMinDist =
						Math.abs(this.controlMin.getBoundingClientRect().
							bottom - e.clientY);
					controlMaxDist = Math.abs(this.controlMax.
						getBoundingClientRect().bottom - e.clientY);
				}

				this.$data.$thumb.$top = this.track.getBoundingClientRect().top;
				this.$data.$thumb.$left =
					this.track.getBoundingClientRect().left;
				this.$data.$thumb.$width = this.track.offsetWidth;
				this.$data.$thumb.$height = this.track.offsetHeight;
				this.$data.$thumb.$type = e.type;
				this.$data.$thumb.$clientX = e.clientX;
				this.$data.$thumb.$clientY = e.clientY;

				//определяем ползунок, находящийся ближе к позиции клика
				if (this.controlMax.classList.contains('hidden')) {//Single mode
					this.$data.$thumb.$moovingControl = 'min';
				}

				else {//Double mode
					controlMinDist <= controlMaxDist ?
						this.$data.$thumb.$moovingControl = 'min' :
						this.$data.$thumb.$moovingControl = 'max';
				}
				this.fire('MoveEvent', this.$data);
				//	this.input.value = this.$data.$fromVal + ', ' + this.$data.$toVal;
				//console.log(this.input.value);
			}
		};
		this.slider.addEventListener('pointerdown', pointerDownHandler);
	}


	//Обновляем позицию ползунка (вызывается через контроллер)
	updatePos(elem: HTMLElement, newPos: number) {
		if (!this.conf.vertical) {
			elem.style.left = newPos + '%';
			elem.style.bottom = '';
		}
		if (this.conf.vertical) {
			elem.style.bottom = newPos + '%';
			elem.style.left = '';
		}

		if (this.root.tagName === 'INPUT') {
			//	console.log(this.conf.range);
			this.root.value = this.conf.range ? this.conf.from + ', ' + this.conf.to :
				String(this.conf.from);
		}
	}


	//Обновляем значение tip
	updateVal(val: string, isFrom: boolean) {
		isFrom ? this.tipMin.value = val : this.tipMax.value = val;
	}


	switchRange(conf: IConf) {
		this.conf = conf;
		if (this.conf.range) {
			this.controlMax.classList.remove('hidden');
			if (this.conf.tip) {
				this.tipMax.classList.remove('hidden');
			}
		} else {
			this.controlMax.classList.add('hidden');
			this.tipMax.classList.add('hidden');
		}
	}


	switchTip(conf: IConf) {
		this.conf = conf;
		if (this.conf.tip) {
			this.tipMax.classList.remove('hidden');
			this.tipMin.classList.remove('hidden');
		} else {
			this.tipMax.classList.add('hidden');
			this.tipMin.classList.add('hidden');
		}
	}
}



export { sliderViewControl };

