
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
	min: -10,
	max: 10,
	from: 2,
	to: 7,
	step: 1,
	vertical: false
};

new sliderController(conf, root,
	new sliderView(root),
	new sliderViewScale(root),
	new sliderViewDoubleControl(root),
	new sliderViewPanel(root),
	new sliderModel(),
);


