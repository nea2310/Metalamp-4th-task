import './panel.scss';
class Panel {
	constructor(elemName, elem) {
		this.elemName = elemName;
		this.elem = elem;
		this.render();
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
	}
}
export { Panel };