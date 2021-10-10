
import {
	CBControlElements,
	CBMouseEvent,
	IConf,
	IControlElements,
	CBPointerEvent,
	CBKeyboardEvent,
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
		this.dragThumb();

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
		//	console.log(this.scale);

		this.scale.append(this.controlMin);
		this.controlMin.append(this.tipMin);

		// this.test = document.createElement('div');
		// this.test.className = 'test';
		// this.controlMin.append(this.test);

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




	// // Вешаем обработчики события нажатия кнопки на ползунке (захвата ползунка) и перемещения ползунка
	// bindMoveControl(getControlData: CBControlElements,
	// 	computeControlPos: CBPointerEvent, removeListeners: CBPointerEvent) {

	// 	this.slider.addEventListener('pointerdown', (e) => {
	// 		e.preventDefault();
	// 		const target = e.target as HTMLElement;
	// 		if (target.classList.contains('rs__control')) {
	// 			let controlData: IControlElements = {};
	// 			//определяем ползунок, за который тянут
	// 			//	controlData.currentControlElem = target;
	// 			target.classList.contains('rs__control-min') ?
	// 				controlData.moovingControl = 'min' :
	// 				controlData.moovingControl = 'max';

	// 			//определяем расстояние между позицией клика и левым краем ползунка
	// 			if (!this.conf.vertical) {
	// 				controlData.shift = e.clientX -
	// 					target.getBoundingClientRect().left;
	// 			}

	// 			let scale = this.controlMin.parentElement;

	// 			controlData.top = scale.getBoundingClientRect().top;
	// 			controlData.left = scale.getBoundingClientRect().left;
	// 			controlData.width = scale.offsetWidth;
	// 			controlData.height = scale.offsetHeight;

	// 			getControlData(controlData);// вызов хендлера передачи данных в модель о перемещаемом ползунке 

	// 			document.addEventListener('pointermove', computeControlPos);// навешивание обработчика перемещения ползунка
	// 			document.addEventListener('pointerup', removeListeners);// навешивание обработчика отпускания кнопки
	// 			//document.addEventListener('touchmove', secondEventHandler);// навешивание обработчика перемещения ползунка
	// 			//	document.addEventListener('touchend', this.handleMouseUp);
	// 		}
	// 	});
	// }




	// Вешаем обработчики события нажатия кнопки на ползунке (захвата ползунка) и перемещения ползунка

	dragThumb() {
		let pointerDownHandler = (e: PointerEvent) => {
			e.preventDefault();
			const thumb = e.target as HTMLElement;
			if (thumb.classList.contains('rs__control')) {
				//определяем ползунок, за который тянут
				thumb.classList.contains('rs__control-min') ?
					this.$data.$thumb.$moovingControl = 'min' :
					this.$data.$thumb.$moovingControl = 'max';
				//определяем расстояние между позицией клика и левым краем ползунка
				if (!this.conf.vertical) {
					this.$data.$thumb.$shiftBase = e.clientX -
						thumb.getBoundingClientRect().left;
				}
				let scale = thumb.parentElement;
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
					thumb.
						removeEventListener('pointermove', pointerMoveHandler);
					thumb.
						removeEventListener('pointerup', pointerUpHandler);
				};

				thumb.setPointerCapture(e.pointerId);
				thumb.addEventListener('pointermove', pointerMoveHandler);
				thumb.addEventListener('pointerup', pointerUpHandler);
			}
		};

		this.slider.addEventListener('pointerdown', pointerDownHandler);
		this.slider.addEventListener('dragstart', () => false);
		this.slider.addEventListener('selectstart', () => false);


	}




	// Вешаем обработчик нажатия стрелок на сфокусированном ползунке

	bindFocusedControl(getControlData: CBControlElements,
		computeControlPos: CBKeyboardEvent) {



		this.slider.addEventListener('keydown', (e) => {

			//	e.preventDefault();
			if (e.code == 'ArrowLeft' || e.code == 'ArrowDown' ||
				e.code == 'ArrowRight' || e.code == 'ArrowUp') {
				//	e.preventDefault();
				const target = e.target as HTMLElement;
				if (target.classList.contains('rs__control')) {
					let controlData: IControlElements = {};
					//определяем ползунок, на который нажимают
					controlData.currentControlElem = target;
					target.classList.contains('rs__control-min') ?
						controlData.moovingControl = 'min' :
						controlData.moovingControl = 'max';
					controlData.key = e.code;
					controlData.repeat = e.repeat;
					//	console.log(e.constructor.name);
					getControlData(controlData);// вызов хендлера передачи данных в модель о перемещаемом ползунке 
					computeControlPos(e);

				}
			}
		});
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

	// updateStickyMode(isSticky: boolean){

	// }
}



export { sliderViewControl };

