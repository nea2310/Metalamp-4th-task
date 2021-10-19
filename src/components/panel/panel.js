import './panel.scss';
class Panel {

	constructor(elemName, elem, slider) {
		this.elemName = elemName;
		this.elem = elem;
		this.slider = slider;
		this.render();
		//	this.updateMin();
	}
	getElem(name) {
		let wrapper = this.elem.querySelector(this.elemName + name);
		return wrapper.querySelector('input');
	}
	render() {
		this.min = this.getElem('__input-min');
		this.max = this.getElem('__input-max');
		this.from = this.getElem('__input-from');
		this.to = this.getElem('__input-to');
		this.interval = this.getElem('__input-interval');
		this.step = this.getElem('__input-step');
		this.shiftOnKeyDown = this.getElem('__input-shiftOnKeyDown');
		this.shiftOnKeyHold = this.getElem('__input-shiftOnKeyHold');

		this.vertical = this.getElem('__toggle-vertical');
		this.range = this.getElem('__toggle-range');
		this.scale = this.getElem('__toggle-scale');
		this.bar = this.getElem('__toggle-bar');
		this.tip = this.getElem('__toggle-tip');
		this.sticky = this.getElem('__toggle-sticky');

		let scaleBaseWrap =
			this.elem.querySelector(this.elemName + '__radiobuttons');
		this.scaleBase = scaleBaseWrap.querySelectorAll('input');
		this.scaleBaseSteps = scaleBaseWrap.querySelector('[value=steps]');
		this.scaleBaseIntervals =
			scaleBaseWrap.querySelector('[value=intervals]');
		//console.log(this.scaleBaseSteps);

	}

	updateMin(sliderObj) {
		this.min.addEventListener('input', (e) => {
			sliderObj.update({ min: parseFloat(e.target.value) });
		});
	}

	updateMax(sliderObj) {
		this.max.addEventListener('input', (e) => {
			sliderObj.update({ max: parseFloat(e.target.value) });
		});
	}

	updateFrom(sliderObj) {
		this.from.addEventListener('input', (e) => {
			sliderObj.update({ from: parseFloat(e.target.value) });
		});
	}

	updateTo(sliderObj) {
		this.to.addEventListener('input', (e) => {
			sliderObj.update({ to: parseFloat(e.target.value) });
		});
	}




	updateStep(sliderObj) {
		this.step.addEventListener('input', (e) => {
			sliderObj.update({ step: parseFloat(e.target.value) });
		});
	}

	updateInterval(sliderObj) {
		this.interval.addEventListener('input', (e) => {
			sliderObj.update({ intervals: parseFloat(e.target.value) });
		});
	}

	updateShiftOnKeyDown(sliderObj) {
		this.shiftOnKeyDown.addEventListener('input', (e) => {
			sliderObj.update({ shiftOnKeyDown: parseFloat(e.target.value) });
		});
	}

	updateShiftOnKeyHold(sliderObj) {
		this.shiftOnKeyHold.addEventListener('input', (e) => {
			sliderObj.update({ shiftOnKeyHold: parseFloat(e.target.value) });
		});
	}


	selectScaleBaseSteps(sliderObj) {
		this.scaleBaseSteps.addEventListener('change', (e) => {
			sliderObj.update({ scaleBase: e.target.value });
			this.interval.disabled = true;
			this.step.disabled = false;
		});
	}

	selectScaleBaseIntervals(sliderObj) {
		this.scaleBaseIntervals.addEventListener('change', (e) => {
			sliderObj.update({ scaleBase: e.target.value });
			this.interval.disabled = false;
			this.step.disabled = true;
		});
	}

	updateIsVertical(sliderObj) {
		this.vertical.addEventListener('change', (e) => {
			sliderObj.update({ vertical: e.target.checked });
		}
		);
	}

	updateIsRange(sliderObj) {
		this.range.addEventListener('change', (e) => {
			sliderObj.update({ range: e.target.checked });
		}
		);
	}




}
export { Panel };