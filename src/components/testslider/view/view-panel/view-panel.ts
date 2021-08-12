
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



class sliderViewPanel extends sliderView {
	conf: IConf;
	panelWrapper: HTMLElement;
	panelTop: HTMLElement;
	panelBottom: HTMLElement;
	minLabel: HTMLElement;
	minInput: HTMLInputElement;
	maxLabel: HTMLElement;
	maxInput: HTMLInputElement;
	stepLabel: HTMLElement;
	stepInput: HTMLInputElement;
	fromLabel: HTMLElement;
	fromInput: HTMLInputElement;
	toLabel: HTMLElement;
	toInput: HTMLInputElement;
	isVerticalToggle: HTMLElement;
	isVerticalToggleInput: HTMLInputElement;
	isVerticalToggleSpan: HTMLElement;
	isVerticalToggleLabel: HTMLElement;
	leftControlStartVal: number;
	rightControlStartVal: number;
	isRangeToggle: HTMLElement;
	isRangeToggleInput: HTMLInputElement;
	isRangeToggleSpan: HTMLElement;
	isRangeToggleLabel: HTMLElement;
	isScaleToggle: HTMLElement;
	isScaleToggleInput: HTMLInputElement;
	isScaleToggleSpan: HTMLElement;
	isScaleToggleLabel: HTMLElement;
	isBarToggle: HTMLElement;
	isBarToggleInput: HTMLInputElement;
	isBarToggleLabel: HTMLElement;
	isBarToggleSpan: HTMLElement;
	isTipToggle: HTMLElement;
	isTipToggleInput: HTMLInputElement;
	isTipToggleSpan: HTMLElement;
	isTipToggleLabel: HTMLElement;





	constructor(root: string) {
		super(root);
	}
	init(conf: IConf) {
		this.conf = conf;
		this.renderPanelWrapper();
		this.renderMinInput();
		this.renderMaxInput();
		this.renderStepInput();
		this.renderFromInput();
		this.renderToInput();
		this.renderIsVerticalToggle();
		this.renderIsRangeToggle();
		this.renderIsScaleToggle();
		this.renderIsBarToggle();
		this.renderIsTipToggle();
	}



	renderPanelWrapper() {
		this.panelWrapper = document.createElement('div');
		this.panelWrapper.className = 'rs__panelWrapper';
		this.slider.append(this.panelWrapper);
		this.panelTop = document.createElement('div');
		this.panelTop.className = 'rs__panel rs__panel-top';
		this.panelWrapper.append(this.panelTop);
		this.panelBottom = document.createElement('div');
		this.panelBottom.className = 'rs__panel rs__panel-bottom';
		this.panelWrapper.append(this.panelBottom);
	}


	renderMinInput() {
		this.minLabel = document.createElement('label');
		this.minLabel.innerText = 'min';
		this.minInput = document.createElement('input');
		this.minInput.value = String(this.conf.min);
		this.minInput.className = 'rs__input rs__input-min';
		this.minLabel.append(this.minInput);
		this.panelTop.append(this.minLabel);
	}


	renderMaxInput() {
		this.maxLabel = document.createElement('label');
		this.maxLabel.innerText = 'max';
		this.maxInput = document.createElement('input');
		this.maxInput.value = String(this.conf.max);
		this.maxInput.className = 'rs__input rs__input-max';
		this.maxLabel.append(this.maxInput);
		this.panelTop.append(this.maxLabel);
	}


	renderStepInput() {
		this.stepLabel = document.createElement('label');
		this.stepLabel.innerText = 'step';
		this.stepInput = document.createElement('input');
		this.stepInput.value = String(this.conf.step);
		this.stepInput.className = 'rs__input rs__input-step';
		this.stepLabel.append(this.stepInput);
		this.panelTop.append(this.stepLabel);
	}



	renderFromInput() {
		this.fromLabel = document.createElement('label');
		this.fromLabel.innerText = 'from';
		this.fromInput = document.createElement('input');
		this.fromInput.value = String(this.conf.from);
		this.fromInput.className = 'rs__input rs__input-from';
		this.fromLabel.append(this.fromInput);
		this.leftControlStartVal = this.conf.from;
		this.panelTop.append(this.fromLabel);
	}

	renderToInput() {
		this.toLabel = document.createElement('label');
		this.toLabel.innerText = 'to';
		this.toInput = document.createElement('input');
		this.toInput.value = String(this.conf.to);
		this.toInput.className = 'rs__input rs__input-to';
		this.toLabel.append(this.toInput);
		this.rightControlStartVal = this.conf.to;
		this.panelTop.append(this.toLabel);
	}

	renderIsVerticalToggle() {
		this.isVerticalToggle = document.createElement('label');
		this.isVerticalToggle.className = 'togglemark__wrapper';
		this.panelBottom.append(this.isVerticalToggle);

		this.isVerticalToggleInput = document.createElement('input');
		this.isVerticalToggleInput.type = 'checkbox';

		if (this.conf.vertical == true) {
			this.isVerticalToggleInput.checked = true;
		} else {
			this.isVerticalToggleInput.removeAttribute('checked');
		}

		this.isVerticalToggleInput.className = 'rs__verticalModeToggle';
		this.isVerticalToggleSpan = document.createElement('span');
		this.isVerticalToggleSpan.className = 'togglemark';
		this.isVerticalToggleLabel = document.createElement('label');
		this.isVerticalToggleLabel.className = 'togglemark__label';
		this.isVerticalToggleLabel.innerText = 'vertical';
		this.isVerticalToggle.append(this.isVerticalToggleInput);
		this.isVerticalToggle.append(this.isVerticalToggleSpan);
		this.isVerticalToggle.append(this.isVerticalToggleLabel);



		if (this.conf.vertical == true) {
			this.isVerticalToggleInput.checked = true;
		} else {
			this.isVerticalToggleInput.removeAttribute('checked');
		}
	}

	renderIsRangeToggle() {
		this.isRangeToggle = document.createElement('label');
		this.isRangeToggle.className = 'togglemark__wrapper';
		this.panelBottom.append(this.isRangeToggle);

		this.isRangeToggleInput = document.createElement('input');
		this.isRangeToggleInput.type = 'checkbox';


		if (this.conf.range == true) {
			this.isRangeToggleInput.checked = true;
		} else {
			this.isRangeToggleInput.removeAttribute('checked');
		}

		this.isRangeToggleInput.className = 'rs__rangeModeToggle';
		this.isRangeToggleSpan = document.createElement('span');
		this.isRangeToggleSpan.className = 'togglemark';
		this.isRangeToggleLabel = document.createElement('label');
		this.isRangeToggleLabel.className = 'togglemark__label';
		this.isRangeToggleLabel.innerText = 'range';
		this.isRangeToggle.append(this.isRangeToggleInput);
		this.isRangeToggle.append(this.isRangeToggleSpan);
		this.isRangeToggle.append(this.isRangeToggleLabel);
	}




	renderIsScaleToggle() {
		this.isScaleToggle = document.createElement('label');
		this.isScaleToggle.className = 'togglemark__wrapper';
		this.panelBottom.append(this.isScaleToggle);

		this.isScaleToggleInput = document.createElement('input');
		this.isScaleToggleInput.type = 'checkbox';

		if (this.conf.scale == true) {
			this.isScaleToggleInput.checked = true;
		} else {
			this.isScaleToggleInput.removeAttribute('checked');
		}

		this.isScaleToggleInput.className = 'rs__scaleModeToggle';


		this.isScaleToggleSpan = document.createElement('span');
		this.isScaleToggleSpan.className = 'togglemark';

		this.isScaleToggleLabel = document.createElement('label');
		this.isScaleToggleLabel.className = 'togglemark__label';
		this.isScaleToggleLabel.innerText = 'scale';


		this.isScaleToggle.append(this.isScaleToggleInput);
		this.isScaleToggle.append(this.isScaleToggleSpan);
		this.isScaleToggle.append(this.isScaleToggleLabel);
	}


	renderIsBarToggle() {
		this.isBarToggle = document.createElement('label');
		this.isBarToggle.className = 'togglemark__wrapper';
		this.panelBottom.append(this.isBarToggle);

		this.isBarToggleInput = document.createElement('input');
		this.isBarToggleInput.type = 'checkbox';

		if (this.conf.bar == true) {
			this.isBarToggleInput.checked = true;
		} else {
			this.isBarToggleInput.removeAttribute('checked');
		}

		this.isBarToggleInput.className = 'rs__barModeToggle';
		this.isBarToggleSpan = document.createElement('span');
		this.isBarToggleSpan.className = 'togglemark';

		this.isBarToggleLabel = document.createElement('label');
		this.isBarToggleLabel.className = 'togglemark__label';
		this.isBarToggleLabel.innerText = 'bar';


		this.isBarToggle.append(this.isBarToggleInput);
		this.isBarToggle.append(this.isBarToggleSpan);
		this.isBarToggle.append(this.isBarToggleLabel);
	}


	renderIsTipToggle() {
		this.isTipToggle = document.createElement('label');
		this.isTipToggle.className = 'togglemark__wrapper';
		this.panelBottom.append(this.isTipToggle);

		this.isTipToggleInput = document.createElement('input');
		this.isTipToggleInput.type = 'checkbox';

		if (this.conf.tip == true) {
			this.isTipToggleInput.checked = true;
		} else {
			this.isTipToggleInput.removeAttribute('checked');
		}

		this.isTipToggleInput.className = 'rs__tipModeToggle';
		this.isTipToggleSpan = document.createElement('span');
		this.isTipToggleSpan.className = 'togglemark';

		this.isTipToggleLabel = document.createElement('label');
		this.isTipToggleLabel.className = 'togglemark__label';
		this.isTipToggleLabel.innerText = 'tip';


		this.isTipToggle.append(this.isTipToggleInput);
		this.isTipToggle.append(this.isTipToggleSpan);
		this.isTipToggle.append(this.isTipToggleLabel);
	}


	//ввод значения MIN/MAX
	bindMinMaxChange(eventHandler: CBStringEvent) {
		this.minInput.addEventListener('input', (e) => {
			eventHandler(this.minInput.value, e);
		});

		this.maxInput.addEventListener('input', (e) => {
			eventHandler(this.maxInput.value, e);
		});
	}

	//ввод значения STEP
	bindStepChange(eventHandler: CBStringEvent) {
		this.stepInput.addEventListener('input', (e) => {
			eventHandler(this.stepInput.value, e);
		});
	}


	//ввод значения FROM/TO
	bindFromToChange(eventHandler: CBStringEvent) {
		this.fromInput.addEventListener('input', (e) => {
			eventHandler(this.fromInput.value, e);
		});

		this.toInput.addEventListener('input', (e) => {
			eventHandler(this.toInput.value, e);
		});
	}




	//щелчок по чекбоксу VERTICAL
	bindCheckIsVerticalControl(checkedEventHandler: CBEvent,
		notCheckedEventHandler: CBEvent) {

		this.isVerticalToggleInput.addEventListener('change', (e) => {
			this.isVerticalToggleInput.checked ?
				checkedEventHandler(e) : notCheckedEventHandler(e);
		});
	}

	//Эмуляция события ввода в инпут
	createEvent(input: HTMLInputElement) {
		input.value = String(this.conf.min);
		let event = new Event('input', {
			bubbles: true,
			cancelable: true,
		});
		this.fromInput.dispatchEvent(event);
	}


	//щелчок по чекбоксу RANGE
	bindCheckIsRangeControl(checkedEventHandler: CBEvent,
		notCheckedEventHandler: CBEvent) {

		this.isRangeToggleInput.addEventListener('change', (e) => {


			if (this.isRangeToggleInput.checked) {

				if (parseInt(this.fromInput.value) >=
					parseInt(this.toInput.value)) {
					this.createEvent(this.fromInput);
				}
				checkedEventHandler(e);
			}
			else {
				notCheckedEventHandler(e);
			}
		});
	}




	//щелчок по чекбоксу SCALE
	bindCheckIsScaleControl(checkedEventHandler: CBEvent,
		notCheckedEventHandler: CBEvent) {

		this.isScaleToggleInput.addEventListener('change', (e) => {
			if (this.isScaleToggleInput.checked) {
				checkedEventHandler(e);
			}
			else {
				notCheckedEventHandler(e);
			}
		});
	}



	//щелчок по чекбоксу BAR
	bindCheckIsBarControl(checkedEventHandler: CBEvent,
		notCheckedEventHandler: CBEvent) {
		this.isBarToggleInput.addEventListener('change', (e) => {
			if (this.isBarToggleInput.checked) {
				checkedEventHandler(e);
			}
			else {
				notCheckedEventHandler(e);
			}
		});
	}



	//щелчок по чекбоксу TIP
	bindCheckIsTipControl(checkedEventHandler: CBEvent,
		notCheckedEventHandler: CBEvent) {
		this.isTipToggleInput.addEventListener('change', (e) => {
			if (this.isTipToggleInput.checked) {
				checkedEventHandler(e);
			}
			else {
				notCheckedEventHandler(e);
			}
		});
	}


	//Обновление значений инпутов FROM и TO при перемещении ползунков
	updateFromTo(elem: HTMLElement, newValue: string) {
		elem.classList.contains('rs__control-min') ?
			this.fromInput.value = newValue : this.toInput.value = newValue;
	}
}


export { sliderViewPanel };

