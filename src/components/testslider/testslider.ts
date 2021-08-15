
import { ModuleBody } from 'typescript';
import './testslider.scss';
import { sliderModel } from './model/model';
import { sliderView } from './view/view';
import { sliderViewScale } from './view/view-scale/view-scale';
import { sliderViewPanel } from './view/view-panel/view-panel';
import { sliderViewDoubleControl } from
	'./view/view-double-control/view-double-control';
import { sliderViewGrid } from
	'./view/view-grid/view-grid';
import { sliderController } from './controller/controller';



let root = '.rs__wrapper';

let conf = {
	min: 500,
	max: 1000,
	from: 600,
	to: 900,
	step: 100,
	//intervals: 8,
	vertical: false
};

new sliderController(conf, root,
	new sliderView(root),
	new sliderViewScale(root),
	new sliderViewDoubleControl(root),
	new sliderViewPanel(root),
	new sliderViewGrid(root),
	new sliderModel(),
);


