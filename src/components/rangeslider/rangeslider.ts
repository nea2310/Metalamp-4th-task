import './rangeslider.scss';
import { Panel } from './../panel/panel';
import {
	IConf,
	$Idata
} from './../../plugins/sliderMetaLamp/interface';


class SliderInstance {
	panel: Panel
	slider: any
	constructor(panel: string, slider: string) {
		let panelElem = document.querySelector(panel);
		this.panel = new Panel('.panel', panelElem);
		let panelWrapper = panelElem.parentElement;
		let rangeSlider = document.querySelector(slider);
		let sliderWrapper = rangeSlider.parentElement;
		let wrapper = panelElem.closest('.rangeslider');


		let setVertical = (flag: boolean) => {
			if (flag) {
				wrapper.classList.add('vertical');
				panelWrapper.classList.add('vertical');
				panelElem.classList.add('vertical');
				sliderWrapper.classList.add('vertical');
			} else {
				wrapper.classList.remove('vertical');
				panelWrapper.classList.remove('vertical');
				panelElem.classList.remove('vertical');
				sliderWrapper.classList.remove('vertical');
			}
		};

		this.slider = $(slider).Slider({
			// min: -20,
			// max: 100,
			// from: 10,
			// to: 50,
			// step: 1,
			// shiftOnKeyDown: 1,
			// shiftOnKeyHold: 2,
			// //scaleBase: 'steps',
			// intervals: 20,
			// //vertical: true,
			// sticky: false,
			// //range: false,

			onStart: (data: IConf) => {
				setVertical(data.vertical);
				this.panel.min.value = data.min;
				this.panel.max.value = data.max;
				this.panel.from.value = data.from;
				this.panel.to.value = data.to;
				this.panel.interval.value = data.intervals;
				this.panel.step.value = data.step;
				this.panel.shiftOnKeyDown.value = data.shiftOnKeyDown;
				this.panel.shiftOnKeyHold.value = data.shiftOnKeyHold;
				this.panel.vertical.checked = data.vertical;
				this.panel.range.checked = data.range;
				this.panel.scale.checked = data.scale;
				this.panel.bar.checked = data.bar;
				this.panel.tip.checked = data.tip;
				this.panel.sticky.checked = data.sticky;

				if (data.scaleBase == 'intervals') {
					this.panel.scaleBaseIntervals.checked = true;
					this.panel.step.disabled = true;
				}

				if (data.scaleBase == 'steps') {
					this.panel.scaleBaseSteps.checked = true;
					this.panel.interval.disabled = true;
				}
				this.panel.to.disabled = data.range ? false : true;

			},
			onUpdate: (data: IConf) => {
				setVertical(data.vertical);

				// let test = (param: string) => {
				// 	this.panel[param].value = this.panel[param].value !==
				// 		data[param] ? data[param] : this.panel[param].value;
				// };

				const valid = (
					item: HTMLInputElement,
					val: number | string | boolean
				) => {
					if (item.value != val)
						item.value = val as string;
				};


				const P = this.panel;
				const D = data;
				valid(P.from, D.from);
				valid(P.to, D.to);
				valid(P.min, D.min);
				valid(P.max, D.max);
				valid(P.shiftOnKeyDown, D.shiftOnKeyDown);
				valid(P.shiftOnKeyHold, D.shiftOnKeyHold);
				valid(P.interval, D.intervals);
				valid(P.step, D.step);

			},
			onChange: (data: IConf) => {
				this.panel.from.value = this.panel.from.value !==
					data.from ? data.from : this.panel.from.value;
				this.panel.to.value = this.panel.to.value !==
					data.to ? data.to : this.panel.to.value;
			}
		}).data('Slider'); // вернёт объект для одного элемента



		this.panel.updateMin(this.slider);
		this.panel.updateMax(this.slider);
		this.panel.updateFrom(this.slider);
		this.panel.updateTo(this.slider);
		this.panel.updateShiftOnKeyDown(this.slider);
		this.panel.updateShiftOnKeyHold(this.slider);
		this.panel.updateStep(this.slider);
		this.panel.updateInterval(this.slider);
		this.panel.selectScaleBaseSteps(this.slider);
		this.panel.selectScaleBaseIntervals(this.slider);
		this.panel.updateIsVertical(this.slider);
		this.panel.updateIsRange(this.slider);
		this.panel.updateIsSticky(this.slider);
		this.panel.updateIsScale(this.slider);
		this.panel.updateIsBar(this.slider);
		this.panel.updateIsTip(this.slider);
	}

}



// const panels = document.querySelectorAll('.panel');
// for (let i = 0; i < panels.length; i++)
// 	new SliderInstance(panels[i]);



new SliderInstance('.panel-1', '.rs__root-1');
new SliderInstance('.panel-2', '.rs__root-2');