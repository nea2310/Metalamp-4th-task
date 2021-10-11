
import './testslider.scss';
import { sliderModel } from './model/model';
import { sliderView } from './view/view';
import { sliderController } from './controller/controller';




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


