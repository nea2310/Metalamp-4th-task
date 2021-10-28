
import './rangeslider.scss';
import {
	IConf,
} from './../../plugins/sliderMetaLamp/interface';
//import 


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
	inputs: HTMLInputElement[]
	selector: string






	constructor(selector: string, elem: Element) {
		this.selector = selector;
		this.wrapper = elem as HTMLElement;
		this.panel = this.wrapper.querySelector('.panel');
		this.slider = this.wrapper.querySelector('.rs__root');
		this.panelWrapper =
			this.wrapper.querySelector(this.selector + '__panel');
		this.sliderWrapper = this.wrapper.querySelector(this.selector + '__rs');
		this.renderPanel();
		this.renderSlider(this.slider);
		this.updateSlider();


	}

	renderPanel() {
		const getElem = (name: string) => {
			return this.panel.querySelector<HTMLInputElement>
				('.' + name + ' input');
		};

		this.min = getElem('min');
		this.max = getElem('max');
		this.from = getElem('from');
		this.to = getElem('to');
		this.interval = getElem('interval');
		this.step = getElem('step');
		this.shiftOnKeyDown =
			getElem('shiftOnKeyDown');
		this.shiftOnKeyHold =
			getElem('shiftOnKeyHold');

		this.vertical = getElem('vertical');
		this.range = getElem('range');
		this.scale = getElem('scale');
		this.bar = getElem('bar');
		this.tip = getElem('tip');
		this.sticky = getElem('sticky');

		const scaleBaseWrap =
			this.panel.querySelector(
				'.radiobuttons');
		this.scaleBaseSteps = scaleBaseWrap.querySelector('[value=steps]');
		this.scaleBaseIntervals =
			scaleBaseWrap.querySelector('[value=interval]');
		const inputs = [...this.panel.querySelectorAll<HTMLInputElement>
			('.input-field__input')];

		for (let elem of inputs) {
			elem.addEventListener('change', () => {
				if (!elem.value) {
					elem.value = '0';
				}
			});
		}
	}

	renderSlider(slider: HTMLElement) {
		const setVertical = (flag: boolean) => {
			if (flag) {
				this.wrapper.classList.add('vertical');
				this.panelWrapper.classList.add('vertical');
				this.panel.classList.add('vertical');
				this.sliderWrapper.classList.add('vertical');
			} else {
				this.wrapper.classList.remove('vertical');
				this.panelWrapper.classList.remove('vertical');
				this.panel.classList.remove('vertical');
				this.sliderWrapper.classList.remove('vertical');
			}
		};

		const valid = (
			item: HTMLInputElement,
			val: number | string | boolean
		) => {
			if (item.value != val)
				item.value = val as string;
		};

		const displayData = (data: IConf) => {
			setVertical(data.vertical);
			this.min.value = String(data.min);
			this.max.value = String(data.max);
			this.from.value = String(data.from);
			this.to.value = String(data.to);
			this.interval.value = String(data.interval);
			this.step.value = String(data.step);
			this.shiftOnKeyDown.value = String(data.shiftOnKeyDown);
			this.shiftOnKeyHold.value = String(data.shiftOnKeyHold);
			this.vertical.checked = data.vertical;
			this.range.checked = data.range;
			this.scale.checked = data.scale;
			this.bar.checked = data.bar;
			this.tip.checked = data.tip;
			this.sticky.checked = data.sticky;

			if (data.scaleBase == 'interval') {
				this.scaleBaseIntervals.checked = true;
				this.step.disabled = true;
			}

			if (data.scaleBase == 'steps') {
				this.scaleBaseSteps.checked = true;
				this.interval.disabled = true;
			}
			this.to.disabled = data.range ? false : true;
		};

		const updateData = (data: IConf) => {
			setVertical(data.vertical);
			const D = data;
			valid(this.from, D.from);
			valid(this.to, D.to);
			valid(this.min, D.min);
			valid(this.max, D.max);
			valid(this.shiftOnKeyDown, D.shiftOnKeyDown);
			valid(this.shiftOnKeyHold, D.shiftOnKeyHold);
			valid(this.interval, D.interval);
			valid(this.step, D.step);
		};

		const changeData = (data: IConf) => {
			const D = data;
			valid(this.from, D.from);
			valid(this.to, D.to);
		};


		this.rangeSlider = $(slider).Slider({
			onStart: (data: IConf) => {
				displayData(data);
			},
			onUpdate: (data: IConf) => {
				updateData(data);
			},
			onChange: (data: IConf) => {
				changeData(data);
			}
		}).data('Slider'); // вернёт объект для одного элемента

		console.log(this.rangeSlider);

	}

	// API update
	updateSlider() {
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
			let target = e.target as HTMLInputElement;

			for (let elem of arr) {
				if (target.closest('.' + elem)) {
					let value;
					if (target.type == 'checkbox') {
						value = target.checked;
					}
					if (target.type == 'radio') {
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
						if (value == 'steps') {
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
		});
	}
}

function renderRangeSliders(selector: string) {
	let rangeSliders = document.querySelectorAll(selector);
	for (let rangeSlider of rangeSliders) {
		new RangeSlider(selector, rangeSlider);
	}
}
renderRangeSliders('.rangeslider');