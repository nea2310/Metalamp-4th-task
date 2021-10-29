import { IConf, Idata } from '../../interface';
import { Observer } from '../../observer';

class sliderViewControl extends Observer {
	conf: IConf;
	slider: HTMLElement;
	root: HTMLInputElement;
	controlMin: HTMLElement;
	controlMax: HTMLElement;
	tipMin: HTMLInputElement;
	tipMax: HTMLInputElement;
	track: HTMLInputElement;
	data: Idata;

	constructor(sliderElem: HTMLElement, conf: IConf) {
		super();
		this.slider = sliderElem;
		this.root = sliderElem.previousElementSibling as HTMLInputElement;
		this.track = this.slider.querySelector('.rs__track');
		this.data = {};
		this.data.thumb = {};
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
		this.switchRange(this.conf);
		this.switchVertical(this.conf);
		this.switchTip(this.conf);
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
	}

	// Вешаем обработчики события нажатия кнопки на ползунке (захвата ползунка) и перемещения ползунка
	dragControl() {
		let pointerDownHandler = (e: PointerEvent) => {
			e.preventDefault();
			const target = e.target as HTMLElement;
			target.classList.add('grabbing')
			const T = this.data.thumb;
			if (target.classList.contains('rs__control')) {
				//определяем ползунок, за который тянут
				target.classList.contains('rs__control-min') ?
					T.moovingControl = 'min' :
					T.moovingControl = 'max';
				//определяем расстояние между позицией клика и левым краем ползунка
				if (!this.conf.vertical) {
					T.shiftBase = e.clientX -
						target.getBoundingClientRect().left;
				}
				let scale = target.parentElement;
				T.top = scale.getBoundingClientRect().top;
				T.left = scale.getBoundingClientRect().left;
				T.width = scale.offsetWidth;
				T.height = scale.offsetHeight;

				let pointerMoveHandler = (e: PointerEvent) => {

					T.type = e.type;
					T.clientX = e.clientX;
					T.clientY = e.clientY;
					this.fire('MoveEvent', this.data);
				};

				let pointerUpHandler = () => {
					target.classList.remove('grabbing')
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

			let arr = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp'];
			const result = arr.indexOf(e.code)
			if (result != -1) {
				e.preventDefault();
				const target = e.target as HTMLElement;
				const T = this.data.thumb;
				if (target.classList.contains('rs__control')) {
					//определяем ползунок, на который нажимают
					target.classList.contains('rs__control-min') ?
						T.moovingControl = 'min' :
						T.moovingControl = 'max';
					T.key = e.code;
					T.repeat = e.repeat;
					this.fire('KeydownEvent', this.data);
				}
			}
		};
		this.slider.addEventListener('keydown', pointerDownHandler);
	}

	clickTrack() {
		let pointerDownHandler = (e: PointerEvent) => {
			e.preventDefault();
			const target = e.target as HTMLElement;
			const T = this.data.thumb;

			let arr = ['rs__track', 'rs__progressBar', 'rs__label', 'rs__mark', 'rs__frame']
			const result = [...target.classList].some(className => arr.indexOf(className) !== -1);
			if (result) {
				let controlMinDist = 0;
				let controlMaxDist = 0;
				//определяем расстояние от места клика до каждого из бегунков
				if (this.conf.vertical) {
					controlMinDist =
						Math.abs(this.controlMin.getBoundingClientRect().
							bottom - e.clientY);
					controlMaxDist = Math.abs(this.controlMax.
						getBoundingClientRect().bottom - e.clientY);
				} else {
					controlMinDist =
						Math.abs(this.controlMin.getBoundingClientRect().left -
							e.clientX);
					controlMaxDist =
						Math.abs(this.controlMax.
							getBoundingClientRect().left -
							e.clientX);
				}

				T.top = this.track.getBoundingClientRect().top;
				T.left =
					this.track.getBoundingClientRect().left;
				T.width = this.track.offsetWidth;
				T.height = this.track.offsetHeight;
				T.type = e.type;
				T.clientX = e.clientX;
				T.clientY = e.clientY;

				//определяем ползунок, находящийся ближе к позиции клика
				if (this.controlMax.classList.contains('hidden')) {//Single mode
					T.moovingControl = 'min';
				}

				else {//Double mode
					controlMinDist <= controlMaxDist ?
						T.moovingControl = 'min' :
						T.moovingControl = 'max';
				}
				this.fire('MoveEvent', this.data);
			}
		};
		this.slider.addEventListener('pointerdown', pointerDownHandler);
	}

	//Обновляем позицию ползунка (вызывается через контроллер)
	updatePos(elem: HTMLElement, newPos: number) {
		if (this.conf.vertical) {
			elem.style.bottom = newPos + '%';
			elem.style.left = '';
		} else {
			elem.style.left = newPos + '%';
			elem.style.bottom = '';
		}

		// передать значения FROM и TO в инпут
		if (this.root.tagName === 'INPUT') {
			this.root.value = this.conf.range ? this.conf.from + ', ' + this.conf.to :
				String(this.conf.from);
		}
	}

	//Обновляем значение tip
	updateVal(val: string, isFrom: boolean) {
		isFrom ? this.tipMin.value = val : this.tipMax.value = val;
	}

	//включение / отключение вертикального режима
	switchVertical(conf: IConf) {
		this.conf = conf;
		let arr = [this.controlMax, this.tipMax, this.controlMin, this.tipMin];
		for (let elem of arr) {
			if (this.conf.vertical) {
				elem.classList.add('vert');
				elem.classList.remove('horizontal');
			} else {
				elem.classList.remove('vert');
				elem.classList.add('horizontal');
			}
		}
	}

	//включение / отключение single режима
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

	//включение / отключение подсказок
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

