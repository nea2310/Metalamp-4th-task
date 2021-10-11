
import './testslider.scss';
import { sliderModel, sliderView, sliderController }
	from './controller/controller';


interface RangeSliderOptions {
	type?: string;
	orientation?: string;
	theme?: string;
	min?: number;
	max?: number;
	from?: number;
	to?: number;
	grid?: boolean;
	gridSnap?: boolean;
	tipPrefix?: string;
	tipPostfix?: string;
	tipMinMax?: boolean;
	tipFromTo?: boolean;
	gridNum?: number;
	gridStep?: number;
	disabled?: boolean;
	onStart?: Function;
	onChange?: Function;
	onUpdate?: Function;
	onReset?: Function;
}

interface RangeSliderFoxFunction {
	// eslint-disable-next-line no-unused-vars
	(options: RangeSliderOptions): JQuery;
}


interface RangeSliderFox extends
	RangeSliderFoxFunction { }

interface JQuery {
	RangeSliderFox: RangeSliderFox;
}

// eslint-disable-next-line no-undef
$.fn.RangeSliderFox = function (options): JQuery {


	// return this.each(function (i: number, el: Element) {

	// 	if (!$.data(el, 'RangeSliderFox')) {
	// 		$.data(
	// 			el,
	// 			'RangeSliderFox',
	// 			new Controller(new Model(options), new View(el, i))
	// 		);
	// 	}

	// });

};


let root = '.rs__wrapper';

let conf = {
	min: -10,
	max: 100,
	from: 0,
	to: 70,
	step: 2,
	shiftOnKeyDown: 1,
	shiftOnKeyHold: 2,
	//sticky: false,
	//intervals: 26,
	//vertical: true,
	//range: false
};

new sliderController(
	new sliderModel(conf),
	new sliderView(root),
);


