
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
	bindMoveControl(firstEventHandler: CBControlElements,
		secondEventHandler: CBMouseEvent) {

		this.slider.addEventListener('mousedown', (e) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains('rs__control')) {
				let controlData: IControlElements = {};
				//определяем ползунок, за который тянут
				controlData.currentControl = target;

				//определяем второй ползунок
				controlData.currentControl == this.leftControl ?
					controlData.secondControl = this.rightControl :
					controlData.secondControl = this.leftControl;

				// Устанавливаем флаг, какой из ползунков (левый или правый) перемещается
				controlData.currentControl == this.leftControl ?
					controlData.currentControlFlag = false :
					controlData.currentControlFlag = true;
				firstEventHandler(controlData);// вызов хендлера обработки события

				document.addEventListener('mousemove', secondEventHandler);// навешивание обработчика перемещения ползунка
				//	document.addEventListener('mouseup', this.handleMouseUp);
				//document.addEventListener('touchmove', secondEventHandler);// навешивание обработчика перемещения ползунка
				//	document.addEventListener('touchend', this.handleMouseUp);
			}
		});
	}

	//Обновляем позицию ползунка (вызывается через контроллер)
	updateControlPos(elem: HTMLElement, newPos: number) {

		if (newPos) {
			if (!this.conf.vertical) {
				elem.style.left = newPos + 'px';
			}
			if (this.conf.vertical) {
				elem.style.bottom = newPos + 'px';
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

