
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
	min: -100000,
	max: 100000,
	from: 0,
	to: 70000,
	step: 10000,
	shiftOnKeyDown: 1,
	shiftOnKeyHold: 5,
	sticky: true,
	//intervals: 26,
	//vertical: true,
	//range: false
};

new sliderController(conf, root,
	new sliderView(root),
	new sliderViewScale(root),
	new sliderViewControl(root),
	new sliderViewPanel(root),
	new sliderViewGrid(root),
	new sliderViewBar(root),
	new sliderModel(conf),
);


