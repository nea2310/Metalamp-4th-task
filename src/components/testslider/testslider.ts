
import { ModuleBody } from 'typescript';
import './testslider.scss';
import { sliderModel } from './model/model';
import { sliderView } from './view/view';
import { sliderViewScale } from './view/view-scale/view-scale';
import { sliderViewPanel } from './view/view-panel/view-panel';
import { sliderViewDoubleControl } from
	'./view/view-double-control/view-double-control';
import { sliderController } from './controller/controller';



let root = '.rs__wrapper';

let conf = {
	min: 500,
	max: 5000,
	from: 500,
	to: 5000,
	step: 100,
	//intervals: 8,
	vertical: false
};

new sliderController(conf, root,
	new sliderView(root),
	new sliderViewScale(root),
	new sliderViewDoubleControl(root),
	new sliderViewPanel(root),
	new sliderModel(),
);


