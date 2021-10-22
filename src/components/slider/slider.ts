import './slider.scss';
import { Panel } from './../panel/panel';
import {
	IConf,
	$Idata
} from './../../plugins/slider/interface';


class SliderInstance {
	panel: Panel
	slider: any
	constructor(panel: string, slider: string) {
		let panelElem = document.querySelector(panel);
		this.panel = new Panel('.panel', panelElem);

		this.slider = $(slider).Slider({
			min: 10,
			max: 100,
			from: 20,
			to: 50,
			step: 1,
			shiftOnKeyDown: 1,
			shiftOnKeyHold: 2,
			//scaleBase: 'steps',
			intervals: 0,
			vertical: true,
			//	sticky: false,

			onStart: (data: IConf) => {
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
				} else {
					this.panel.scaleBaseSteps.checked = true;
					this.panel.interval.disabled = true;
				}
				this.panel.to.disabled = data.range ? false : true;

			},
			onUpdate: (data: IConf) => {
				this.panel.from.value = this.panel.from.value !==
					data.from ? data.from : this.panel.from.value;
				this.panel.to.value = this.panel.to.value !==
					data.to ? data.to : this.panel.to.value;

				this.panel.min.value = this.panel.min.value !==
					data.min ? data.min : this.panel.min.value;
				this.panel.max.value = this.panel.max.value !==
					data.max ? data.max : this.panel.max.value;


				this.panel.shiftOnKeyDown.value =
					this.panel.shiftOnKeyDown.value !==
						data.shiftOnKeyDown ? data.shiftOnKeyDown :
						this.panel.shiftOnKeyDown.value;
				this.panel.shiftOnKeyHold.value =
					this.panel.shiftOnKeyHold.value !==
						data.shiftOnKeyHold ? data.shiftOnKeyHold :
						this.panel.shiftOnKeyHold.value;


				this.panel.interval.value = this.panel.interval.value !==
					data.intervals ? data.intervals : this.panel.interval.value;
				this.panel.step.value = this.panel.step.value !==
					data.step ? data.step : this.panel.step.value;
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

const Slider1 = new SliderInstance('.panel-horizontal', '.rs__wrapper-hor');
const Slider2 = new SliderInstance('.panel-vertical', '.rs__wrapper-vert');