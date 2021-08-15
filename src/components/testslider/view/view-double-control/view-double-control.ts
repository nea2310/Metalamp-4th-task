
import { ModuleBody } from 'typescript';
import { sliderView } from './../../view/view';
import {
	CBNoArgs,
	CBControlElements,
	CBMouseEvent,
	CBPointerEvent,
	CBEvent,
	CBStringEvent,
	CBStringPointerEvent,
	CBInputEvent,
	CBStringInputEvent,
	ControlPosUpdated,
	ProgressBarUpdated,
	ControlValueUpdated,
	IConf,
	IControlElements
} from './../../interface';




class sliderViewDoubleControl extends sliderView {
	conf: IConf;

	controlMin: HTMLElement;
	controlMax: HTMLElement;
	tipMin: HTMLInputElement;
	tipMax: HTMLInputElement;
	scale: Element;
	test: HTMLElement;

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
		this.controlMin = document.createElement('div');
		this.tipMin = document.createElement('input');
		this.controlMin.className = 'rs__control rs__control-min';
		this.tipMin.className = 'rs__tip rs__tip-min';
		this.tipMin.value = String(this.conf.from);
		this.scale.append(this.controlMin);
		this.controlMin.append(this.tipMin);

		this.test = document.createElement('div');
		this.test.className = 'test';
		this.controlMin.append(this.test);

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
		this.controlMax = document.createElement('div');
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
	bindMoveControl(getControlData: CBControlElements,
		computeControlPos: CBMouseEvent, removeListeners: CBMouseEvent) {

		this.slider.addEventListener('mousedown', (e) => {
			e.preventDefault();
			const target = e.target as HTMLElement;
			if (target.classList.contains('rs__control')) {
				let controlData: IControlElements = {};
				//определяем ползунок, за который тянут
				controlData.currentControl = target;
				//	console.log(target);

				//определяем расстояние между левым краем ползунка и точкой захвата
				// console.log(target);
				// console.log(e.clientY);
				// console.log(target.getBoundingClientRect().top);


				if (this.conf.vertical) {
					if (e.clientY <= target.getBoundingClientRect().top) {
						console.log('ВЫШЕ');

						controlData.shift =
							target.getBoundingClientRect().top - e.clientY;
						console.log(controlData.shift);
					} else {
						console.log('НИЖЕ');
						controlData.shift = e.clientY -
							target.getBoundingClientRect().top;
						console.log(controlData.shift);
					}
				}

				this.conf.vertical ?
					controlData.shift = e.clientY -
					target.getBoundingClientRect().top :
					controlData.shift = e.clientX -
					target.getBoundingClientRect().left;
				//	console.log(controlData.shift);


				//определяем второй ползунок
				controlData.currentControl == this.controlMin ?
					controlData.secondControl = this.controlMax :
					controlData.secondControl = this.controlMin;

				// Устанавливаем флаг, какой из ползунков (левый или правый) перемещается
				controlData.currentControl == this.controlMin ?
					controlData.moovingControl = 'min' :
					controlData.moovingControl = 'max';
				getControlData(controlData);// вызов хендлера передачи данных в модель о перемещаемом ползунке 

				document.addEventListener('mousemove', computeControlPos);// навешивание обработчика перемещения ползунка
				document.addEventListener('mouseup', removeListeners);// навешивание обработчика отпускания кнопки
				//document.addEventListener('touchmove', secondEventHandler);// навешивание обработчика перемещения ползунка
				//	document.addEventListener('touchend', this.handleMouseUp);
			}
		});
	}

	//Обновляем позицию ползунка (вызывается через контроллер)
	updateControlPos(elem: HTMLElement, newPos: number) {

		if (newPos) {
			if (!this.conf.vertical) {
				elem.style.left = newPos + '%';
			}
			if (this.conf.vertical) {
				elem.style.bottom = newPos + '%';
			}
		}
	}


	//Обновляем значение tip

	updateTipVal(val: string, isFrom: boolean) {
		isFrom ? this.tipMin.value = val : this.tipMax.value = val;
	}

	updateVerticalMode(isVertical: boolean) {
		isVertical ? console.log('VERTICALMODE') :
			console.log('HORIZONTALMODE');
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



export { sliderViewDoubleControl };

