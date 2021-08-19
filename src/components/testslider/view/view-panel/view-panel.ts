
import { sliderView } from './../../view/view';

import {
	CBNoArgs,
	CBEvent,
	CBStringEvent,
	IConf,
} from './../../interface';



class sliderViewPanel extends sliderView {
	conf: IConf;
	panelTop: HTMLElement;
	panelBottom: HTMLElement;
	minLabel: HTMLElement;
	minInput: HTMLInputElement;
	maxLabel: HTMLElement;
	maxInput: HTMLInputElement;
	stepLabel: HTMLElement;
	stepInput: HTMLInputElement;
	intervalInput: HTMLInputElement;
	fromLabel: HTMLElement;
	fromInput: HTMLInputElement;
	toLabel: HTMLElement;
	toInput: HTMLInputElement;
	isVerticalToggle: HTMLElement;
	isVerticalToggleInput: HTMLInputElement;

	isRangeToggle: HTMLElement;
	isRangeToggleInput: HTMLInputElement;

	isScaleToggle: HTMLElement;
	isScaleToggleInput: HTMLInputElement;

	isBarToggle: HTMLElement;
	isBarToggleInput: HTMLInputElement;


	isTipToggle: HTMLElement;
	isTipToggleInput: HTMLInputElement;
	intervalLabel: HTMLLabelElement;





	constructor(root: string) {
		super(root);
	}
	init(conf: IConf) {
		this.conf = conf;
		this.renderPanelWrapper();

		//Создать инпуты
		this.minLabel = this.renderInput('min', this.conf.min, 'rs__input-min');
		this.panelTop.append(this.minLabel);
		this.minInput = this.minLabel.querySelector('input');

		this.maxLabel = this.renderInput('max', this.conf.max, 'rs__input-max');
		this.panelTop.append(this.maxLabel);
		this.maxInput = this.maxLabel.querySelector('input');

		this.fromLabel = this.renderInput('from', this.conf.from,
			'rs__input-from');
		this.panelTop.append(this.fromLabel);
		this.fromInput = this.fromLabel.querySelector('input');

		this.toLabel = this.renderInput('to', this.conf.to, 'rs__input-to');
		this.panelTop.append(this.toLabel);
		this.toInput = this.toLabel.querySelector('input');

		this.intervalLabel = this.renderInput('interval', this.conf.intervals,
			'rs__input-interval');
		this.intervalInput = this.intervalLabel.querySelector('input');
		this.panelTop.append(this.intervalLabel);

		this.stepLabel = this.renderInput('step', this.conf.step,
			'rs__input-step');
		this.panelTop.append(this.stepLabel);
		this.stepInput = this.stepLabel.querySelector('input');

		//Создать чекбоксы
		this.isVerticalToggle = this.renderToggle(this.conf.vertical,
			'vertical', 'rs__verticalModeToggle');
		this.isVerticalToggleInput =
			this.isVerticalToggle.querySelector('input');
		this.panelBottom.append(this.isVerticalToggle);

		this.isRangeToggle = this.renderToggle(this.conf.range,
			'range', 'rs__rangeModeToggle');
		this.isRangeToggleInput =
			this.isRangeToggle.querySelector('input');
		this.panelBottom.append(this.isRangeToggle);

		this.isScaleToggle = this.renderToggle(this.conf.scale,
			'scale', 'rs__scaleModeToggle');
		this.isScaleToggleInput =
			this.isScaleToggle.querySelector('input');
		this.panelBottom.append(this.isScaleToggle);


		this.isBarToggle = this.renderToggle(this.conf.bar,
			'bar', 'rs__barModeToggle');
		this.isBarToggleInput =
			this.isBarToggle.querySelector('input');
		this.panelBottom.append(this.isBarToggle);

		this.isTipToggle = this.renderToggle(this.conf.tip,
			'tip', 'rs__tipModeToggle');
		this.isTipToggleInput =
			this.isTipToggle.querySelector('input');
		this.panelBottom.append(this.isTipToggle);
	}

	renderPanelWrapper() {
		let panelWrapper = document.createElement('div');
		panelWrapper.className = 'rs__panelWrapper';
		let wrapper = this.slider.parentElement;
		wrapper.append(panelWrapper);
		this.panelTop = document.createElement('div');
		this.panelTop.className = 'rs__panel rs__panel-top';
		panelWrapper.append(this.panelTop);
		this.panelBottom = document.createElement('div');
		this.panelBottom.className = 'rs__panel rs__panel-bottom';
		panelWrapper.append(this.panelBottom);
	}

	renderInput(
		name: string, value: number, className: string) {
		let label = document.createElement('label');
		label.className = 'input__wrapper';
		label.innerText = name;
		let input = document.createElement('input');
		input.value = value ? String(value) : '';
		input.className = 'rs__input';
		input.classList.add(className);
		label.append(input);
		return label;
	}


	renderToggle(name: boolean, value: string, className: string) {
		let label = document.createElement('label');
		label.className = 'checkbox__wrapper';
		let input = document.createElement('input');
		input.type = 'checkbox';

		if (name == true) {
			input.checked = true;
		}
		input.className = 'checkbox';
		input.classList.add(className);
		let span = document.createElement('span');
		span.className = 'checkmark';
		let innerLabel = document.createElement('p');
		innerLabel.className = 'name';
		innerLabel.innerText = value;

		label.append(input);
		label.append(span);
		label.append(innerLabel);
		return label;
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


	//ввод значения INTERVAL
	bindIntervalChange(eventHandler: CBStringEvent) {
		this.intervalInput.addEventListener('input', (e) => {
			eventHandler(this.intervalInput.value, e);
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


	//щелчок по чекбоксу RANGE
	bindCheckIsRangeControl(checkedEventHandler: CBEvent,
		notCheckedEventHandler: CBEvent,
		adjustControlPosHandler: CBNoArgs) {

		this.isRangeToggleInput.addEventListener('change', (e) => {
			if (this.isRangeToggleInput.checked) {
				if (parseInt(this.fromInput.value) >=
					parseInt(this.toInput.value)) {
					adjustControlPosHandler();
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

	//Обновление значений инпута INTERVAL при изменении значения в инпуте STEP
	updateInterval(newValue: string) {
		this.intervalInput.value = newValue;
	}

	//Обновление значений инпута STEP при изменении значения в инпуте INTERVAL
	updateStep(newValue: string) {
		this.stepInput.value = newValue;
	}
}

export { sliderViewPanel };

