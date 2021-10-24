import './panel.scss';
class Panel {

	constructor(elemName, elem, slider) {
		this.elemName = elemName;
		this.elem = elem;
		this.slider = slider;
		this.render();

	}
	getElem(name) {
		return this.elem.querySelector(this.elemName + name + ' input');
	}
	render() {
		this.min = this.getElem('__mainSetup-min');
		this.max = this.getElem('__mainSetup-max');
		this.from = this.getElem('__mainSetup-from');
		this.to = this.getElem('__mainSetup-to');
		this.interval = this.getElem('__scaleSetup-interval');
		this.step = this.getElem('__scaleSetup-step');
		this.shiftOnKeyDown = this.getElem('__moveSetup-shiftOnKeyDown');
		this.shiftOnKeyHold = this.getElem('__moveSetup-shiftOnKeyHold');

		this.vertical = this.getElem('__mainSetup-vertical');
		this.range = this.getElem('__mainSetup-range');
		this.scale = this.getElem('__scaleSetup-scale');
		this.bar = this.getElem('__mainSetup-bar');
		this.tip = this.getElem('__mainSetup-tip');
		this.sticky = this.getElem('__moveSetup-sticky');

		let scaleBaseWrap =
			this.elem.querySelector(this.elemName +
				'__scaleSetup-radiobuttons');
		this.scaleBaseSteps = scaleBaseWrap.querySelector('[value=steps]');
		this.scaleBaseIntervals =
			scaleBaseWrap.querySelector('[value=intervals]');
		this.inputs = this.elem.querySelectorAll('.input-field__input');
		this.correctInputVal();
	}
	//Если очищают поле - вставить в него 0 (чтобы не было ошибки)
	correctInputVal() {
		for (let elem of this.inputs) {
			elem.addEventListener('change', () => {
				if (!elem.value) {
					elem.value = '0';
				}
			});
		}
	}

	updateMin(sliderObj) {
		this.min.addEventListener('change', (e) => {
			sliderObj.update({ min: parseFloat(e.target.value) });
		});
	}

	updateMax(sliderObj) {
		this.max.addEventListener('change', (e) => {
			sliderObj.update({ max: parseFloat(e.target.value) });
		});
	}

	updateFrom(sliderObj) {
		this.from.addEventListener('change', (e) => {
			sliderObj.update({ from: parseFloat(e.target.value) });
		});
	}

	updateTo(sliderObj) {
		this.to.addEventListener('change', (e) => {
			sliderObj.update({ to: parseFloat(e.target.value) });
		});
	}

	updateStep(sliderObj) {
		this.step.addEventListener('change', (e) => {
			sliderObj.update({ step: parseFloat(e.target.value) });
		});
	}

	updateInterval(sliderObj) {
		this.interval.addEventListener('change', (e) => {
			sliderObj.update({ intervals: parseFloat(e.target.value) });
		});
	}

	updateShiftOnKeyDown(sliderObj) {
		this.shiftOnKeyDown.addEventListener('change', (e) => {
			sliderObj.update({ shiftOnKeyDown: parseFloat(e.target.value) });
		});
	}

	updateShiftOnKeyHold(sliderObj) {
		this.shiftOnKeyHold.addEventListener('change', (e) => {
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
		});
	}

	updateIsRange(sliderObj) {
		this.range.addEventListener('change', (e) => {
			sliderObj.update({ range: e.target.checked });
			this.to.disabled = e.target.checked ? false : true;
		});
	}

	updateIsSticky(sliderObj) {
		this.sticky.addEventListener('change', (e) => {
			sliderObj.update({ sticky: e.target.checked });
		});
	}


	updateIsScale(sliderObj) {
		this.scale.addEventListener('change', (e) => {
			sliderObj.update({ scale: e.target.checked });
		});
	}

	updateIsBar(sliderObj) {
		this.bar.addEventListener('change', (e) => {
			sliderObj.update({ bar: e.target.checked });
		});
	}

	updateIsTip(sliderObj) {
		this.tip.addEventListener('change', (e) => {
			sliderObj.update({ tip: e.target.checked });
		});
	}
}
export { Panel };