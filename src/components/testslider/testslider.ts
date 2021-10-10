
import './testslider.scss';
import { sliderModel } from './model/model';
import { sliderView } from './view/view';
import { sliderViewScale } from './view/view-scale/view-scale';
import { sliderViewPanel } from './view/view-panel/view-panel';
import { sliderViewControl } from
	'./view/view-control/view-control';
import { sliderViewGrid } from
	'./view/view-grid/view-grid';
import { sliderViewBar } from './view/view-bar/view-bar';
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

new sliderController(root, conf,
	new sliderView(root, conf),
	new sliderModel(conf),
);


