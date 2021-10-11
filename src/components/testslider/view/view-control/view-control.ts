
import {
	IConf,
	$Idata
} from './../../interface';

import { Observer } from '../../observer/observer';




class sliderViewControl extends Observer {
	conf: IConf;
	slider: HTMLElement;
	controlMin: HTMLElement;
	controlMax: HTMLElement;
	tipMin: HTMLInputElement;
	tipMax: HTMLInputElement;
	scale: Element;
	$data: $Idata;

	constructor(root: string, conf: IConf) {
		super();
		this.slider = document.querySelector(root);
		this.$data = {};
		this.$data.$thumb = {};
		this.init(conf);
		this.dragControl();
		this.pressControl();
		this.clickScale();

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
		this.controlMin = document.createElement('button');
		this.tipMin = document.createElement('input');
		this.controlMin.className = 'rs__control rs__control-min';
		this.tipMin.className = 'rs__tip rs__tip-min';
		this.tipMin.value = String(this.conf.from);

		this.scale.append(this.controlMin);
		this.controlMin.append(this.tipMin);



		if (this.conf.tip == false) { // no tip mode
			this.tipMin.classList.add('hidden');
		}

		if (this.conf.vertical == true) { // vertical mode
			this.controlMin.classList.add('vertical');
			this.tipMin.classList.add('vertical');
		} else {//horizontal mode
			this.controlMin.classList.add('horizontal');
			this.tipMin.classList.add('horizontal');
		}


	}
	/*Создаем ползунок максимального значения*/
	renderRightControl() {
		this.controlMax = document.createElement('button');
		this.controlMax.className = 'rs__control rs__control-max';
		this.scale.append(this.controlMax);


		this.tipMax = document.createElement('input');


		this.controlMax.className = 'rs__control rs__control-max';
		this.tipMax.className = 'rs__tip rs__tip-max';
		this.tipMax.value = String(this.conf.to);



		this.controlMax.append(this.tipMax);

		if (this.conf.range == false) {// single mode
			this.controlMax.classList.add('hidden');
			this.tipMax.classList.add('hidden');
		}

		if (this.conf.tip == false) {// no tip mode
			this.tipMax.classList.add('hidden');
		}

		if (this.conf.vertical == true) { // vertical mode
			this.controlMax.classList.add('vertical');
			this.tipMax.classList.add('vertical');
		} else {//horizontal mode
			this.controlMax.classList.add('horizontal');
			this.tipMax.classList.add('horizontal');
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
				}
			}
		};
		this.slider.addEventListener('keydown', pointerDownHandler);

	}

	clickScale() {

		let pointerDownHandler = (e: PointerEvent) => {

			e.preventDefault();
			const target = e.target as HTMLElement;

			if (target.classList.contains('rs__slider') ||
				target.classList.contains('rs__progressBar') ||
				target.classList.contains('rs__label') ||
				target.classList.contains('rs__mark') ||
				target.classList.contains('rs__wrapper')) {

				let controlMinDist = 0;
				let controlMaxDist = 0;
				//определяем расстояние от места клика до каждого из бегунков
				if (!this.conf.vertical) {
					console.log('horizontal');
					controlMinDist =
						Math.abs(this.controlMin.getBoundingClientRect().left -
							e.clientX);
					controlMaxDist =
						Math.abs(this.controlMax.
							getBoundingClientRect().left -
							e.clientX);
				} else {
					console.log('vertical');
					controlMinDist =
						Math.abs(this.controlMin.getBoundingClientRect().
							bottom - e.clientY);
					controlMaxDist = Math.abs(this.controlMax.
						getBoundingClientRect().bottom - e.clientY);
				}


				let scale = this.controlMin.parentElement;
				console.log(scale);
				console.log(this.scale);

				this.$data.$thumb.$top = scale.getBoundingClientRect().top;
				this.$data.$thumb.$left = scale.getBoundingClientRect().left;
				this.$data.$thumb.$width = scale.offsetWidth;
				this.$data.$thumb.$height = scale.offsetHeight;
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
				console.log(this.$data);

				this.fire('MoveEvent', this.$data);
			}
		};
		this.slider.addEventListener('pointerdown', pointerDownHandler);
	}



	//Обновляем позицию ползунка (вызывается через контроллер)
	updateControlPos(elem: HTMLElement, newPos: number) {
		if (!this.conf.vertical) {
			elem.style.left = newPos + '%';
		}
		if (this.conf.vertical) {
			elem.style.bottom = newPos + '%';
		}
	}


	//Обновляем значение tip

	updateTipVal(val: string, isFrom: boolean) {
		isFrom ? this.tipMin.value = val : this.tipMax.value = val;
	}



	updateRangeMode(isDouble: boolean) {
		if (isDouble) {
			this.controlMax.classList.remove('hidden');
			if (this.conf.tip) {
				this.tipMax.classList.remove('hidden');
			}
		} else {
			this.controlMax.classList.add('hidden');
			this.tipMax.classList.add('hidden');
		}
	}

	updateTipMode(isTip: boolean) {

		if (isTip) {
			this.tipMax.classList.remove('hidden');
			this.tipMin.classList.remove('hidden');
		} else {
			this.tipMax.classList.add('hidden');
			this.tipMin.classList.add('hidden');
		}
	}


}



export { sliderViewControl };

