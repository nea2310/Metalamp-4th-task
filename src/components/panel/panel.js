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

	selectScaleBase(sliderObj) {
		for (let elem of this.scaleBase) {
			elem.addEventListener('change', (e) => {
				sliderObj.update({ scaleBase: e.target.value });

			});
		}
	}



}
export { Panel };