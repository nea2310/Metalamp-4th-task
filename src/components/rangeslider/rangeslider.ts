import './rangeslider.scss';
import { Panel } from './../panel/panel';
import {
	IConf,
	$Idata
} from './../../plugins/sliderMetaLamp/interface';


class RangeSlider {
	slider: HTMLElement
	wrapper: HTMLElement
	panel: HTMLElement
	panelWrapper: HTMLElement
	sliderWrapper: HTMLElement
	rangeSlider: any




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
			scaleBaseWrap.querySelector('[value=intervals]');
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
			this.interval.value = String(data.intervals);
			this.step.value = String(data.step);
			this.shiftOnKeyDown.value = String(data.shiftOnKeyDown);
			this.shiftOnKeyHold.value = String(data.shiftOnKeyHold);
			this.vertical.checked = data.vertical;
			this.range.checked = data.range;
			this.scale.checked = data.scale;
			this.bar.checked = data.bar;
			this.tip.checked = data.tip;
			this.sticky.checked = data.sticky;

			if (data.scaleBase == 'intervals') {
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
			valid(this.interval, D.intervals);
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



		// this.updateMin();
		// this.updateMax();
		// this.updateFrom();
		// this.updateTo();
		// this.updateShiftOnKeyDown();
		// this.updateShiftOnKeyHold();
		// this.updateStep();
		// this.updateInterval();
		// this.selectScaleBaseSteps();
		// this.selectScaleBaseIntervals();
		// this.updateIsVertical();
		// this.updateIsRange();
		// this.updateIsSticky();
		// this.updateIsScale();
		// this.updateIsBar();
		// this.updateIsTip();
		this.updateSlider();
	}

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
			'tip'

		];
		this.panel.addEventListener('change', (e) => {
			let target = e.target as HTMLInputElement;
			for (let elem of arr) {

				if (target.closest('.' + elem)) {
					console.log(target.closest('.' + elem));


					this.rangeSlider.
						update({ [elem]: parseFloat(target.value) });

					break;
				}
			}
			//console.log(target.closest('.max'));

			// if (arr.includes(target)) {
			// 	let fieldName =
			// 		target.parentElement.parentElement.parentElement.className;

			// this.rangeSlider.
			// 	update({ [fieldName]: parseFloat(target.value) });

			// }


		});
	}


	updateMin() {
		this.min.addEventListener('change', (e) => {
			let target = e.target as HTMLInputElement;
			this.rangeSlider.update({ min: parseFloat(target.value) });
		});
	}

	updateMax() {
		this.max.addEventListener('change', (e) => {
			let target = e.target as HTMLInputElement;
			this.rangeSlider.update({ max: parseFloat(target.value) });
		});
	}

	updateFrom() {
		this.from.addEventListener('change', (e) => {
			let target = e.target as HTMLInputElement;
			this.rangeSlider.update({ from: parseFloat(target.value) });
		});
	}

	updateTo() {
		this.to.addEventListener('change', (e) => {
			let target = e.target as HTMLInputElement;
			this.rangeSlider.update({ to: parseFloat(target.value) });
		});
	}


	updateStep() {
		this.step.addEventListener('change', (e) => {
			let target = e.target as HTMLInputElement;
			this.rangeSlider.update({ step: parseFloat(target.value) });
		});
	}


	updateInterval() {
		this.interval.addEventListener('change', (e) => {
			let target = e.target as HTMLInputElement;
			this.rangeSlider.update({ intervals: parseFloat(target.value) });
		});
	}

	updateShiftOnKeyDown() {
		this.shiftOnKeyDown.addEventListener('change', (e) => {
			let target = e.target as HTMLInputElement;
			this.rangeSlider.update({
				shiftOnKeyDown:
					parseFloat(target.value)
			});
		});
	}

	updateShiftOnKeyHold() {
		this.shiftOnKeyHold.addEventListener('change', (e) => {
			let target = e.target as HTMLInputElement;
			this.rangeSlider.update({
				shiftOnKeyHold:
					parseFloat(target.value)
			});
		});
	}

	//!//
	selectScaleBaseSteps() {
		this.scaleBaseSteps.addEventListener('change', (e) => {
			let target = e.target as HTMLInputElement;
			this.rangeSlider.update({ scaleBase: target.value });
			this.interval.disabled = true;
			this.step.disabled = false;
		});
	}
	//!//
	selectScaleBaseIntervals() {
		this.scaleBaseIntervals.addEventListener('change', (e) => {
			let target = e.target as HTMLInputElement;
			this.rangeSlider.update({ scaleBase: target.value });
			this.interval.disabled = false;
			this.step.disabled = true;
		});
	}

	updateIsVertical() {
		this.vertical.addEventListener('change', (e) => {
			let target = e.target as HTMLInputElement;
			this.rangeSlider.update({ vertical: target.checked });
		});
	}

	//!//
	updateIsRange() {
		this.range.addEventListener('change', (e) => {
			let target = e.target as HTMLInputElement;
			this.rangeSlider.update({ range: target.checked });
			this.to.disabled = target.checked ? false : true;
		});
	}

	updateIsSticky() {
		this.sticky.addEventListener('change', (e) => {
			let target = e.target as HTMLInputElement;
			this.rangeSlider.update({ sticky: target.checked });
		});
	}


	updateIsScale() {
		this.scale.addEventListener('change', (e) => {
			let target = e.target as HTMLInputElement;
			this.rangeSlider.update({ scale: target.checked });
		});
	}

	updateIsBar() {
		this.bar.addEventListener('change', (e) => {
			let target = e.target as HTMLInputElement;
			this.rangeSlider.update({ bar: target.checked });
		});
	}

	updateIsTip() {
		this.tip.addEventListener('change', (e) => {
			let target = e.target as HTMLInputElement;
			this.rangeSlider.update({ tip: target.checked });
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