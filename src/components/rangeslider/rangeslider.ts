import './rangeslider.scss';
import {
	IConf,
} from './../../plugins/sliderMetaLamp/mvc/interface';

class RangeSlider {
	slider: HTMLElement
	wrapper: HTMLElement
	panel: HTMLElement
	panelWrapper: HTMLElement
	sliderWrapper: HTMLElement
	rangeSlider: any //какой здесь должен быть тип?

	min: HTMLInputElement
	max: HTMLInputElement
	from: HTMLInputElement
	to: HTMLInputElement
	interval: HTMLInputElement
	step: HTMLInputElement
	shiftOnKeyDown: HTMLInputElement
	shiftOnKeyHold: HTMLInputElement
	vertical: HTMLInputElement
	range: HTMLInputElement
	scale: HTMLInputElement
	bar: HTMLInputElement
	tip: HTMLInputElement
	sticky: HTMLInputElement
	scaleBaseSteps: HTMLInputElement
	scaleBaseIntervals: HTMLInputElement
	inputsAll: HTMLInputElement[] = []
	selector: string
	isDestroyed: boolean
	isDisabled: boolean
	subscribe: HTMLInputElement
	destroy: HTMLInputElement
	disable: HTMLInputElement

	constructor(selector: string, elem: Element) {
		this.selector = selector;
		this.wrapper = elem as HTMLElement;
		this.panel = this.wrapper.querySelector('.js-panel');
		this.slider = this.wrapper.querySelector('.js-rs-metalamp');
		this.panelWrapper =
			this.wrapper.querySelector(this.selector + '__panel');
		this.sliderWrapper = this.wrapper.querySelector(this.selector + '__rs');
		this.renderPanel();
		this.renderSlider(this.slider);
		this.updateSlider();
		this.disableSlider();
		this.destroySlider(this.slider);
		this.subscribeSlider();
	}

	private valid(
		item: HTMLInputElement,
		val: number | string | boolean
	) {
		if (item.value != val)
			item.value = val as string;
	}

	private setVertical(flag: boolean) {
		if (flag) {
			this.wrapper.classList.add('vert'); // .rangeslider
			this.panelWrapper.classList.add('vert'); // .rangeslider__panel
			this.panel.classList.add('vert'); // .panel
			this.sliderWrapper.classList.add('vert'); //.rangeslider__rs
		} else {
			this.wrapper.classList.remove('vert');
			this.panelWrapper.classList.remove('vert');
			this.panel.classList.remove('vert');
			this.sliderWrapper.classList.remove('vert');
		}
	}

	private displayData(data: IConf) {
		const D = data;
		this.min.value = String(D.min);
		this.max.value = String(D.max);
		this.from.value = String(D.from);
		this.to.value = String(D.to);
		this.interval.value = String(D.interval);
		this.step.value = String(D.step);
		this.shiftOnKeyDown.value = String(D.shiftOnKeyDown);
		this.shiftOnKeyHold.value = String(D.shiftOnKeyHold);
		this.vertical.checked = D.vertical;
		this.range.checked = D.range;
		this.scale.checked = D.scale;
		this.bar.checked = D.bar;
		this.tip.checked = D.tip;
		this.sticky.checked = D.sticky;
		this.subscribe.checked = true;

		if (data.scaleBase == 'interval') {
			this.scaleBaseIntervals.checked = true;
			this.step.disabled = true;
		}

		if (data.scaleBase == 'step') {
			this.scaleBaseSteps.checked = true;
			this.interval.disabled = true;
		}
		this.to.disabled = D.range ? false : true;
	}

	private updateData = (data: IConf) => {
		this.setVertical(data.vertical);
		const D = data;
		this.valid(this.from, D.from);
		this.valid(this.to, D.to);
		this.valid(this.min, D.min);
		this.valid(this.max, D.max);
		this.valid(this.shiftOnKeyDown, D.shiftOnKeyDown);
		this.valid(this.shiftOnKeyHold, D.shiftOnKeyHold);
		this.valid(this.interval, D.interval);
		this.valid(this.step, D.step);
	};

	private changeData(data: IConf) {
		const D = data;
		this.valid(this.from, D.from);
		this.valid(this.to, D.to);
	}

	private createSlider(elem: HTMLElement) {
		const rangeSlider = $(elem).Slider({
			onStart: (data: IConf) => {
				this.displayData(data);
			},
			onUpdate: (data: IConf) => {
				this.updateData(data);
			},
			onChange: (data: IConf) => {
				this.changeData(data);
			}
		}).data('SliderMetaLamp'); // вернёт объект для одного элемента
		return rangeSlider;
	}

	private renderPanel() {
		const getElem = (name: string, addToInputsAll: boolean = true) => {
			const elem = this.panel.querySelector<HTMLInputElement>
				('.js-' + name);
			if (addToInputsAll) {
				this.inputsAll.push(elem);
			}
			return elem;
		};

		this.min = getElem('input-min');
		this.max = getElem('input-max');
		this.from = getElem('input-from');
		this.to = getElem('input-to');
		this.interval = getElem('input-interval');
		this.step = getElem('input-step');
		this.shiftOnKeyDown =
			getElem('input-shiftOnKeyDown');
		this.shiftOnKeyHold =
			getElem('input-shiftOnKeyHold');

		this.vertical = getElem('toggle-vertical');
		this.range = getElem('toggle-range');
		this.scale = getElem('toggle-scale');
		this.bar = getElem('toggle-bar');
		this.tip = getElem('toggle-tip');
		this.sticky = getElem('toggle-sticky');
		this.subscribe = getElem('toggle-subscribe');
		this.destroy = getElem('toggle-destroy', false);
		this.disable = getElem('toggle-disable', false);

		this.scaleBaseSteps = getElem('radio-step');
		this.scaleBaseIntervals = getElem('radio-interval');

		for (let elem of this.inputsAll) {
			elem.addEventListener('change', () => {
				if (!elem.value) {
					elem.value = '0';
				}
			});
		}
	}

	private renderSlider(slider: HTMLElement) {
		this.rangeSlider = this.createSlider(slider);
	}

	// API update
	private updateSlider() {
		let arr = ['min',
			'max',
			'from',
			'to',
			'step',
			'interval',
			'shiftOnKeyDown',
			'shiftOnKeyHold',
			'scaleBaseSteps',
			'scaleBaseIntervals',
			'vertical',
			'range',
			'sticky',
			'scale',
			'bar',
			'tip',
			'scaleBase'
		];
		this.panel.addEventListener('change', (e) => {
			if (!this.isDestroyed) {
				let target = e.target as HTMLInputElement;
				for (let elem of arr) {
					if (target.closest('.panel__' + elem)) {
						let value;
						if (target.type == 'checkbox') {
							value = target.checked;
						}
						else if (target.type == 'radio') {
							value = target.value;
						}
						else {
							value = parseFloat(target.value);
						}
						this.rangeSlider.update({ [elem]: value });
						if (elem == 'scaleBase') {
							if (value == 'interval') {
								this.interval.disabled = false;
								this.step.disabled = true;
							}
							if (value == 'step') {
								this.interval.disabled = true;
								this.step.disabled = false;
							}
						}
						if (elem == 'range') {
							this.to.disabled = target.checked ? false : true;
						}
						break;
					}
				}
			}
		});
	}

	// API disable
	private disableSlider() {
		this.disable.addEventListener(
			'click', () => {
				if (!this.isDestroyed) {
					if (this.disable.checked) {
						this.rangeSlider.disable();
						for (let elem of this.inputsAll) {
							elem.disabled = true;
						}
						this.isDisabled = true;
					}
					else {
						this.rangeSlider.enable();
						for (let elem of this.inputsAll) {
							elem.disabled = false;
						}
						const data = this.rangeSlider.getData();
						this.displayData(data);
						this.isDisabled = false;
					}
				}
			}
		);
	}

	private subscribeSlider() {
		this.subscribe.addEventListener(
			'click', () => {
				if (!this.isDestroyed) {
					if (this.subscribe.checked) {
						this.rangeSlider.update({
							onChange: (data: IConf) => {
								this.changeData(data);
							}
						});
					} else this.rangeSlider.update({
						onChange: null,
					});
				}
			}
		);
	}
	// API destroy
	private destroySlider(slider: HTMLElement) {
		this.destroy.addEventListener(
			'click', () => {
				if (this.destroy.checked) {
					this.rangeSlider.destroy();
					for (let elem of this.inputsAll) {
						elem.disabled = true;
					}
					this.disable.checked = true;
					this.disable.disabled = true;
					this.isDestroyed = true;
					// отвязать объект слайдера от DOM-элемента
					$.data(slider, 'SliderMetaLamp', null);
				}
				else {
					this.renderSlider(slider);
					for (let elem of this.inputsAll) {
						elem.disabled = false;
					}
					this.rangeSlider.getData();
					this.isDisabled = false;
					this.disable.checked = false;
					this.disable.disabled = false;
					this.isDestroyed = false;
				}
			}
		);
	}
}

function renderRangeSliders(selector: string) {
	let rangeSliders = document.querySelectorAll(selector);
	const mas: RangeSlider[] = [];
	for (let rangeSlider of rangeSliders) {
		mas.push(new RangeSlider(selector, rangeSlider));
	}
	return mas;
}

renderRangeSliders('.js-rangeslider');





