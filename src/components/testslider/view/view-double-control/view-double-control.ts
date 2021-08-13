
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

	leftControl: HTMLElement;
	rightControl: HTMLElement;
	leftTip: HTMLInputElement;
	rightTip: HTMLInputElement;
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
		this.leftControl = document.createElement('div');
		this.leftTip = document.createElement('input');
		this.leftControl.className = 'rs__control rs__control-min';
		this.leftTip.className = 'rs__tip rs__tip-min';
		this.leftTip.value = String(this.conf.from);
		this.scale.append(this.leftControl);
		this.leftControl.append(this.leftTip);

		this.test = document.createElement('div');
		this.test.className = 'test';
		this.leftControl.append(this.test);

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
	bindMoveControl(getControlData: CBControlElements,
		computeControlPos: CBMouseEvent, removeListeners: CBMouseEvent) {

		this.slider.addEventListener('mousedown', (e) => {
			e.preventDefault();
			const target = e.target as HTMLElement;
			if (target.classList.contains('rs__control')) {
				let controlData: IControlElements = {};
				//определяем ползунок, за который тянут
				controlData.currentControl = target;
				console.log(target);

				//определяем расстояние между левым краем ползунка и точкой захвата
				console.log(target);
				console.log(e.clientY);
				console.log(target.getBoundingClientRect().top);


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
				controlData.currentControl == this.leftControl ?
					controlData.secondControl = this.rightControl :
					controlData.secondControl = this.leftControl;

				// Устанавливаем флаг, какой из ползунков (левый или правый) перемещается
				controlData.currentControl == this.leftControl ?
					controlData.currentControlFlag = false :
					controlData.currentControlFlag = true;
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



export { sliderViewDoubleControl };

